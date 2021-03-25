import expressionHelper from './expressionHelper.js';
import functions from './functions.js';
import Transformer from './transformer.js';
class JsonTransformer extends Transformer {
    constructor(context) {
        super(context);
    }

    transform(transformerJson, inputJson) {
        if (typeof inputJson === 'string') {
            inputJson = JSON.parse(inputJson);
        }

        if (typeof transformerJson === 'string') {
            transformerJson = JSON.parse(transformerJson);
        }

        if (typeof inputJson !== 'object') {
            throw 'Input not an object!';
        }

        if (typeof transformerJson !== 'object') {
            throw 'Transformer not an object!';
        }

        return this.recursiveEvaluate(transformerJson, inputJson, null, null, null);
    }

    recursiveEvaluate(parentToken, inputJson, parentArray, currentElementArray, idx) {
        let result = parentToken;
        if (result) {
            if (Array.isArray(result)) {
                result = this.parseArray(result, inputJson, parentArray, currentElementArray, idx);
            } else if (typeof result === 'string') {
                if (result.trim().startsWith('#')) {
                    result = this.parseFunction(result, inputJson, parentArray, currentElementArray, idx);
                }
            } else {
                let keys = Object.keys(result);
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    const token = result[key];
                    if (key && key.trim().startsWith('#')) {
                        let fnResult = this.parseKeyFunction(key, token, inputJson, parentArray, currentElementArray, idx);
                        this.handleEvaluationMode(fnResult);

                        if (currentElementArray) {
                            result = Object.assign({}, result);
                        }
                        delete result[key];

                        if (Array.isArray(fnResult)) {
                            result = fnResult;
                        } else {
                            result = typeof fnResult === 'string' ? fnResult : Object.assign(result, fnResult);
                        }
                    } else if (token) {
                        if (Array.isArray(token) && result !== "#" ) {
                            result[key] = this.parseArray(token, inputJson, parentArray, currentElementArray, idx);
                        } else if (typeof token === 'string') {
                            result[key] = this.parseFunction(token, inputJson, parentArray, currentElementArray, idx);
                        } else {
                            result[key] = this.recursiveEvaluate(token, inputJson, parentArray, currentElementArray, idx);
                        }
                    }
                }
            }
        }
        return result;
    }

    parseArray(arr, inputJson, parentArray, currentArrayElement, idx) {
        let result = {};
        arr.forEach(el => {
            let r = this.parseFunction(el, inputJson, parentArray, currentArrayElement, idx);
            result = Object.assign(result, r);
        });
        return result;
    }

    parseKeyFunction(key, token, inputJson, parentArray, currentElementArray, idx) {
        let result = {};
        let output = this.parseFunction(key, inputJson, parentArray, currentElementArray, idx);
        if (output || output === 0) {
            if (output.isProperty) {
                result[output.value] = this.recursiveEvaluate(token, inputJson, parentArray, currentElementArray, idx);
                //return output;
            }
            else if (output.loop) {
                let alias = output.alias;
                let elements = output.elements;

                if (!parentArray) {
                    parentArray = { root: inputJson };
                }
                if (!parentArray[alias]) {
                    parentArray[alias] = elements;
                }
                if (!currentElementArray) {
                    currentElementArray = {};
                }
                currentElementArray[alias] = parentArray[alias];
                result = this.parseLoop(token, elements, parentArray, currentElementArray);
                delete currentElementArray[alias];
            } else {
                result = this.recursiveEvaluate(token, inputJson, parentArray, currentElementArray, idx);
            }
        } else if (output === false) {
            result = {};
        }
        return result;
    }

    parseLoop(token, elements, parentArray, currentElementArray) {
        let result = null;
        let arr = null;
        let properties = false;
        let values = null;
        let loopKeys = null;
        if (Array.isArray(elements)) {
            arr = elements;
            result = [];            
        } else {
            if (!elements) {
                return null;
            }
            result = {};
            let v = Object.entries(elements);
            arr = v.map(el => el[0]);
            values = v.map(el => el[1]);
            properties = true;
            loopKeys = Object.keys(token);
        }

        arr.forEach((el, i) => {
            if (properties) {
                loopKeys.forEach((k, i) => {
                    let prop = el;
                    if (k.startsWith('#')) {
                        prop = this.parseKeyFunction(k, token, elements[el], parentArray, currentElementArray, i);
                        // let o = {};
                        // o[p] = null;
                        result = Object.assign(result, prop); 
                    } else {
                        var input = { };
                        Object.defineProperty(input, prop, { value: null });
                        
                        let newObj = this.recursiveEvaluate(typeof token === 'string' ? token : Object.assign({}, token), elements[el], parentArray, currentElementArray['loop' + this._loopCounter], i);
                        result = Object.assign(result, newObj);
                    }
                });
            } else {
                let loopVal = this.recursiveEvaluate(typeof token === 'string' ? token : Object.assign({}, token), el, parentArray, currentElementArray['loop' + this._loopCounter], i);
                result.push(loopVal);
            }
        });
        
        return result;
    }

    parseFunction(str, inputJson, parentArray, currentElementArray, idx) {
        let result = str;
        let func = expressionHelper.tryParseFunctionNameAndArguments(str);
        if (func.success) {
            let functionName = func.functionName;
            let args = func.arguments;
    
            args = expressionHelper.splitArguments(args);
            if (functionName === 'ifcondition') {
                let condition = this.parseArgument(args[0], inputJson, parentArray, currentElementArray, idx);
                let val = this.parseArgument(args[1], inputJson, parentArray, currentElementArray, idx);
                var index = condition.toString().toLowerCase() == val.toString().toLowerCase() ? 2 : 3;
                result = this.parseArgument(args[index], inputJson, parentArray, currentElementArray, idx);
                return result;
            } else if (Array.isArray(args)) {
                args.forEach((el, i) => {
                    args[i] = this.recursiveEvaluate(el, inputJson, parentArray, currentElementArray, idx);
                });
                if (currentElementArray) {
                    //let j = Object.keys(currentElementArray);
                    //args.push(currentElementArray[j[j.length - 1]]);
                    args.push(currentElementArray);
                    args.push(idx);
                }
                result = functions.execute(functionName, args, inputJson);
            }

            if (functionName === 'loop') {
                result = { loop: true, alias: args[1] ? args[1] : 'loop' + ++this._loopCounter, elements: result };
            } /* else if (functionName === 'eval') {
                result = { isProperty: true, value: result }
            } */
        }
        return result;
    }

    parseArgument(argument, inputJson, parentArray, currentArrayElement, idx) {
        let trimmedArgument = argument.trim();
        if (trimmedArgument.startsWith("#"))
        {
            return this.parseFunction(trimmedArgument, inputJson, parentArray, currentArrayElement, idx);
        }
        if (trimmedArgument.startsWith(expressionHelper.escapeChar + '#'))
        {
            return expressionHelper.unescapeSharp(argument);
        }
        return argument;
    }
}

export default JsonTransformer;
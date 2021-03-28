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
                        } else if (fnResult === null) {
                            return null;
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
        let properties = false;
        let output = this.parseFunction(key, inputJson, parentArray, currentElementArray, idx);
        if (output || output === 0) {
            if (output.isProperty) {
                return output;
            }
            else if (output.isLoop) {
                let alias = 'loop' + ++this._loopCounter;
                let elements = null;
                if (Array.isArray(output.value)) { 
                    elements = output.value;
                } else if (output.value && Object.keys(output.value).length > 0) {
                    elements = Object.entries(output.value).reduce((arr, el) => {
                            let obj = {};
                            obj[el[0]] = el[1];
                            arr.push(obj);
                            return arr;
                        }, []);
                    properties = true;
                } else {
                    elements = output.value;
                }

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
                result = this.parseLoop(token, elements, properties, parentArray, currentElementArray);
                delete currentElementArray[alias];
            } else {
                result = this.recursiveEvaluate(token, inputJson, parentArray, currentElementArray, idx);
            }
        } else if (output === false) {
            result = {};
        }
        return result;
    }

    parseLoop(token, elements, isPropertyLoop, parentArray, currentElementArray) {
        if (!elements) {
            return null;
        }
        let result = isPropertyLoop ? {} : [];
        if (!Array.isArray(elements) && !Object.keys(elements).length > 0) {
            return elements;
        }

        let loopKeys = Object.keys(token);
        elements.forEach((el, i) => {
            if (isPropertyLoop) {
                loopKeys.forEach(key => {
                    let prop = el;
                    if (key.startsWith('#')) {
                        prop = this.parseKeyFunction(key, token, el, parentArray, currentElementArray, i);
                        result[prop.value] = this.parseFunction(token[loopKeys], el, parentArray, currentElementArray);
                    } else {
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
                    args.push(currentElementArray);
                    args.push(idx);
                }
                result = functions.execute(functionName, args, inputJson);
            }
        }
        return result.isProperty || result.isLoop || typeof result == 'string' ? result : result.value;
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
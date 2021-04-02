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

        let currentArrayElement = {};
        currentArrayElement.root = inputJson;
        return this.recursiveEvaluate(transformerJson, inputJson, currentArrayElement);
    }

    recursiveEvaluate(parentToken, inputJson, currentElementArray) {
        let result = parentToken;
        if (result) {
            if (Array.isArray(result)) {
                result = this.parseArray(result, inputJson, currentElementArray);
            } else if (typeof result === 'string') {
                if (result.trim().startsWith('#')) {
                    result = this.parseFunction(result, inputJson, currentElementArray);
                }
            } else {
                let keys = Object.keys(result);
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    const token = result[key];
                    if (key && key.trim().startsWith('#')) {
                        let fnResult = this.parseKeyFunction(key, token, inputJson, currentElementArray);
                        this.handleEvaluationMode(fnResult);

                        if (Object.keys(currentElementArray).length > 1) {
                            result = Object.assign({}, result);
                        }
                        delete result[key];

                        if (Array.isArray(fnResult)) {
                            result = fnResult;
                        } else if (fnResult === null) {
                            return null;
                        } else if (fnResult.isProperty) {
                            result[fnResult.value] = typeof token === 'string' ? 
                                this.parseFunction(token, inputJson, currentElementArray) :
                                this.recursiveEvaluate(token, inputJson, currentElementArray);
                        } else {
                            result = typeof fnResult === 'string' ? fnResult : Object.assign(result, fnResult);
                        }
                    } else if (token) {
                        if (Array.isArray(token) && result !== "#" ) {
                            result[key] = this.parseArray(token, inputJson, currentElementArray);
                        } else if (typeof token === 'string') {
                            result[key] = this.parseFunction(token, inputJson, currentElementArray);
                        } else {
                            result[key] = this.recursiveEvaluate(token, inputJson, currentElementArray);
                        }
                    }
                }
            }
        }
        return typeof result === 'string' ? expressionHelper.unescapeSharp(result) : result;
    }

    parseArray(arr, inputJson, currentArrayElement) {
        let result = null;
        arr.forEach(el => {
            if (Object.keys(currentArrayElement).length > 1) {
                if (result) {
                    inputJson = result;
                }
            }
            if (!result) {
                result = {};
            }

            let r = this.parseFunction(el, inputJson, currentArrayElement);
            if (r && r.replaceElement) {
                result = Object.assign(result, r.result);
            }
            else {
                result = Object.assign(result, !r || typeof r.result === 'undefined' ? r : r.result);
            }
        });
        return result;
    }

    parseKeyFunction(key, token, inputJson, currentElementArray) {
        let result = {};
        let properties = false;
        let output = this.parseFunction(key, inputJson, currentElementArray);
        if (output || output === 0) {
            if (output.isProperty) {
                return output;
            }
            else if (output.isLoop) {
                let alias = output.alias ? output.alias : 'loop' + ++this._loopCounter;
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
                result = this.parseLoop(token, elements, alias, properties, currentElementArray);
            } else {
                result = this.recursiveEvaluate(token, inputJson, currentElementArray);
            }
        } else if (output === false) {
            result = {};
        }
        return result;
    }

    parseLoop(token, elements, alias, isPropertyLoop, currentElementArray) {
        if (!elements) {
            return null;
        }
        
        let result = isPropertyLoop ? {} : [];
        if (!Array.isArray(elements) && !Object.keys(elements).length > 0) {
            return elements;
        }

        let loopKeys = Object.keys(token);
        elements.forEach(el => {

            currentElementArray[alias] = el;
            
            if (isPropertyLoop) {
                loopKeys.forEach(key => {
                    let prop = el;
                    if (key.startsWith('#')) {
                        prop = this.parseKeyFunction(key, token, el, currentElementArray);
                        result[prop.value] = this.parseFunction(token[loopKeys], el, currentElementArray);
                    } else {
                        let newObj = this.recursiveEvaluate(typeof token === 'string' ? token : Object.assign({}, token), elements[el], currentElementArray);
                        result = Object.assign(result, newObj);
                    }
                });
            } else {
                let loopVal = this.recursiveEvaluate(typeof token === 'string' ? token : Object.assign({}, token), elements, currentElementArray);
                result.push(loopVal);
            }
        });
        
        delete currentElementArray[alias];
        return result;
    }

    parseFunction(str, inputJson, currentElementArray) {
        let result = str;
        let func = expressionHelper.tryParseFunctionNameAndArguments(str);
        if (func.success) {
            let functionName = func.functionName;
            let args = func.arguments;
    
            args = expressionHelper.splitArguments(args);
            if (functionName === 'ifcondition') {
                let condition = this.parseArgument(args[0], inputJson, currentElementArray);
                let val = this.parseArgument(args[1], inputJson, currentElementArray);
                var index = condition.toString().toLowerCase() == val.toString().toLowerCase() ? 2 : 3;
                result = this.parseArgument(args[index], inputJson, currentElementArray);
                return result;
            } else if (Array.isArray(args)) {
                args.forEach((el, i) => {
                    args[i] = this.recursiveEvaluate(el, inputJson, currentElementArray);
                });
                if (Object.keys(currentElementArray).length > 1) {
                    args.push(currentElementArray)
                }
                result = functions.execute(functionName, args, inputJson);
            }
        }
        return result.isProperty || result.isLoop ? result : 
            typeof result === 'string' ? expressionHelper.unescapeSharp(result) : 
            result.value;
    }

    parseArgument(argument, inputJson, currentArrayElement) {
        let trimmedArgument = argument.trim();
        if (trimmedArgument.startsWith("#"))
        {
            return this.parseFunction(trimmedArgument, inputJson, currentArrayElement);
        }
        if (trimmedArgument.startsWith(expressionHelper.escapeChar + '#'))
        {
            return expressionHelper.unescapeSharp(argument);
        }
        return argument;
    }
}

export default JsonTransformer;
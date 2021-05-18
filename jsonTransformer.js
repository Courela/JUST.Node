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
        currentArrayElement.root = { element: inputJson, index: null };
        if (Array.isArray(transformerJson)) {
            return this.transformArray(transformerJson, inputJson, currentArrayElement);
        } else {
            return this.recursiveEvaluate(transformerJson, inputJson, currentArrayElement);
        }
    }

    transformArray(transformerJson, inputJson, currentArrayElement) {
        let result = [];
        transformerJson.forEach(item => {
            let output = this.recursiveEvaluate(item, inputJson, currentArrayElement);
            result = this.handleEvaluationMode(output, result);
        });
        return result;
    }

    recursiveEvaluate(parentToken, inputJson, currentElementArray, isBulk) {
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
                let bulkResult = null;
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    const token = result[key] ? result[key] : parentToken[key];
                    if (key && key.trim().startsWith('#')) {
                        let output =  this.parseKeyFunction(key, token, inputJson, currentElementArray);
                        let fnResult = output.value;
                        isBulk = output.isBulk;

                        if (fnResult && typeof fnResult.value !== 'undefined' && typeof fnResult.value.msg !== 'undefined') {
                            throw fnResult.value.msg;
                        }

                        if (Object.keys(currentElementArray).length > 1) {
                            result = Object.assign({}, result);
                        }
                        delete result[key];

                        if (Array.isArray(fnResult)) {
                            if (Array.isArray(result)) {
                                fnResult.forEach(el => result.push(el));
                            } else {
                                result = fnResult;
                            }
                        } else if (fnResult === null) {
                            return null;
                        } else if (output.isProperty) {
                            result[fnResult] = typeof token === 'string' ? 
                                this.parseFunction(token, inputJson, currentElementArray) :
                                this.recursiveEvaluate(token, inputJson, currentElementArray);
                        } else {
                            if (this.isAddOrReplaceProperties(isBulk)) {
                                bulkResult = this.addOrReplaceProperties({}, fnResult);
                                if (i === keys.length - 1) {
                                    result = Object.assign(bulkResult, result);
                                }
                            } else {
                                result = typeof fnResult === 'string' ? 
                                    fnResult :  
                                    Object.assign(result, bulkResult ? bulkResult : fnResult);
                            }
                        }
                    } else if (token) {
                        let output = null;
                        if (Array.isArray(token) && result !== "#" ) {
                            output = this.parseArray(token, inputJson, currentElementArray);
                        } else if (typeof token === 'string') {
                            output = this.parseFunction(token, inputJson, currentElementArray);
                        } else {
                            output = this.recursiveEvaluate(token, inputJson, currentElementArray, isBulk);
                        }

                        output = this.handleEvaluationMode(output);
                        result[key] = output;
                        if (bulkResult && i === keys.length - 1) {
                            result = this.addOrReplaceProperties(result, bulkResult);
                        }
                    }
                }
            }
            
        }
        result = this.handleEvaluationMode(result);
        return typeof result === 'string' ? expressionHelper.unescapeSharp(result) : result;
    }

    parseArray(arr, inputJson, currentArrayElement) {
        let result = [];
        arr.forEach(el => {
            let output = this.recursiveEvaluate(el, inputJson, currentArrayElement);
            result.push(!output || typeof output.result === 'undefined' ? output : output.result);
        
        });
        return result ? Array.isArray(result) ? result : [ result ] : [];
    }

    parseKeyFunction(key, token, inputJson, currentElementArray) {
        let result = {};
        let properties = false;
        let isBulk = false;
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
            } else if (output.isBulk) {
                result = this.parseBulk(token, inputJson, currentElementArray);
                isBulk = true;
            } else {
                result = this.recursiveEvaluate(token, inputJson, currentElementArray);
            }
        } else if (output === false) {
            result = {};
        }
        return { value: result && result.value ? result.value : result, isProperty: result && result.isProperty ? result.isProperty : false, isLoop: result && result.isLoop ? result.isLoop : false , isBulk };
    }

    parseLoop(token, elements, alias, isPropertyLoop, currentElementArray) {
        if (!elements) {
            return null;
        }
        
        let result = isPropertyLoop && typeof token !== 'string' ? {} : [];
        if (!Array.isArray(elements) && !Object.keys(elements).length > 0) {
            return elements;
        }

            let loopKeys = typeof token !== 'string' ? Object.keys(token) : [ token ];
            elements.forEach((el, i) => {

            currentElementArray[alias] = { element: el, index: i };
            
            if (isPropertyLoop && typeof token !== 'string') {
                //for loop over properties, properties cannot be string numbers, 
                //it will convert automatically to numbers 
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
        return { value: result };
    }

    parseBulk(token, inputJson, currentArrayElement) {
        let result = { };
        token.forEach(el => {
            if (el.startsWith('#replace') || el.startsWith('#delete')) {
                inputJson = result;
            }

            if (el.startsWith('#replace')) {
                let func = expressionHelper.tryParseFunctionNameAndArguments(el);
                if (func.success) {
                    let functionName = func.functionName;
                    let args = func.arguments;
            
                    args = expressionHelper.splitArguments(args);
                    args[0] = this.parseFunction(args[0], inputJson, currentArrayElement);
                    args[1] = this.parseFunction(args[1], inputJson, currentArrayElement);;
                    let output = functions.execute(functionName, args, result, this.customFunctions, true);
                    result = output.value.value;
                }
            } else {
                let output = this.parseFunction(el, inputJson, currentArrayElement, true);
                if (output && output.replaceElement) {
                    result = Object.assign(result, output.value);
                } else {
                    this.validateKeys(output.value, result);
                    result = Object.assign(result, output.value);
                }
            }
        });
        return { isBulk: true, value: result };
    }

    validateKeys(output, result) {
        let outputKeys = Object.keys(output);
        let resultKeys = Object.keys(result);
        
        outputKeys.forEach(k => {
            if (typeof output[k] === 'object' && typeof result[k] === 'object' && resultKeys.includes(k)) {
                this.validateKeys(output[k], result[k]);
            } else if (resultKeys.includes(k) && !this.isAddOrReplaceProperties(true)) {
                throw { msg: 'Key already exists: ' + k };
            }
        });
    }

    parseFunction(str, inputJson, currentElementArray, isBulk) {
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
                if (functionName !== 'applyover') {
                    args.forEach((el, i) => {
                        args[i] = this.recursiveEvaluate(el, inputJson, currentElementArray);
                    });
                }
                if (Object.keys(currentElementArray).length > 1) {
                    args.push(currentElementArray)
                }
                result = functions.execute(functionName, args, inputJson, this.customFunctions, isBulk);
            }
        }
        return !!!result || result.isProperty || result.isLoop ? 
            result : 
            typeof result === 'string' ?
                result === "#" ?
                    { isBulk: true, value: result } :  
                    expressionHelper.unescapeSharp(result) : 
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
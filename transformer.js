class Transformer {
    constructor(context) {
        this.context = context ? 
            (context.evaluationMode ? context : Object.assign(context, { evaluationMode: 'fallbackToDefault'})) : 
            { evaluationMode: 'fallbackToDefault'};
        this._loopCounter = 0;

        this.customFunctions = {};
    }

    registerCustomFunction(alias, fn) {
        this.customFunctions[alias] = fn;
    }

    handleEvaluationMode(result, previousResult) {
        if (Array.isArray(this.context.evaluationMode)) {
            this.context.evaluationMode.forEach(el => {
                    result = this.parseEvaluationMode(el, result, previousResult);      
            });
            if (Array.isArray(previousResult) && !this.context.evaluationMode.includes('joinArrays')) {
                previousResult.push(result);
                result = previousResult;
            }
        } else if (typeof this.context.evaluationMode === 'string') {
            result = this.parseEvaluationMode(this.context.evaluationMode, result, previousResult);
            if (Array.isArray(previousResult) && this.context.evaluationMode !== 'joinArrays') {
                previousResult.push(result);
                result = previousResult;
            }
        }
        return result;
    }

    parseEvaluationMode(evaluationMode, result, previousResult) {
        if (evaluationMode === 'fallbackToDefault') {
            result = this.fallbackToDefault(result);
        } else if (evaluationMode === 'strict') {
            result = this.strictMode(result);
        } else if (evaluationMode === 'joinArrays') {
            result = this.joinArrays(result, previousResult);
        }
        return result;
    }

    fallbackToDefault(result) {
        if (result && typeof result.default !== 'undefined') {
            return result.default;
        }
        return result;
    }

    strictMode(result) {
        if (result && typeof result.msg !== 'undefined') {
            throw result.msg;
        }
        return result;
    }

    joinArrays(result, previousResult) {
        if (typeof previousResult === 'undefined') {
            return result;
        }

        if (Array.isArray(result)) {
            result.forEach(el => {
                previousResult.push(el);
            });
        } else {
            if (Array.isArray(previousResult)) {
                previousResult.push(result);
            }
        }
        return previousResult; 
    }

    isAddOrReplaceProperties(isToEvaluate) {
        return isToEvaluate && this.context && this.context.evaluationMode && 
            ((Array.isArray(this.context.evaluationMode) && this.context.evaluationMode.includes('addOrReplaceProperties')) ||
             (this.context.evaluationMode === 'addOrReplaceProperties'));
    }

    addOrReplaceProperties(result, previousResult) {
        if (typeof previousResult === 'undefined') {
            return result;
        }
        if (typeof result === 'object' && !Array.isArray(result) && typeof previousResult === 'object') {
            let keysResult = Object.keys(result);
            let keysPrevious = Object.keys(previousResult);
            keysResult.forEach(el => {
                if (keysPrevious.includes(el)) {
                    previousResult[el] = this.addOrReplaceProperties(result[el], previousResult[el]);
                } else {
                    previousResult[el] = result[el];
                }
            });
            result = previousResult;
        }
        return result;
    }
}

export default Transformer;
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

    // transform(transformerJson, inputJson) {
    // }

    handleEvaluationMode(result, previousResult) {
        if (this.context) {
            if (Array.isArray(this.context.evaluationMode)) {
                this.context.evaluationMode.forEach(el => {
                     result = this.parseEvaluationMode(el, result, previousResult);      
                });
            } else if (typeof this.context.evaluationMode === 'string') {
                result = this.parseEvaluationMode(this.context.evaluationMode, result, previousResult);
            }
        }
        return result;
    }

    parseEvaluationMode(evaluationMode, result) {
        if (evaluationMode === 'fallbackToDefault') {
            result = this.fallbackToDefault(result);
        } else if (evaluationMode === 'strict') {
            result = this.strictMode(result);
        } else if (evaluationMode === 'joinArrays') {
            result = this.joinArrays(result);
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
        // let output = [];
        if (typeof previousResult === 'undefined') {
            return result;
        }

        if (Array.isArray(result)) {
            result.forEach(el => {
                previousResult.push(el);
            });
        // } else if (typeof result === 'object') {
        //     let keys = Object.keys(result);
        //     keys.forEach(el => {
        //         if (Array.isArray(result[el])) {
        //             output = output.push(result);
        //         } else {
        //             return result;
        //         }
        //     });
        }
        return previousResult; 
        //output.length > 0 ? output : result;
    }
}

export default Transformer;
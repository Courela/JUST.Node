class Transformer {
    constructor(context) {
        this.context = context ? 
            (context.evaluationMode ? context : Object.assign(context, { evaluationMode: 'fallbackToDefault'})) : 
            { evaluationMode: 'fallbackToDefault'};
        this._loopCounter = 0;
    }

    // transform(transformerJson, inputJson) {
    // }

    handleEvaluationMode(fnResult) {
        if (this.context) {
            if (Array.isArray(this.context.evaluationMode)) {
                this.context.evaluationMode.forEach(el => {
                    if (el === 'strict') {
                        this.strictMode(fnResult);
                    }        
                });
            } else if (typeof this.context.evaluationMode === 'string' && this.context.evaluationMode === 'strict') {
                this.strictMode(fnResult);
            }
        }
    }

    strictMode(result) {
        if (result === null || 
            (typeof result === 'string' && result !== '') ||
            Array.isArray(result) || 
            result ||
            (!result && Object.keys(result).length === 0)) {
        } else {
            throw 'String was not recognized as a valid Boolean';
        }
    }
}

export default Transformer;
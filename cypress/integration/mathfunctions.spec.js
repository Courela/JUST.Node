import JsonTransformer from "../../jsonTransformer.js";

context('Math Functions', () => {
    beforeEach(() => {
    });
  
    it('add', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "add": "#add(1,3)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { add: 4 }});
    });

    it('add fallback to default', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "add": "#add(1,asd)" }}';

        var result = new JsonTransformer({ evaluationMode: 'fallbackToDefault' }).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { add: 0 }});
    });

    it('add strict error', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "add": "#add(1,asd)" }}';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw();
    });

    it('subtract', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "subtract": "#subtract(5,1)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { subtract: 4 }});
    });

    it('subtract fallback to default', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "subtract": "#subtract(5,asd)" }}';

        var result = new JsonTransformer({ evaluationMode: 'fallbackToDefault' }).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { subtract: 0 }});
    });

    it('subtract strict error', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "subtract": "#subtract(5,asd)" }}';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw();
    });

    it('multiply', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "multiply": "#multiply(2,3)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { multiply: 6 }});
    });

    it('multiply fallback to default', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "multiply": "#multiply(5,asd)" }}';

        var result = new JsonTransformer({ evaluationMode: 'fallbackToDefault' }).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { multiply: 0 }});
    });

    it('multiply strict error', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "multiply": "#multiply(5,asd)" }}';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw();
    });

    it('divide', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "divide": "#divide(9,3)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { divide: 3 }});
    });

    it('divide by zero', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "divide": "#divide(9,0)" }}';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw();
    });

    it('divide fallback to default', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "divide": "#divide(9,asd)" }}';

        var result = new JsonTransformer({ evaluationMode: 'fallbackToDefault' }).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { divide: 0 }});
    });

    it('divide strict error', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "divide": "#divide(9,asd)" }}';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw();
    });

    it('round to zero', () => {
        const input = '{ }';
        const transformer = '{ "result": "#round(0.00154,2)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: 0.00 });
    });

    it('round two decimal places', () => {
        const input = '{ }';
        const transformer = '{ "result": "#round(0.01554,2)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: 0.02 });
    });

    it('round zero decimal places', () => {
        const input = '{ }';
        const transformer = '{ "result": "#round(0.66489,0)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: 1 });
    });

    it('round fallback to default', () => {
        const input = '{ }';
        const transformer = '{ "result": "#round(0.00154,asd)" }';

        var result = new JsonTransformer({ evaluationMode: 'fallbackToDefault' }).transform(transformer, input);

        expect(result).to.deep.equal({ result: 0 });
    });

    it('round strict error', () => {
        const input = '{ }';
        const transformer = '{ "result": "#round(0.00154,asd)" }';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw();
    });

    it('equals true', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "mathequals": "#mathequals(3,3)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { mathequals: true }});
    });

    it('equals false', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "mathequals": "#mathequals(4,3)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { mathequals: false }});
    });

    it('equals fallback to default', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "mathequals": "#mathequals(asd,3)" }}';

        var result = new JsonTransformer({ evaluationMode: 'fallbackToDefault' }).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { mathequals: false }});
    });

    it('equals strict error', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "mathequals": "#mathequals(asd,3)" }}';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw();
    });

    it('greater than true', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "mathgreaterthan": "#mathgreaterthan(3,2)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { mathgreaterthan: true }});
    });

    it('greater than false', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "mathgreaterthan": "#mathgreaterthan(1,2)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { mathgreaterthan: false }});
    });

    it('greater than fallback to default', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "mathgreaterthan": "#mathgreaterthan(asd,2)" }}';

        var result = new JsonTransformer({ evaluationMode: 'fallbackToDefault' }).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { mathgreaterthan: false }});
    });

    it('greater than strict error', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "mathgreaterthan": "#mathgreaterthan(asd,2)" }}';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw();
    });

    it('less than true', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "mathlessthan": "#mathlessthan(3,4)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { mathlessthan: true }});
    });

    it('less than false', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "mathlessthan": "#mathlessthan(5,4)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { mathlessthan: false }});
    });

    it('less than fallback to default', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "mathlessthan": "#mathlessthan(asd,4)" }}';

        var result = new JsonTransformer({ evaluationMode: 'fallbackToDefault' }).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { mathlessthan: false }});
    });

    it('less than strict error', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "mathlessthan": "#mathlessthan(asd,4)" }}';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw();
    });

    it('greater than or equals true', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "mathgreaterthanorequalto": "#mathgreaterthanorequalto(4,4)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { mathgreaterthanorequalto: true }});
    });

    it('greater than or equals to false', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "mathgreaterthanorequalto": "#mathgreaterthanorequalto(3,4)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { mathgreaterthanorequalto: false }});
    });

    it('greater than or equals to fallback to default', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "mathgreaterthanorequalto": "#mathgreaterthanorequalto(asd,4)" }}';

        var result = new JsonTransformer({ evaluationMode: 'fallbackToDefault' }).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { mathgreaterthanorequalto: false }});
    });

    it('greater than or equals to strict error', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "mathgreaterthanorequalto": "#mathgreaterthanorequalto(asd,4)" }}';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw();
    });

    it('less than or equals to true', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "mathlessthanorequalto": "#mathlessthanorequalto(2,2)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { mathlessthanorequalto: true }});
    });

    it('less than or equals to false', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "mathlessthanorequalto": "#mathlessthanorequalto(3,2)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { mathlessthanorequalto: false }});
    });

    it('less than or equals to fallback to default', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "mathlessthanorequalto": "#mathlessthanorequalto(asd,2)" }}';

        var result = new JsonTransformer({ evaluationMode: 'fallbackToDefault' }).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { mathlessthanorequalto: false }});
    });

    it('less than or equals to strict error', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "mathlessthanorequalto": "#mathlessthanorequalto(asd,2)" }}';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw();
    });
});
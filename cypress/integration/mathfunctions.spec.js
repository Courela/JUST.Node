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

    it('subtract', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "subtract": "#subtract(5,1)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { subtract: 4 }});
    });

    it('multiply', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "multiply": "#multiply(2,3)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { multiply: 6 }});
    });

    it('divide', () => {
        const input = '{ }';
        const transformer = '{ "mathresult": { "divide": "#divide(9,3)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { divide: 3 }});
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
});
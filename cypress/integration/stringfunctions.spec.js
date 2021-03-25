import JsonTransformer from "../../jsonTransformer.js";

context('String Functions', () => {
    beforeEach(() => {
    });
  
    it('first index of found', () => {
        const input = '{ }';
        const transformer = '{ "stringresult": { "firstindexofand": "#firstindexof(thisisandveryunuasualandlongstring,and)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ stringresult : { firstindexofand: 6 } });
    });

    it('first index of not found', () => {
        const input = '{ }';
        const transformer = '{ "stringresult": { "firstindexofand": "#firstindexof(thisisandveryunuasualandlongstring,or)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ stringresult : { firstindexofand: -1 } });
    });

    it('first index of not found strict', () => {
        const input = '{ }';
        const transformer = '{ "stringresult": { "firstindexofand": "#firstindexof(thisisandveryunuasualandlongstring,or)" }}';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw();
    });

    it('last index of found', () => {
        const input = '{ }';
        const transformer = '{ "stringresult": { "lastindexofand": "#lastindexof(thisisandveryunuasualandlongstring,and)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ stringresult : { lastindexofand: 21 } });
    });

    it('last index of not found', () => {
        const input = '{ }';
        const transformer = '{ "stringresult": { "lastindexofand": "#lastindexof(thisisandveryunuasualandlongstring,or)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ stringresult : { lastindexofand: -1 } });
    });

    it('last index of not found strict', () => {
        const input = '{ }';
        const transformer = '{ "stringresult": { "lastindexofand": "#lastindexof(thisisandveryunuasualandlongstring,or)" }}';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw();
    });

    it('substring', () => {
        const input = '{ }';
        const transformer = '{ "stringresult": { "substring": "#substring(thisisandveryunuasualandlongstring,8,10)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ stringresult : { substring: "dveryunuas" } });
    });

    it('substring fallback to default', () => {
        const input = '{ }';
        const transformer = '{ "stringresult": { "substring": "#substring(thisisandveryunuasualandlongstring,100,100)" }}';

        var result = new JsonTransformer({ evaluationMode: 'fallbackToDefault' }).transform(transformer, input);

        expect(result).to.deep.equal({ stringresult : { substring: null } });
    });

    it('substring strict error', () => {
        const input = '{ }';
        const transformer = '{ "stringresult": { "substring": "#substring(thisisandveryunuasualandlongstring,100,100)" }}';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw();
    });

    it('concat', () => {
        const input = '{ }';
        const transformer = '{ "stringresult": { "concat": "#concat(csv,popup)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ stringresult: { concat: "csvpopup" }});
    });

    it('equals true', () => {
        const input = '{ }';
        const transformer = '{ "stringresult": { "stringequals": "#stringequals(one,one)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ stringresult: { stringequals: true }});
    });

    it('equals false', () => {
        const input = '{ }';
        const transformer = '{ "stringresult": { "stringequals": "#stringequals(two,one)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ stringresult: { stringequals: false }});
    });

    it('contains true', () => {
        const input = '{ }';
        const transformer = '{ "stringresult": { "stringcontains": "#stringcontains(one,n)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ stringresult: { stringcontains: true }});
    });

    it('contains false', () => {
        const input = '{ }';
        const transformer = '{ "stringresult": { "stringcontains": "#stringcontains(two,n)" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ stringresult: { stringcontains: false }});
    });
});
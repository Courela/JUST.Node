import JsonTransformer from "../../jsonTransformer.js";

context('Length', () => {
    beforeEach(() => {
    });

    it('string', () => {
        const input = '{ }';
        const transformer = '{ "length": "#length(somestring)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ length: 10 });
    });

    it('array', () => {
        const input = '{ "numbers": [ 1, 2, 3, 4, 5 ]}';
        const transformer = '{ "length": "#length(#valueof($.numbers))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ length: 5 });
    });

    it('not enumerable value', () => {
        const input = '{ "numbers": [ 1, 2, 3, 4, 5 ]}';
        const transformer = '{ "length": "#length(#valueof($.numbers[0]))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ length: 0 });
    });

    it('not enumerable const', () => {
        const input = '{ }';
        const transformer = '{ "length": "#length(#tointeger(1))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ length: 0 });
    });

    it('not enumerable value strict', () => {
        const input = '{ "numbers": [ 1, 2, 3, 4, 5 ]}';
        const transformer = '{ "length": "#length(#valueof($.numbers[0]))" }';

        //TODO exception message
        //expect(() => new JsonTransformer({ evaluationMode: [ "strict" ]}).transform(transformer, input)).to.throw('Error while calling function : #length(#valueof($.numbers[0])) - Argument not elegible for #length: 1');
        expect(() => new JsonTransformer({ evaluationMode: [ "strict" ]}).transform(transformer, input)).to.throw();
    });

    it('not enumerable const strict', () => {
        const input = '{ }';
        const transformer = '{ "length": "#length(#todecimal(1.44))" }';

        //TODO exception message
        //expect(() => new JsonTransformer({ evaluationMode: [ "strict" ]}).transform(transformer, input)).to.throw('Error while calling function : #length(#todecimal(1.44)) - Argument not elegible for #length: 1.44');
        expect(() => new JsonTransformer({ evaluationMode: [ "strict" ]}).transform(transformer, input)).to.throw();
    });
});
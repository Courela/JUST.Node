import JsonTransformer from "../../jsonTransformer.js";

context('Input', () => {
    beforeEach(() => {
    });

    it('transformer not a string', () => {
        const input = '{ "numbers": [ 1, 2, 3, 4, 5 ]}';
        const transformer = 0;

        expect(() => new JsonTransformer({ }).transform(transformer, input)).to.throw('Transformer not an object!');
    });

    it('input not a string', () => {
        const input = 0;
        const transformer = '{ "sum": "#sum($.numbers)" }';

        expect(() => new JsonTransformer({ }).transform(transformer, input)).to.throw('Input not an object!');
    });

    it('invalid transformer', () => {
        const input = '{ "numbers": [ 1, 2, 3, 4, 5 ]}';
        const transformer = 'invalid';

        expect(() => new JsonTransformer({ }).transform(transformer, input)).to.throw();
    });

    it('invalid input', () => {
        const input = 'invalid';
        const transformer = '{ "sum": "#sum($.numbers)" }';

        expect(() => new JsonTransformer({ }).transform(transformer, input)).to.throw();
    });
});

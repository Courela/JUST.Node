import JsonTransformer from "../../jsonTransformer.js";

context('Type Conversion', () => {
    beforeEach(() => {
    });

    it('to boolean true string', () => {
        const input = '{ }';
        const transformer = '{ "result": "#toboolean(true)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: true });
    });

    it('to boolean false string', () => {
        const input = '{ "value": "false" }';
        const transformer = '{ "result": "#toboolean(false)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: false });
    });

    it('to boolean zero', () => {
        const input = '{ "value": 0 }';
        const transformer = '{ "result": "#toboolean(#valueof($.value))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: false });
    });

    it('to boolean positive number', () => {
        const input = '{ "value": 123 }';
        const transformer = '{ "result": "#toboolean(#valueof($.value))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: true });
    });

    it('to boolean negative number', () => {
        const input = '{ "value": -456 }';
        const transformer = '{ "result": "#toboolean(#valueof($.value))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: true });
    });

    it('to string true', () => {
        const input = '{ }';
        const transformer = '{ "result": "#tostring(true)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: 'true' });
    });

    it('to string false', () => {
        const input = '{ }';
        const transformer = '{ "result": "#tostring(false)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: 'false' });
    });

    it('to string zero', () => {
        const input = '{ }';
        const transformer = '{ "result": "#tostring(0)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: '0' });
    });

    it('to string positive integer', () => {
        const input = '{ }';
        const transformer = '{ "result": "#tostring(123)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: '123' });
    });

    it('to string negative integer', () => {
        const input = '{ }';
        const transformer = '{ "result": "#tostring(-456)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: '-456' });
    });

    it('to string positive decimal', () => {
        const input = '{ }';
        const transformer = '{ "result": "#tostring(1.23)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: '1.23' });
    });

    it('to string negative decimal', () => {
        const input = '{ }';
        const transformer = '{ "result": "#tostring(-4.56)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: '-4.56' });
    });

    it('to integer positive string', () => {
        const input = '{ }';
        const transformer = '{ "result": "#tointeger(123)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: 123 });
    });

    it('to integer negative string', () => {
        const input = '{ }';
        const transformer = '{ "result": "#tointeger(-456)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: -456 });
    });

    it('to integer zero string', () => {
        const input = '{ }';
        const transformer = '{ "result": "#tointeger(0)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: 0 });
    });

    it('to integer positive decimal', () => {
        const input = '{ }';
        const transformer = '{ "result": "#tointeger(1.01)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: 1 });
    });

    it('to integer positive decimal', () => {
        const input = '{ }';
        const transformer = '{ "result": "#tointeger(1.23)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: 1 });
    });

    it('to integer negative decimal', () => {
        const input = '{ }';
        const transformer = '{ "result": "#tointeger(-4.56)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: -5 });
    });

    it('to integer true', () => {
        const input = '{ }';
        const transformer = '{ "result": "#tointeger(true)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: 1 });
    });

    it('to integer false', () => {
        const input = '{ }';
        const transformer = '{ "result": "#tointeger(false)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: 0 });
    });

    it('to integer fallback to default', () => {
        const input = '{ }';
        const transformer = '{ "result": "#tointeger(abc)" }';

        var result = new JsonTransformer({ evaluationMode: 'fallbackToDefault' }).transform(transformer, input);

        expect(result).to.deep.equal({ result: 0 });
    });

    it('to integer strict error', () => {
        const input = '{ }';
        const transformer = '{ "result": "#tointeger(abc)" }';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw('Invalid value!');
    });
    

    it('to decimal string', () => {
        const input = '{ "value": "0" }';
        const transformer = '{ "result": "#todecimal(#valueof($.value))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: 0.0 });
    });

    it('to decimal string', () => {
        const input = '{ "value": "1.01" }';
        const transformer = '{ "result": "#todecimal(#valueof($.value))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: 1.01 });
    });

    it('to decimal integer', () => {
        const input = '{ "value": 123 }';
        const transformer = '{ "result": "#todecimal(#valueof($.value))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: 123.0 });
    });

    it('to decimal negative integer', () => {
        const input = '{ "value": -123 }';
        const transformer = '{ "result": "#todecimal(#valueof($.value))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: -123.0 });
    });
});
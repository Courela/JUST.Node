import JsonTransformer from "../../jsonTransformer.js";

context('Concatenation', () => {
    beforeEach(() => {
    });

    it('nulls', () => {
        const input = '{ "value1": null, "value2": null }';
        const transformer = '{ "result": "#concat(#valueof($.value1), #valueof($.value2))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: null});
    });

    it('empty arrays', () => {
        const input = '{ "value1": [], "value2": [] }';
        const transformer = '{ "result": "#concat(#valueof($.value1), #valueof($.value2))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: [] });
    });

    it('empty array and null', () => {
        const input = '{ "value1": [], "value2": null }';
        const transformer = '{ "result": "#concat(#valueof($.value1), #valueof($.value2))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: [] });
    });

    it('null and empty array', () => {
        const input = '{ "value1": null, "value2": [] }';
        const transformer = '{ "result": "#concat(#valueof($.value1), #valueof($.value2))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: [] });
    });

    it('array with value and null', () => {
        const input = '{ "value1": [ "string1" ], "value2": null }';
        const transformer = '{ "result": "#concat(#valueof($.value1), #valueof($.value2))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: [ "string1" ] });
    });

    it('null and array with value', () => {
        const input = '{ "value1": null, "value2": [ "string2" ] }';
        const transformer = '{ "result": "#concat(#valueof($.value1), #valueof($.value2))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: [ "string2" ] });
    });

    it('array with object and null', () => {
        const input = '{ "value1": [{ "prop1": null }], "value2": null }';
        const transformer = '{ "result": "#concat(#valueof($.value1), #valueof($.value2))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: [{ "prop1": null }] });
    });

    it('null and array with object', () => {
        const input = '{ "value1": null, "value2": [{ "prop2": null }] }';
        const transformer = '{ "result": "#concat(#valueof($.value1), #valueof($.value2))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: [{ "prop2": null }] });
    });

    it('arrays with one object', () => {
        const input = '{ "value1": [{ "prop1": null }], "value2": [{ "prop2": null }] }';
        const transformer = '{ "result": "#concat(#valueof($.value1), #valueof($.value2))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: [{ "prop1": null },{ "prop2": null }] });
    });

    it('arrays', () => {
        const input = '{ "value1": [{ "prop1": "prop1" },{ "prop2\": null },{ "prop3": "prop3" }], "value2": [{ "prop4": "prop4" },{ "prop5": null }] }';
        const transformer = '{ "result": "#concat(#valueof($.value1), #valueof($.value2))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: [{ prop1: "prop1" },{ prop2: null },{ prop3: "prop3" },{ prop4: "prop4" },{ prop5: null }] });
    });

    it('multiple arrays', () => {
        const input = '{ "value1": [{ "prop1": "prop1" },{ "prop2": null },{ "prop3": "prop3" }], "value2": [{ "prop4": "prop4" },{ "prop5": null }], "value3": [{ "prop1": "prop1" },{ "prop2": null },{ "prop3": "prop3" }] }';
        const transformer = '{ "result": "#concat(#concat(#valueof($.value1), #valueof($.value2)), #valueof($.value3))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: [{ prop1: "prop1" },{ prop2: null },{ prop3: "prop3" },{ prop4: "prop4" },{ prop5: null },{ prop1: "prop1" },{ prop2: null },{ prop3: "prop3" }]});
    });

    it('xconcat nulls', () => {
        const input = '{ "value1": null, "value2": null }';
        const transformer = '{ "result": "#xconcat(#valueof($.value1), #valueof($.value2))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: null});
    });

    it('xconcat empty arrays', () => {
        const input = '{ "value1": [], "value2": [] }';
        const transformer = '{ "result": "#xconcat(#valueof($.value1), #valueof($.value2))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: [] });
    });

    it('xconcat empty array and null', () => {
        const input = '{ "value1": [], "value2": null }';
        const transformer = '{ "result": "#xconcat(#valueof($.value1), #valueof($.value2))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: [] });
    });

    it('xconcat null and empty array', () => {
        const input = '{ "value1": null, "value2": [] }';
        const transformer = '{ "result": "#xconcat(#valueof($.value1), #valueof($.value2))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: [] });
    });

    it('xconcat array with value and null', () => {
        const input = '{ "value1": [ "string1" ], "value2": null }';
        const transformer = '{ "result": "#xconcat(#valueof($.value1), #valueof($.value2))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: [ "string1" ] });
    });

    it('xconcat null and array with value', () => {
        const input = '{ "value1": null, "value2": [ "string2" ] }';
        const transformer = '{ "result": "#xconcat(#valueof($.value1), #valueof($.value2))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: [ "string2" ] });
    });

    it('xconcat array with object and null', () => {
        const input = '{ "value1": [{ "prop1": null }], "value2": null }';
        const transformer = '{ "result": "#xconcat(#valueof($.value1), #valueof($.value2))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: [{ "prop1": null }] });
    });

    it('xconcat null and array with object', () => {
        const input = '{ "value1": null, "value2": [{ "prop2": null }] }';
        const transformer = '{ "result": "#xconcat(#valueof($.value1), #valueof($.value2))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: [{ "prop2": null }] });
    });

    it('xconcat arrays with one object', () => {
        const input = '{ "value1": [{ "prop1": null }], "value2": [{ "prop2": null }] }';
        const transformer = '{ "result": "#xconcat(#valueof($.value1), #valueof($.value2))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: [{ "prop1": null },{ "prop2": null }] });
    });

    it('xconcat arrays', () => {
        const input = '{ "value1": [{ "prop1": "prop1" },{ "prop2\": null },{ "prop3": "prop3" }], "value2": [{ "prop4": "prop4" },{ "prop5": null }] }';
        const transformer = '{ "result": "#xconcat(#valueof($.value1), #valueof($.value2))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: [{ prop1: "prop1" },{ prop2: null },{ prop3: "prop3" },{ prop4: "prop4" },{ prop5: null }] });
    });

    it('xconcat multiple arrays', () => {
        const input = '{ "value1": [{ "prop1": "prop1" },{ "prop2": null },{ "prop3": "prop3" }], "value2": [{ "prop4": "prop4" },{ "prop5": null }], "value3": [{ "prop1": "prop1" },{ "prop2": null },{ "prop3": "prop3" }] }';
        const transformer = '{ "result": "#xconcat(#valueof($.value1), #valueof($.value2), #valueof($.value3))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: [{ prop1: "prop1" },{ prop2: null },{ prop3: "prop3" },{ prop4: "prop4" },{ prop5: null },{ prop1: "prop1" },{ prop2: null },{ prop3: "prop3" }]});
    });
});
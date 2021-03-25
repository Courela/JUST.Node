import JsonTransformer from "../../jsonTransformer.js";

context('ValueOf', () => {
    beforeEach(() => {
    });
  
    it('string', () => {
        const input = '{ "string": "some words", "integer": 123, "boolean": true }';
        const transformer = '{ "output": "#valueof($.string)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ output: "some words" });
    });

    it('integer', () => {
        const input = '{ "string": "some words", "integer": 123, "boolean": true }';
        const transformer = '{ "output": "#valueof($.integer)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ output: 123 });
    });

    it('boolean', () => {
        const input = '{ "string": "some words", "integer": 123, "boolean": true }';
        const transformer = '{ "output": "#valueof($.boolean)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ output: true });
    });

    it('nested', () => {
        const input = '{ "string": "$.integer", "integer": 123, "boolean": true }';
        const transformer = '{ "output": "#valueof(#valueof($.string))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ output: 123 });
    });

    it('array', () => {
        const input = '{ "x": [{ "v": { "a": "a1,a2,a3", "b": "1", "c": "10" } }, { "v": { "a": "b1,b2", "b": "2", "c": "20" } }, { "v": { "a": "c1,c2,c3", "b": "3", "c": "30" } } ]}';
        const transformer = '{ "root": { "array": { "fullarray": "#valueof($.x)" } }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ root: { array: { fullarray: [{ v: { a: "a1,a2,a3", b: "1", c: "10" }}, { v: { a: "b1,b2", b: "2", c: "20" }}, { v:{ a: "c1,c2,c3", b: "3", c: "30" }}]}}});
    });

    it('array empty', () => {
        const input = '{ "x": [ { "y": [] } ] }';
        const transformer = '{ "array": "#valueof($.x)" }';

        var result = new JsonTransformer().transform(transformer, input);

        expect(result).to.deep.equal({ array: [{ y: [] }] });
    });

    it('array element', () => {
        const input = '{ "x": [ { "v": { "a": "a1,a2,a3", "b": "1", "c": "10" } }, { "v": { "a": "b1,b2", "b": "2", "c": "20" } }, { "v": { "a": "c1,c2,c3", "b": "3", "c": "30" } } ]}';
        const transformer = '{ "root": { "array": { "arrayelement": "#valueof($.x[0])" } }}';

        var result = new JsonTransformer().transform(transformer, input);

        expect(result).to.deep.equal({ root: { array: { arrayelement: { v: { a: "a1,a2,a3", b: "1", c: "10" } } } } });
    });

    it('array element specific field', () => {
        const input = '{ "x": [ { "v": { "a": "a1,a2,a3", "b": "1", "c": "10" } }, { "v": { "a": "b1,b2", "b": "2", "c": "20" } }, { "v": { "a": "c1,c2,c3", "b": "3", "c": "30" } } ]}';
        const transformer = '{ "root": { "array": { "specific_field": "#valueof($.x[1].v.a)" } }}';

        var result = new JsonTransformer().transform(transformer, input);

        expect(result).to.deep.equal({ root: { array: { specific_field: "b1,b2" } } });
    });

    it('multidimension arrays', () => {
        const input = '{ "paths": [{ "points": { "coordinates": [[ 106.621279, 10.788109 ],[ 106.621672, 10.787869 ], [ 106.621992, 10.787717 ]]}}]}';
        const transformer = '{ "result": "#valueof($.paths)" }';

        var result = new JsonTransformer().transform(transformer, input);

        expect(result).to.deep.equal({ result: [{ points: { coordinates: [[106.621279,10.788109],[106.621672,10.787869],[106.621992,10.787717]]}}]});
    });

    it('primitive elements array', () => {
        const input = '{ "root": [ "elem1", "elem2" ]}';
        const transformer = '{ "result": "#valueof($.root)" }';

        var result = new JsonTransformer().transform(transformer, input);

        expect(result).to.deep.equal({ result: [ "elem1", "elem2" ]});
    });

    it('multiple level array', () => {
        const input = '{ "outer_array": [ { "inner_array": [ "elem1", "elem2" ] } ] }';
        const transformer = '{ "result": "#valueof($.outer_array..inner_array)" }';

        var result = new JsonTransformer().transform(transformer, input);

        expect(result).to.deep.equal({ result: [ "elem1", "elem2" ]});
    });

    it('double precision', () => {
        const input = '{ "Latitude": 38.978378, "Longitude": -122.032861 }';
        const transformer = '{ "LatitudeInDecimalDegrees": "#valueof($.Latitude)", "LongitudeInDecimalDegrees": "#valueof($.Longitude)" }';

        var result = new JsonTransformer().transform(transformer, input);

        expect(result).to.deep.equal({ LatitudeInDecimalDegrees: 38.978378, LongitudeInDecimalDegrees: -122.032861});
    });
});
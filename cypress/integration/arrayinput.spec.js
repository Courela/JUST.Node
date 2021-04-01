import JsonTransformer from "../../jsonTransformer.js";

context('Array Input', () => {
    beforeEach(() => {
    });
  
    it('single result', () => {
        const input = '[{ "id": 1, "name": "Person 1", "gender": "M" },{ "id": 2, "name": "Person 2", "gender": "F" },{ "id": 3, "name": "Person 3", "gender": "M" }]';
        const transformer = '{ "result": "#valueof($[?(@.gender==\'F\')].name)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: "Person 2" });
    });

    it('iterate', () => {
        const input = '[{ "id": 1, "name": "Person 1", "gender": "M" },{ "id": 2, "name": "Person 2", "gender": "F" },{ "id": 3, "name": "Person 3", "gender": "M" }]';
        const transformer = '{ "result": { "#loop($[?(@.gender==\'M\')])": { "name": "#currentvalueatpath($.name)" } } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: [{ name: "Person 1" },{ name: "Person 3" }] });
    });
});
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

    it('looping root', () => {
        const input = '[{"Id":1,"Fields":{"Email":{"Name":"Email","FieldType":3,"Value\":"test1@test.com"}},"CreatedAt":"2021-10-07T13:40:14.813Z"},{"Id":2,"Fields":{"Email":{"Name":"Email","FieldType":3,"Value":"test2@test.com"}},"CreatedAt":"2021-10-07T13:44:24.48Z"},{"Id":3,"Fields":{"Email":{"Name":"Email","FieldType":3,"Value":"test3@test.com"}},"CreatedAt":"2021-10-07T13:45:09.417Z"}]';
        const transformer = '{"#loop($)":{"#eval(#concat(id,#tostring(#currentvalueatpath($.Id))))":"#currentvalueatpath($.Fields[\'Email\'].Value)"}}';

        var result = new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input);

        expect(result).to.deep.equal([{ id1: "test1@test.com"},{ id2: "test2@test.com"},{ id3: "test3@test.com" }]);
    });
});
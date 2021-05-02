import JsonTransformer from "../../jsonTransformer.js";

context('Evaluation Mode', () => {
    beforeEach(() => {
    });
  
    it('combined', () => {
        const input = '{ "menu": { "id": { "file": "csv" }, "value": { "Window": "popup" }, "popup": { "menuitem": [ { "value": "New", "onclick": { "action": "CreateNewDoc()" } }, { "value": "Open", "onclick": "OpenDoc()" }, { "value": "Close", "onclick": "CloseDoc()" } ], "submenuitem": "CloseSession()" } } }';
        const transformer = '{ "#": [ "#copy($.menu)" ], "popup": { "menuitem": [] } }';

        var result = new JsonTransformer({ evaluationMode: [ 'fallbackToDefault', 'addOrReplaceProperties' ] }).transform(transformer, input);

        expect(result).to.deep.equal({ popup: { menuitem:[], submenuitem: "CloseSession()" }, id: { file: "csv" }, value: { Window: "popup" }});
    });

    it('empty context', () => {
        const input = '{ "numbers": [ 1, 2, 3, 4, 5 ]}';
        const transformer = '{ "sum": "#sum($.numbers)" }';

        var result = new JsonTransformer({ }).transform(transformer, input);

        expect(result).to.deep.equal({ sum: 15 });
    });

    it('context as string', () => {
        const input = '{ "numbers": [ 1, 2, 3, 4, 5 ]}';
        const transformer = '{ "sum": "#sum($.numbers)" }';

        var result = new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input);

        expect(result).to.deep.equal({ sum: 15 });
    });

    it('context as string joinArrays', () => {
        const input = '[{ "id": 1, "cnt": 100, "rowNum": 1, "col": 1},{"id": 2, "cnt": 89, "rowNum": 1, "col": 1 }]';
        const transformer = '[{ "#loop($)": { "key": "#currentvalueatpath($.id)", "quantity": "#currentvalueatpath($.cnt)" } }]';

        var result = new JsonTransformer({ evaluationMode: 'joinArrays' }).transform(transformer, input);

        expect(result).to.deep.equal([{ key: 1, quantity: 100 },{ key: 2, quantity: 89 }]);
    });
});
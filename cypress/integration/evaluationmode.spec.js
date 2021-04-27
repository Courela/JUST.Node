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
});
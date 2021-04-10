import JsonTransformer from "../../jsonTransformer.js";

context('Bulk Functions', () => {
    beforeEach(() => {
    });

    it('copy', () => {
        const input = '{ "menu": { "id": { "file": "csv" }, "value": { "Window": "popup" }, "popup": { "menuitem": [ { "value": "New", "onclick": { "action": "CreateNewDoc()" } }, { "value": "Open", "onclick": "OpenDoc()" }, { "value": "Close", "onclick": "CloseDoc()" } ], "submenuitem": "CloseSession()" } } }';
        const transformer = '{ "#": [ "#copy($.menu.id)", "#copy($.menu.value)" ] }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ file: "csv", Window: "popup" });
    });

    it('replace with primitive value', () => {
        const input = '{ "menu": { "id": { "file": "csv" }, "value": { "Window": "popup" }, "popup": { "menuitem": [ { "value": "New", "onclick": { "action": "CreateNewDoc()" } }, { "value": "Open", "onclick": "OpenDoc()" }, { "value": "Close", "onclick": "CloseDoc()" } ], "submenuitem": "CloseSession()" } } }';
        const transformer = '{ "#": [ "#copy($)", "#replace($.menu.id,#valueof($.menu.value.Window))" ] }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ menu: { id: "popup", value: { Window: "popup" }, popup: { menuitem: [{ value: "New", onclick: { action: "CreateNewDoc()" }}, { value: "Open", onclick: "OpenDoc()" }, { value: "Close", onclick: "CloseDoc()" }], submenuitem: "CloseSession()" }}});
    });

    it('replace with object', () => {
        const input = '{ "menu": { "id": { "file": "csv" }, "value": { "Window": "popup" }, "popup": { "menuitem": [ { "value": "New", "onclick": { "action": "CreateNewDoc()" } }, { "value": "Open", "onclick": "OpenDoc()" }, { "value": "Close", "onclick": "CloseDoc()" } ], "submenuitem": "CloseSession()" } } }';
        const transformer = '{ "#": [ "#copy($)", "#replace($.menu.id,#valueof($.menu.value))" ] }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ menu: { id: { Window: "popup"}, value: { Window: "popup" }, popup: { menuitem: [{ value: "New", onclick: { action: "CreateNewDoc()" }}, { value: "Open", onclick: "OpenDoc()" }, { value: "Close", onclick: "CloseDoc()" }], submenuitem: "CloseSession()" }}});
    });

    it('delete', () => {
        const input = '{ "menu": { "id": { "file": "csv" }, "value": { "Window": "popup" }, "popup": { "menuitem": [ { "value": "New", "onclick": { "action": "CreateNewDoc()" } }, { "value": "Open", "onclick": "OpenDoc()" }, { "value": "Close", "onclick": "CloseDoc()" } ], "submenuitem": "CloseSession()" } } }';
        const transformer = '{ "#": [ "#copy($)", "#delete($.menu.popup)" ] }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ menu: { id: { file: "csv"}, value: { Window: "popup" } }});
    });

    it('copy nested argument', () => {
        const input = '{ "menu": { "id": { "file": "csv" }, "value": { "Window": "popup" }, "popup": { "menuitem": [ { "value": "New", "onclick": { "action": "CreateNewDoc()" } }, { "value": "Open", "onclick": "OpenDoc()" }, { "value": "Close", "onclick": "CloseDoc()" } ], "submenuitem": "CloseSession()" } } }';
        const transformer = '{ "#": [ "#copy(#xconcat($,.menu.id))" ] }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ file: "csv" });
    });

    it('replace nested argument', () => {
        const input = '{ "path": "$.menu.id", "boolean": true, "menu": { "id": { "file": "csv" }, "value": { "Window": "popup" }, "popup": { "menuitem": [ { "value": "New", "onclick": { "action": "CreateNewDoc()" } }, { "value": "Open", "onclick": "OpenDoc()" }, { "value": "Close", "onclick": "CloseDoc()" } ], "submenuitem": "CloseSession()" } } }';
        const transformer = '{ "#": [ "#copy($)", "#replace(#valueof(#concat($.,path)),#valueof($.menu.value))" ] }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ path: "$.menu.id", boolean: true, menu: { id: { Window: "popup"}, value: { Window: "popup" }, popup: { menuitem: [{ value: "New", onclick: { action: "CreateNewDoc()" }}, { value: "Open", onclick: "OpenDoc()" }, { value: "Close", onclick: "CloseDoc()" }], submenuitem: "CloseSession()" }}});
    });

    it('delete nested argument', () => {
        const input = '{ "path": "$.menu.id", "boolean": true, "menu": { "id": { "file": "csv" }, "value": { "Window": "popup" }, "popup": { "menuitem": [ { "value": "New", "onclick": { "action": "CreateNewDoc()" } }, { "value": "Open", "onclick": "OpenDoc()" }, { "value": "Close", "onclick": "CloseDoc()" } ], "submenuitem": "CloseSession()" } } }';
        const transformer = '{ "#": [ "#copy($)", "#delete(#valueof($.path))" ] }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ path: "$.menu.id", boolean: true, menu: { value: { Window: "popup" }, popup: { menuitem: [{ value: "New", onclick: { action: "CreateNewDoc()" }}, { value: "Open", onclick: "OpenDoc()" }, { value: "Close", onclick: "CloseDoc()" }], submenuitem: "CloseSession()" }}});
    });

    it('copy invalid argument', () => {
        const input = '{ "menu": { "id": { "file": "csv" }, "value": { "Window": "popup" }, "popup": { "menuitem": [ { "value": "New", "onclick": { "action": "CreateNewDoc()" } }, { "value": "Open", "onclick": "OpenDoc()" }, { "value": "Close", "onclick": "CloseDoc()" } ], "submenuitem": "CloseSession()" } } }';
        const transformer = '{ "#": [ "#copy(#valueof($.boolean))" ] }';

        //TODO exception message
        //expect(() => new JsonTransformer(null).transform(transformer, input)).to.throw("Invalid path for #copy: '#valueof($.boolean)' resolved to null!");
        expect(() => new JsonTransformer(null).transform(transformer, input)).to.throw();
    });

    it('replace with invalid argument number', () => {
        const input = '{ "menu": { "id": { "file": "csv" }, "value": { "Window": "popup" }, "popup": { "menuitem": [ { "value": "New", "onclick": { "action": "CreateNewDoc()" } }, { "value": "Open", "onclick": "OpenDoc()" }, { "value": "Close", "onclick": "CloseDoc()" } ], "submenuitem": "CloseSession()" } } }';
        const transformer = '{ "#": [ "#replace(#valueof($.boolean))" ] }';

        //TODO exception message
        //expect(() => new JsonTransformer(null).transform(transformer, input)).to.throw("Function #replace needs at least two arguments - 1. path to be replaced, 2. token to replace with.");
        expect(() => new JsonTransformer(null).transform(transformer, input)).to.throw();
    });

    it('replace with invalid argument', () => {
        const input = '{ "menu": { "id": { "file": "csv" }, "value": { "Window": "popup" }, "popup": { "menuitem": [ { "value": "New", "onclick": { "action": "CreateNewDoc()" } }, { "value": "Open", "onclick": "OpenDoc()" }, { "value": "Close", "onclick": "CloseDoc()" } ], "submenuitem": "CloseSession()" } } }';
        const transformer = '{ "#": [ "#replace(#valueof($.boolean), #valueof($.menu.value))" ] }';

        //TODO exception message
        //expect(() => new JsonTransformer(null).transform(transformer, input)).to.throw("Invalid path for #replace: '#valueof($.boolean)' resolved to null!");
        expect(() => new JsonTransformer(null).transform(transformer, input)).to.throw();
    });

    it('delete invalid argument', () => {
        const input = '{ "menu": { "id": { "file": "csv" }, "value": { "Window": "popup" }, "popup": { "menuitem": [ { "value": "New", "onclick": { "action": "CreateNewDoc()" } }, { "value": "Open", "onclick": "OpenDoc()" }, { "value": "Close", "onclick": "CloseDoc()" } ], "submenuitem": "CloseSession()" } } }';
        const transformer = '{ "#": [ "#delete(#valueof($.boolean))" ] }';

        //TODO exception message
        //expect(() => new JsonTransformer(null).transform(transformer, input)).to.throw("Invalid path for #delete: '#valueof($.boolean)' resolved to null!");
        expect(() => new JsonTransformer(null).transform(transformer, input)).to.throw();
    });

    it('copy add property', () => {
        const input = '{ "unknown-property": "value", "known-property": { "unknown-sub-property1": "value1", "unknown-sub-property2": "value2\", "unknown-sub-propertyN": "valueN" } }';
        const transformer = '{ "#": [ "#copy($)" ], "known-property": { "additional-sub-property": "value" } }';

        var result = new JsonTransformer({ evaluationMode: 'addOrReplaceProperties' }).transform(transformer, input);

        expect(result).to.deep.equal({ "known-property": { "additional-sub-property": "value", "unknown-sub-property1": "value1", "unknown-sub-property2": "value2", "unknown-sub-propertyN": "valueN" }, "unknown-property": "value" });
    });

    it('copy replace property', () => {
        const input = '{ "menu": { "id": { "file": "csv" }, "value": { "Window": "popup" }, "popup": { "menuitem": [ { "value": "New", "onclick": { "action": "CreateNewDoc()" } }, { "value": "Open", "onclick": "OpenDoc()" }, { "value": "Close", "onclick": "CloseDoc()" } ], "submenuitem": "CloseSession()" } } }';
        const transformer = '{ "#": [ "#copy($.menu)" ], "id": 1 }';

        var result = new JsonTransformer({ evaluationMode: 'addOrReplaceProperties' }).transform(transformer, input);

        expect(result).to.deep.equal({ id: 1, value: { Window: "popup" }, popup: { menuitem: [{ value: "New", onclick:{ action: "CreateNewDoc()" }}, { value: "Open", onclick: "OpenDoc()" }, { value: "Close", onclick: "CloseDoc()" }], submenuitem: "CloseSession()" }});
    });

    it('copy replace sub property', () => {
        const input = '{ "menu": { "id": { "file": "csv" }, "value": { "Window": "popup" }, "popup": { "menuitem": [ { "value": "New", "onclick": { "action": "CreateNewDoc()" } }, { "value": "Open", "onclick": "OpenDoc()" }, { "value": "Close", "onclick": "CloseDoc()" } ], "submenuitem": "CloseSession()" } } }';
        const transformer = '{ "#": [ "#copy($.menu)" ], "popup": { "menuitem": [] } }';

        var result = new JsonTransformer({ evaluationMode: 'addOrReplaceProperties' }).transform(transformer, input);

        expect(result).to.deep.equal({ popup: { menuitem: [], submenuitem: "CloseSession()" }, id: { file: "csv"}, value: { Window: "popup" }});
    });
});
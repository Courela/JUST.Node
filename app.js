import JsonTransformer  from './jsonTransformer.js';
const escapeChar = "/";
const input = '{ "menu": { "id": { "file": "csv" }, "value": { "Window": "popup" }, "popup": { "menuitem": [ { "value": "New", "onclick": { "action": "CreateNewDoc()" } }, { "value": "Open", "onclick": "OpenDoc()" }, { "value": "Close", "onclick": "CloseDoc()" } ], "submenuitem": "CloseSession()" } } }';
        const transformer = '{ "#": [ "#copy($.menu)" ], "popup": { "menuitem": [] } }';
let t = new JsonTransformer({ evaluationMode: [ 'fallbackToDefault', 'addOrReplaceProperties' ] });
let result = t.transform(transformer, input);
console.log(result);

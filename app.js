import JsonTransformer  from './jsonTransformer.js';
const escapeChar = "/";
const input = '[{ "id": 1, "cnt": 100, "rowNum": 1, "col": 1 },{ "id": 2, "cnt": 89, "rowNum": 1, "col": 1 }]';
        const transformer = '[{ "a": "#valueof($)" }, { "#loop($)": { "key": "#currentvalueatpath($.id)", "quantity": "#currentvalueatpath($.cnt)" } }]';
let t = new JsonTransformer({ evaluationMode: ['strict','joinArrays'] });
let result = t.transform(transformer, input);
console.log(result);

// const cypress = require('cypress')

// cypress.run({
//   // the path is relative to the current working directory
//   spec: './cypress/integration/valueof.spec.js'
// })
// .then((results) => {
//   console.log(results)
// })
// .catch((err) => {
//   console.error(err)
// })
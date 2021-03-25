import JsonTransformer  from './jsonTransformer.js';
const input = '{ "numbers": [ 1, 2, 3, 4, 5 ]}';
const transformer = '{ "iteration": { "#loop($.numbers)": { "current_value": \"#currentvalue()" } } }';
let t = new JsonTransformer({ evaluationMode: [ 'strict' ]});
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
# JUST.Node

Port of <https://github.com/WorkMaze/JUST.net>

Tranformer and input should be a string with valid JSON.

Context is an object that have a property 'evaluationMode'. If not provided, or if provided without an 'evaluationMode', one will be added with 'fallbackToDefault' as default.
'evaluationMode' can be a string or an array of strings.
Possible values are:

* fallbackToDefault
* strict
* addOrReplaceProperties
* joinArrays

``var result = new JsonTransformer({ evaluationMode: [ 'strict' ]}).transform(transformer, input);``

## Differences

For loop over properties, properties cannot be string numbers, it will be converted automatically to numbers.

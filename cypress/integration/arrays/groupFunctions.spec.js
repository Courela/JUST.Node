import JsonTransformer from "../../../jsonTransformer.js";

context('Group Functions', () => {
    beforeEach(() => {
    });

    it('group by single element', () => {
        const input = '{ "Forest": [ { "type": "Mammal", "qty": 1, "name": "Hippo" }, { "type": "Bird", "qty": 2, "name": "Sparrow" }, { "type": "Amphibian", "qty": 300, "name": "Lizard" }, { "type": "Bird", "qty": 3, "name": "Parrot" }, { "type": "Mammal", "qty": 1, "name": "Elephant" }, { "type": "Mammal", "qty": 10, "name": "Dog" } ] }';
        const transformer = '{ "Result": "#grouparrayby($.Forest,type,all)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ Result: [{ type: "Mammal", all: [{ qty: 1, name: "Hippo" },{ qty: 1, name: "Elephant" }, { qty: 10, name: "Dog" }] },{ type: "Bird", all: [{ qty: 2, name: "Sparrow" },{ qty: 3, name: "Parrot" }] },{ type: "Amphibian", all: [{ qty: 300, name: "Lizard" } ]} ]});
    });
});
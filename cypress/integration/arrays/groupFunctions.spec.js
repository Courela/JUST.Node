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
    
    it('group by multiple elements', () => {
        const input = '{ "Vehicle": [ { "type": "air", "company": "Boeing", "name": "airplane" }, { "type": "air", "company": "Concorde", "name": "airplane" }, { "type": "air", "company": "Boeing", "name": "Chopper" }, { "type": "land", "company": "GM", "name": "car" }, { "type": "sea", "company": "Viking", "name": "ship" }, { "type": "land", "company": "GM", "name": "truck" } ] }';
        const transformer = '{ "Result": "#grouparrayby($.Vehicle,type:company,all)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ Result: [{ type: "air", company: "Boeing", all: [{ name: "airplane" },{ name: "Chopper" }] },{ type: "air", company: "Concorde", all: [{ name: "airplane" }] },{ type: "land", company: "GM", all: [{ name: "car" },{ name: "truck" }] },{ type: "sea", company: "Viking", all:[{ name: "ship" }] }] });
    });
});
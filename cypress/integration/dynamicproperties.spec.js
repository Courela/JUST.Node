import JsonTransformer from "../../jsonTransformer.js";

context('Dynamic Properties', () => {
    beforeEach(() => {
    });
  
    it('eval with string', () => {
        const input = '{ "tree": { "branch": "leaf", "flower": "rose" } }';
        const transformer = '{ "result": { "#eval(#valueof($.tree.flower))": "is red" } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: { rose: "is red" }});
    });

    it('eval with boolean', () => {
        const input = '{ "tree": { "branch": "leaf", "flower": "rose" } }';
        const transformer = '{ "result": { "#eval(#valueof($.tree.flower))": true } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: { rose: true }});
    });

    it('eval with number', () => {
        const input = '{ "tree": { "branch": "leaf", "flower": "rose" } }';
        const transformer = '{ "result": { "#eval(#valueof($.tree.flower))": 12.2 } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: { rose: 12.2 }});
    });

    it('eval with null', () => {
        const input = '{ "tree": { "branch": "leaf", "flower": "rose" } }';
        const transformer = '{ "result": { "#eval(#valueof($.tree.flower))": null } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: { rose: null }});
    });

    it('eval with function', () => {
        const input = '{ "tree": { "branch": "leaf", "flower": "rose" } }';
        const transformer = '{ "result": { "#eval(#valueof($.tree.flower))": "#valueof($.tree.branch)" } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: { rose: "leaf" }});
    });

    it('eval inside loops', () => {
        const input = '{ "arrayobjects": [{ "country": { "name": "Norway", "language": "norsk"}}, { "country": { "name": "UK", "language": "english" } }, { "country": { "name": "Sweden", "language": "swedish" } }] }';
        const transformer = '{ "iteration": { "#loop($.arrayobjects)": { "#eval(#currentvalueatpath($.country.name))": "#currentvalueatpath($.country.language)" } } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ iteration: [{ Norway: "norsk" },{ "UK": "english" },{ Sweden: "swedish" }] });
    });

    it('multiple evals', () => {
        const input = '{ "people": [{ "name": "Jim", "number": "0123-4567-8888" }, { "name": "John", "number": "0134523-4567-8910" }]}';
        const transformer = '{ "root": { "#loop($.people)": { "#eval(#xconcat(name, #tostring(#add(#currentindex(),1))))": "#currentvalueatpath($.name)", "#eval(#xconcat(number, #tostring(#add(#currentindex(),1))))": "#currentvalueatpath($.number)" } } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ root: [{ name1: "Jim", number1: "0123-4567-8888" },{ name2: "John", number2: "0134523-4567-8910" }] });
    });

    it('empty eval', () => {
        const input = '{ "tree": { "branch": "leaf", "flower": "rose" } }';
        const transformer = '{ "result": { "#eval()": "#valueof($.tree.branch)" } }';

        expect(() => new JsonTransformer(null).transform(transformer, input)).to.throw();
    });
});
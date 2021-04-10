import JsonTransformer from "../../jsonTransformer.js";

context('IfCondition', () => {
    beforeEach(() => {
    });
  
    it('primitive first true condition string result', () => {
        const input = '{ "string": "some words", "integer": 123, "boolean": true }';
        const transformer = '{ "result": "#ifcondition(true,#valueof($.boolean),truevalue,falsevalue)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: "truevalue" });
    });

    it('primitive first false condition string result', () => {
        const input = '{ "string": "some words", "integer": 123, "boolean": true }';
        const transformer = '{ "result": "#ifcondition(dummy,#valueof($.boolean),truevalue,falsevalue)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: "falsevalue" });
    });

    it('fn first true condition string result', () => {
        const input = '{ "string": "some words", "integer": 123, "boolean": true }';
        const transformer = '{ "result": "#ifcondition(#valueof($.boolean),true,truevalue,falsevalue)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: "truevalue" });
    });

    it('fn first false condition string result', () => {
        const input = '{ "string": "some words", "integer": 123, "boolean": true }';
        const transformer = '{ "result": "#ifcondition(#valueof($.integer),555,truevalue,falsevalue)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: "falsevalue" });
    });

    it('fn both true condition string result', () => {
        const input = '{ "string": "some words", "integer": 123, "boolean": true, "same_integer": 123 }';
        const transformer = '{ "result": "#ifcondition(#valueof($.integer),#valueof($.same_integer),truevalue,falsevalue)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: "truevalue" });
    });

    it('fn both false condition string result', () => {
        const input = '{ "string": "some words", "integer": 123, "boolean": true, "same_integer": 123 }';
        const transformer = '{ "result": "#ifcondition(#valueof($.string),#valueof($.same_integer),truevalue,falsevalue)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: "falsevalue" });
    });

    it('true fn result', () => {
        const input = '{ "string": "some words", "integer": 123, "boolean": true, "same_integer": 123 }';
        const transformer = '{ "result": "#ifcondition(#valueof($.integer),#valueof($.same_integer),#valueof($.boolean),falsevalue)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: true });
    });

    it('false fn result', () => {
        const input = '{ "string": "some words", "integer": 123, "boolean": true, "other_integer": 1235 }';
        const transformer = '{ "result": "#ifcondition(#valueof($.integer),#valueof($.other_integer),truevalue,#valueof($.other_integer))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: 1235 });
    });

    it('lazy evaluation true condition', () => {
        const input = '{ "string": "some words", "integer": 123, "boolean": true, "other_integer": 1235 }';
        const transformer = '{ "result": "#ifcondition(#valueof($.boolean),true,#valueof($.other_integer),#valueof(invalid.jsonPath.$))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: 1235 });
    });

    it('lazy evaluation false condition', () => {
        const input = '{ "string": "some words", "integer": 123, "boolean": true, "other_integer": 1235 }';
        const transformer = '{ "result": "#ifcondition(#valueof($.boolean),false,#valueof(invalid.jsonPath.$),#valueof($.other_integer))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: 1235 });
    });

    it('conditional group true', () => {
        const input = '{ "Tree": { "Branch": "leaf", "Flower": "Rose" } }';
        const transformer = '{ "Result": { "Header": "JsonTransform", "#ifgroup(#exists($.Tree.Branch))": { "State": { "Value1": "#valueof($.Tree.Branch)", "Value2": "#valueof($.Tree.Flower)" } } } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ Result: { Header: "JsonTransform", State: { Value1: "leaf", Value2: "Rose" } } });
    });

    it('conditional group false', () => {
        const input = '{ "Tree": { "Branch": "leaf", "Flower": "Rose" } }';
        const transformer = '{ "Result": { "Header": "JsonTransform", "#ifgroup(#exists($.Tree.Root))": { "State": { "Value1": "#valueof($.Tree.Branch)", "Value2": "#valueof($.Tree.Flower)" } } } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ Result: { Header: "JsonTransform" } });
    });

    it('conditional group exception', () => {
        const input = '{ "Tree": { "Branch": "leaf", "Flower": "Rose" } }';
        const transformer = '{ "Result": { "Header": "JsonTransform", "#ifgroup(wrong_val)": { "State": { "Value1": "#valueof($.Tree.Branch)", "Value2": "#valueof($.Tree.Flower)" } } } }';

        //TODO exception message
        //expect(() => new JsonTransformer({ evaluationMode: 'strict'}).transform(transformer, input)).to.throw('String was not recognized as a valid Boolean');
        expect(() => new JsonTransformer({ evaluationMode: 'strict'}).transform(transformer, input)).to.throw();
    });

    it('conditional group one missing strict', () => {
        const input = '{ "Tree": { "Branch": "leaf", "Flower": "Rose" } }';
        const transformer = '{ "Result": { "#ifgroup(#exists($.non_existance))": { "State": { "Value1": "#valueof($.Tree.Branch)", "Value2": "#valueof($.Tree.Flower)" }} } }';

        var result = new JsonTransformer(null).transform(transformer, input);
        
        expect(result).to.deep.equal({ Result: { } });
    });

    it('conditional group inside loop', () => {
        const input = '{ "arrayobjects": [ {"country": { "name": "Norway", "language": "norsk"}}, { "country": { "name": "UK", "language": "english" } }, { "country": { "name": "Sweden", "language": "swedish" } }] }';
        const transformer = '{ "iteration": { "#loop($.arrayobjects)": { "#ifgroup(#stringequals(#currentvalueatpath($.country.name),UK))": { "current_value_at_path": "#currentvalueatpath($.country.name)" } } }}';
 
        var result = new JsonTransformer().transform(transformer, input);

        expect(result).to.deep.equal({ iteration: [{ },{ "current_value_at_path":"UK"},{ }] });
    });

    it('conditional group true with loop inside', () => {
        const input = '{ "errors": { "account": [ "error1", "error2" ] } }';
        const transformer = '{ "Result": { "#ifgroup(#exists($.errors.account))": { "#loop($.errors.account)": { "ValidationMessage": "#currentvalueatpath($)" } } }, "Other": "property" }';
 
        var result = new JsonTransformer().transform(transformer, input);

        expect(result).to.deep.equal({ Result: [{ ValidationMessage: "error1" }, { ValidationMessage: "error2" }], Other: "property" });
    });

    it('conditional group false with loop inside', () => {
        const input = '{ "errors": { "account": [ ] } }';
        const transformer = '{ "Result": { "#ifgroup(#exists($.errors.account))": { "#loop($.errors.account)": { "ValidationMessage": "#currentvalueatpath($)" } } }, "Other": "property" }';
 
        var result = new JsonTransformer().transform(transformer, input);

        expect(result).to.deep.equal({ Result: { }, Other: "property" });
    });

    it('conditional group non existing with loop inside', () => {
        const input = '{ "errors": { "account": [ ] } }';
        const transformer = '{ "Result": { "#ifgroup(#exists($.errors.account))": { "#loop($.errors.account)": { "ValidationMessage": "#currentvalueatpath($)" } } }, "Other": "property" }';
 
        var result = new JsonTransformer().transform(transformer, input);

        expect(result).to.deep.equal({ Result: { }, Other: "property" });
    });
});

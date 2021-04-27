import JsonTransformer from "../../jsonTransformer.js";

context('Apply Over', () => {
    beforeEach(() => {
    });

    it('input retake', () => {
        const input = '{ "d": [ "one", "two", "three" ], "values": [ "z", "c", "n" ]}';
        const transformer = '{ "result": "#applyover({ \\"condition\\": { \\"#loop($.values)\\": { \\"test\\": \\"#ifcondition(#stringcontains(#valueof($.d[0]),#currentvalue()),true,yes,no)\\" } } },#exists($.condition[?(@.test==\'yes\')]))", "after_result": "#valueof($.d[0])" }';

        var result = new JsonTransformer({ evaluationMode: [ "strict" ]}).transform(transformer, input);

        expect(result).to.deep.equal({ result: true, after_result: "one"});
    });
});

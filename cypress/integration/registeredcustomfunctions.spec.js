import JsonTransformer from "../../jsonTransformer.js";
import staticMethod from "../../externalMethods.js"

context('Registered Custom Functions', () => {
    beforeEach(() => {
    });

    it('external static method', () => {
        const input = '{ }';
        const transformer = '{ "result": "#StaticMethod()" }';
        let trans = new JsonTransformer(null);
        trans.registerCustomFunction("StaticMethod", staticMethod);
        
        var result = trans.transform(transformer, input);

        expect(result).to.deep.equal({ result: "External Static"});
    });

    it('invalid function', () => {
        const input = '{ }';
        const transformer = '{ "result": "#StaticMethod()" }';

        expect(() => new JsonTransformer(null).transform(transformer, input)).to.throw('Invalid function: StaticMethod');
    });
});
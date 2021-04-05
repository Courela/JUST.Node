import JsonTransformer from "../../jsonTransformer.js";

context('Arguments Escape', () => {
    const escapeChar = "/";

    beforeEach(() => {
    });
  
    it('no escaped characters', () => {
        const input = '{}';
        const transformer = '{ "result": "#xconcat(arg1,#constant_hash())" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: "arg1#" });
    });

    it('escaped brakets', () => {
        const input = '{}';
        const transformer = '{ "result": "#xconcat(' + escapeChar + '(' + escapeChar + '),#constant_hash())" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: "()#" });
    });

    it('escaped comma', () => {
        const input = '{}';
        const transformer = '{ "result": "#xconcat(' + escapeChar + ',,#constant_hash())" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: ",#" });
    });

    it('escaped sharp value', () => {
        const input = '{}';
        const transformer = '{ "result": "' + escapeChar + '#" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: "#" });
    });

    it('escaped sharp argument', () => {
        const input = '{}';
        const transformer = '{ "result": "#xconcat(' + escapeChar + '#,#constant_hash())" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: "##" });
    });

    it('nested functions escaped arguments', () => {
        const args = '#arg1,#xconcat(/#notfunc/(/), #constant_comma(),#xconcat(/,arg2.3.1,#constant_hash(),\'arg2.3.3),/,,#tostring(#add(3,2)))';
        const input = '{ "test\": "' + args + '" }';
        const transformer = '{ "result": "#xconcat(' + args + ',#constant_hash())" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: "#arg1#notfunc(),,arg2.3.1#'arg2.3.3,5#" });
    });

    it('mixed arguments', () => {
        const args = 'arg1' +
                ',#xconcat(arg2.1,#constant_comma(),#xconcat(arg2.3.1,#constant_hash(),arg2.3.3),#tostring(#add(1,2)))' +
                ',arg4/(.1/)' +
                ',arg5/,';
        const input = '{ \"test\": "' + args + '" }';
        const transformer = '{ "result": "#xconcat(' + args + ',#constant_hash())" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: "arg1arg2.1,arg2.3.1#arg2.3.33arg4(.1)arg5,#" });
    });

    it('consecutive escaped characters', () => {
        const input = '{}';
        const transformer = '{ "result": "#xconcat(///),_end)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: "/)_end"});
    });

    it('escaped escape characters', () => {
        const input = '{}';
        const transformer = '{ "result": "#xconcat(//,_end)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: "/_end" });
    });
});
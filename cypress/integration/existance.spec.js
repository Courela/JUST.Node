import JsonTransformer from "../../jsonTransformer.js";

context('Existance', () => {
    beforeEach(() => {
    });
  
    it('exists', () => {
        const input = '{ "BuyDate": "2017-04-10T11:36:39+03:00", "Defects": "", "Notes": null }';
        const transformer = '{ "IsBought": "#exists($.BuyDate)", "HasExpireDate": "#exists($.ExpireDate)", "HasDefects": "#exists($.Defects)", "HasNotes": "#exists($.Notes)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ IsBought: true, HasExpireDate: false, HasDefects: true, HasNotes: true });
    });

    it('exists nested', () => {
        const input = '{ "path": "$.BuyDate", "BuyDate": "2017-04-10T11:36:39+03:00", "Defects": "", "Notes": null }';
        const transformer = '{ "IsBought": "#exists(#valueof($.path))", "HasExpireDate": "#exists($.ExpireDate)", "HasDefects": "#exists($.Defects)", "HasNotes": "#exists($.Notes)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ IsBought: true, HasExpireDate: false, HasDefects: true, HasNotes: true });
    });

    it('exists fallback to default', () => {
        const input = '{ "BuyDate": "2017-04-10T11:36:39+03:00", "Defects": "", "Notes": null }';
        const transformer = '{ "IsBought": "#exists()" }';

        var result = new JsonTransformer({ evaluationMode: 'fallbackToDefault' }).transform(transformer, input);

        expect(result).to.deep.equal({ IsBought: false });
    });

    it('exists strict error', () => {
        const input = '{ "BuyDate": "2017-04-10T11:36:39+03:00", "Defects": "", "Notes": null }';
        const transformer = '{ "IsBought": "#exists()" }';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw();
    });

    it('exists and not empty', () => {
        const input = '{ "BuyDate": "2017-04-10T11:36:39+03:00", "Defects": "", "Notes": null }';
        const transformer = '{ "IsBought": "#existsandnotempty($.BuyDate)", "HasExpireDate": "#existsandnotempty($.ExpireDate)", "HasDefects": "#existsandnotempty($.Defects)", "HasNotes": "#existsandnotempty($.Notes)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ IsBought: true, HasExpireDate: false, HasDefects: false, HasNotes: false});
    });

    it('exists and not empty array', () => {
        const input = '{ "BuyDate": "2017-04-10T11:36:39+03:00", "Defects": "", "Notes": [ "Note1" ] }';
        const transformer = '{ "IsBought": "#existsandnotempty($.BuyDate)", "HasExpireDate": "#existsandnotempty($.ExpireDate)", "HasDefects": "#existsandnotempty($.Defects)", "HasNotes": "#existsandnotempty($.Notes)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ IsBought: true, HasExpireDate: false, HasDefects: false, HasNotes: true});
    });

    it('exists but empty array', () => {
        const input = '{ "BuyDate": "2017-04-10T11:36:39+03:00", "Defects": "", "Notes": [ ] }';
        const transformer = '{ "IsBought": "#existsandnotempty($.BuyDate)", "HasExpireDate": "#existsandnotempty($.ExpireDate)", "HasDefects": "#existsandnotempty($.Defects)", "HasNotes": "#existsandnotempty($.Notes)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ IsBought: true, HasExpireDate: false, HasDefects: false, HasNotes: false });
    });

    it('exists and not empty nested', () => {
        const input = '{ "path": "$.BuyDate", "BuyDate": "2017-04-10T11:36:39+03:00", "Defects": "", "Notes": null }';
        const transformer = '{ "IsBought": "#existsandnotempty(#valueof($.path))", "HasExpireDate": "#existsandnotempty($.ExpireDate)", "HasDefects": "#existsandnotempty($.Defects)", "HasNotes": "#existsandnotempty($.Notes)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ IsBought: true, HasExpireDate: false, HasDefects: false, HasNotes: false });
    });

    it('exists and not empty fallback to default', () => {
        const input = '{ "BuyDate": "2017-04-10T11:36:39+03:00", "Defects": "", "Notes": null }';
        const transformer = '{ "IsBought": "#existsandnotempty()" }';

        var result = new JsonTransformer({ evaluationMode: 'fallbackToDefault' }).transform(transformer, input);

        expect(result).to.deep.equal({ IsBought: false });
    });

    it('exists and not empty strict error', () => {
        const input = '{ "BuyDate": "2017-04-10T11:36:39+03:00", "Defects": "", "Notes": null }';
        const transformer = '{ "IsBought": "#existsandnotempty()" }';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw();
    });

    it('exists inside loop', () => {
        const input = '[{ "id": "id1", "category": "cat1" }, { "id": "id2" }]';
        const transformer = '{ "items": { "#loop($)": { "id": "#currentvalueatpath($.id)", "existance": "#exists($.category)" } } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ items: [{ id: "id1", existance: true },{ id: "id2", existance: false }] });
    });
});
import JsonTransformer from "../../../jsonTransformer.js";

context('Output', () => {
    beforeEach(() => {
    });

    it('as array', () => {
        const input = '[{ "id": 1, "cnt": 100, "rowNum": 1, "col": 1},{"id": 2, "cnt": 89, "rowNum": 1, "col": 1 }]';
        const transformer = '[{ "#loop($)": { "key": "#currentvalueatpath($.id)", "quantity": "#currentvalueatpath($.cnt)" } }]';

        var result = new JsonTransformer({ evaluationMode: [ 'strict', 'joinArrays' ]}).transform(transformer, input);

        expect(result).to.deep.equal([{ key: 1, quantity: 100 },{ key: 2, quantity: 89 }]);
    });

    it('array as loop result', () => {
        const input = '[{ "id": 1, "cnt": 100, "rowNum": 1, "col": 1 },{ "id": 2, "cnt": 89, "rowNum": 1, "col": 1 }]';
        const transformer = '{ "#loop($)": { "key": "#currentvalueatpath($.id)", "quantity": "#currentvalueatpath($.cnt)" } }';

        var result = new JsonTransformer({ evaluationMode: [ 'strict', 'joinArrays' ]}).transform(transformer, input);

        expect(result).to.deep.equal([{ key: 1, quantity: 100 },{ key: 2, quantity: 89 }]);
    });

    it('array as valueof result', () => {
        const input = '[{ "id": 1, "cnt": 100, "rowNum": 1, "col": 1 },{ "id": 2, "cnt": 89, "rowNum": 1, "col": 1 }]';
        const transformer = '[{ "a": "#valueof($)" }, { "#loop($)": { "key": "#currentvalueatpath($.id)", "quantity": "#currentvalueatpath($.cnt)" } }]';

        var result = new JsonTransformer({ evaluationMode: [ 'strict', 'joinArrays' ]}).transform(transformer, input);

        expect(result).to.deep.equal([{ a: [{ id: 1, cnt: 100, rowNum: 1, col: 1 },{ id: 2, cnt: 89, rowNum: 1, col: 1 }] },{ key: 1, quantity: 100 },{ key: 2, quantity: 89} ]);
    });

    it('array with array as member', () => {
        const input = '[{ "id": 1, "cnt": 100, "rowNum": 1, "col": 1 },{ "id": 2, "cnt": 89, "rowNum": 1, "col": 1 }]';
        const transformer = '[{ "a": "#valueof($)" }, { "#loop($)": { "key": "#currentvalueatpath($.id)", "quantity": "#currentvalueatpath($.cnt)" } }]';

        var result = new JsonTransformer({ evaluationMode: [ 'strict' ]}).transform(transformer, input);

        expect(result).to.deep.equal([{ a: [{ id: 1, cnt: 100, rowNum: 1, col: 1 },{ id: 2, cnt: 89, rowNum: 1, col: 1 }] }, [{ key: 1, quantity: 100 },{ key: 2, quantity: 89}] ]);
    });

    it('join arrays', () => {
        const input = '{ "Order": { "OrderId": 123456, "OrderLines": [{ "SkuId": 357159, "Quantity": 12.5 },{ "SkuId": 484186, "Quantity": 10 }] }}';
        const transformer = '[{ "#loop($.Order.OrderLines)": { "OrderId": "#valueof($.Order.OrderId)", "SkuId": "#currentvalueatpath($.SkuId)", "Quantity": "#currentvalueatpath($.Quantity)" } }]';

        var result = new JsonTransformer({ evaluationMode: [ 'strict', 'joinArrays' ]}).transform(transformer, input);

        expect(result).to.deep.equal([{ OrderId: 123456, SkuId: 357159, Quantity: 12.5 },{ OrderId: 123456, SkuId: 484186, Quantity: 10 }]);
    });

    it('array with array inside', () => {
        const input = '{ "Order": { "OrderId": 123456, "OrderLines": [{ "SkuId": 357159, "Quantity": 12.5 },{ "SkuId": 484186, "Quantity": 10 }] }}';
        const transformer = '[{ "#loop($.Order.OrderLines)": { "OrderId": "#valueof($.Order.OrderId)", "SkuId": "#currentvalueatpath($.SkuId)", "Quantity": "#currentvalueatpath($.Quantity)" } }]';

        var result = new JsonTransformer({ evaluationMode: [ 'strict' ]}).transform(transformer, input);

        expect(result).to.deep.equal([[{ OrderId: 123456, SkuId: 357159, Quantity: 12.5 },{ OrderId: 123456, SkuId: 484186, Quantity: 10 }]]);
    });
});
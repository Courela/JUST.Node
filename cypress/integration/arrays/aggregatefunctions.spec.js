import JsonTransformer from "../../../jsonTransformer.js";

context('Aggregate Functions', () => {
    beforeEach(() => {
    });

    it('concat all with array', () => {
        const input = '{ "d": [ "one", "two", "three" ]}';
        const transformer = '{ "concat_all": "#concatall(#valueof($.d))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ concat_all: "onetwothree" });
    });
  
    it('concat all', () => {
        const input = '{ "d": [ "one", "two", "three" ]}';
        const transformer = '{ "concat_all": "#concatall($.d)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ concat_all: "onetwothree" });
    });

    it('concat all fallback to default', () => {
        const input = '{ "arr": [ "string", 0 ]}';
        const transformer = '{ "concat_all": "#concatall(#valueof($.arr))" }';

        var result = new JsonTransformer({ evaluationMode: 'fallbackToDefault' }).transform(transformer, input);

        expect(result).to.deep.equal({ concat_all: null });
    });

    it('concat all strict error', () => {
        const input = '{ "arr": [ "string", 0 ]}';
        const transformer = '{ "concat_all": "#concatall(#valueof($.arr))" }';

        //TODO
        //expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw('Error while calling function : #concatall(#valueof($.arr)) - Invalid value in array to concatenate: 0');
        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw('Invalid value to concatenate!');
    });

    it('concat all at path', () => {
        const input = '{ "x": [{ "v": { "a": "a1,a2,a3", "b": "1", "c": "10" } }, { "v": { "a": "b1,b2", "b": "2", "c": "20" } }, { "v": { "a": "c1,c2,c3", "b": "3", "c": "30" } } ]}';
        const transformer = '{ \"concat_all_at_path\": \"#concatallatpath(#valueof($.x),$.v.a)\" }';

        var result = new JsonTransformer(null).transform(transformer, input);
        
        expect(result).to.deep.equal({ concat_all_at_path: "a1,a2,a3b1,b2c1,c2,c3"});
    });

    it('concat all at path fallback to default', () => {
        const input = '{ "arr": [ { "str": "" }, { "str": 0 } ]}';
        const transformer = '{ "concat_all_at_path": "#concatallatpath(#valueof($.arr),$.str)" }';

        var result = new JsonTransformer({ evaluationMode: 'fallbackToDefault' }).transform(transformer, input);

        expect(result).to.deep.equal({ concat_all_at_path: null });
    });

    it('concat all at path strict error', () => {
        const input = '{ "arr": [ { "str": "" }, { "str": 0 } ]}';
        const transformer = '{ "concat_all_at_path": "#concatallatpath(#valueof($.arr),$.str)" }';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw('Invalid value to concatenate!');
    });

    it('sum with array', () => {
        const input = '{ "numbers": [ 1, 2, 3, 4, 5 ]}';
        const transformer = '{ "sum": "#sum(#valueof($.numbers))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ sum: 15 });
    });

    it('sum', () => {
        const input = '{ "numbers": [ 1, 2, 3, 4, 5 ]}';
        const transformer = '{ "sum": "#sum($.numbers)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ sum: 15 });
    });

    it('sum fallback to default', () => {
        const input = '{ "numbers": [ 1, 2, "", 4, 5 ]}';
        const transformer = '{ "sum": "#sum($.numbers)" }';

        var result = new JsonTransformer({ evaluationMode: 'fallbackToDefault' }).transform(transformer, input);

        expect(result).to.deep.equal({ sum: 0 });
    });

    it('sum strict error', () => {
        const input = '{ "numbers": [ 1, 2, "", 4, 5 ]}';
        const transformer = '{ "sum": "#sum($.numbers)" }';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw();
    });

    it('sum at path', () => {
        const input = '{ "x": [{ "v": { "a": "a1,a2,a3", "b": "1", "c": "10" } }, { "v": { "a": "b1,b2", "b": "2", "c": "20" } }, { "v": { "a": "c1,c2,c3", "b": "3", "c": "30" } } ]}';
        const transformer = '{ \"sum_at_path\": \"#sumatpath(#valueof($.x),$.v.c)\" }';

        var result = new JsonTransformer(null).transform(transformer, input);
        
        expect(result).to.deep.equal({ sum_at_path: 60 });
    });

    it('sum at path fallback to default', () => {
        const input = '{ "x": [{ "v": { "a": "a1,a2,a3", "b": "1", "c": "" } }, { "v": { "a": "b1,b2", "b": "2", "c": "20" } }, { "v": { "a": "c1,c2,c3", "b": "3", "c": "30" } } ]}';
        const transformer = '{ \"sum_at_path\": \"#sumatpath(#valueof($.x),$.v.c)\" }';

        var result = new JsonTransformer({ evaluationMode: 'fallbackToDefault' }).transform(transformer, input);
        
        expect(result).to.deep.equal({ sum_at_path: 0 });
    });

    it('sum at path strict error', () => {
        const input = '{ "x": [{ "v": { "a": "a1,a2,a3", "b": "1", "c": "" } }, { "v": { "a": "b1,b2", "b": "2", "c": "20" } }, { "v": { "a": "c1,c2,c3", "b": "3", "c": "30" } } ]}';
        const transformer = '{ \"sum_at_path\": \"#sumatpath(#valueof($.x),$.v.c)\" }';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw('Invalid value!');
    });

    it('average with array', () => {
        const input = '{ "numbers": [ 1, 2, 3, 4, 5 ]}';
        const transformer = '{ "avg": "#average(#valueof($.numbers))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ avg: 3 });
    });

    it('average', () => {
        const input = '{ "numbers": [ 1, 2, 3, 4, 5 ]}';
        const transformer = '{ "avg": "#average($.numbers)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ avg: 3 });
    });

    it('average fallback to default', () => {
        const input = '{ "numbers": [ 1, 2, "", 4, 5 ]}';
        const transformer = '{ "avg": "#average($.numbers)" }';

        var result = new JsonTransformer({ evaluationMode: 'fallbackToDefault' }).transform(transformer, input);

        expect(result).to.deep.equal({ avg: 0 });
    });

    it('average strict error', () => {
        const input = '{ "numbers": [ 1, 2, "", 4, 5 ]}';
        const transformer = '{ "avg": "#average($.numbers)" }';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw();
    });

    it('average at path', () => {
        const input = '{ "x": [{ "v": { "a": "a1,a2,a3", "b": "1", "c": "10" } }, { "v": { "a": "b1,b2", "b": "2", "c": "20" } }, { "v": { "a": "c1,c2,c3", "b": "3", "c": "30" } } ]}';
        const transformer = '{ \"avg_at_path\": \"#averageatpath(#valueof($.x),$.v.c)\" }';

        var result = new JsonTransformer(null).transform(transformer, input);
        
        expect(result).to.deep.equal({ avg_at_path: 20 });
    });

    it('average at path fallback to default', () => {
        const input = '{ "x": [{ "v": { "a": "a1,a2,a3", "b": "1", "c": "" } }, { "v": { "a": "b1,b2", "b": "2", "c": "20" } }, { "v": { "a": "c1,c2,c3", "b": "3", "c": "30" } } ]}';
        const transformer = '{ \"avg_at_path\": \"#averageatpath(#valueof($.x),$.v.c)\" }';

        var result = new JsonTransformer({ evaluationMode: 'fallbackToDefault' }).transform(transformer, input);
        
        expect(result).to.deep.equal({ avg_at_path: 0 });
    });

    it('average at path strict error', () => {
        const input = '{ "x": [{ "v": { "a": "a1,a2,a3", "b": "1", "c": "" } }, { "v": { "a": "b1,b2", "b": "2", "c": "20" } }, { "v": { "a": "c1,c2,c3", "b": "3", "c": "30" } } ]}';
        const transformer = '{ \"avg_at_path\": \"#averageatpath(#valueof($.x),$.v.c)\" }';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw('Invalid value!');
    });

    it('min with array', () => {
        const input = '{ "numbers": [ 1, 2, 3, 4, 5 ]}';
        const transformer = '{ "min": "#min(#valueof($.numbers))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ min: 1 });
    });

    it('min', () => {
        const input = '{ "numbers": [ 1, 2, 3, 4, 5 ]}';
        const transformer = '{ "min": "#min($.numbers)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ min: 1 });
    });

    it('min fallback to default', () => {
        const input = '{ "numbers": [ 1, 2, "", 4, 5 ]}';
        const transformer = '{ "min": "#min($.numbers)" }';

        var result = new JsonTransformer({ evaluationMode: 'fallbackToDefault' }).transform(transformer, input);

        expect(result).to.deep.equal({ min: 0 });
    });

    it('min strict error', () => {
        const input = '{ "numbers": [ 1, 2, "", 4, 5 ]}';
        const transformer = '{ "min": "#min($.numbers)" }';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw();
    });

    it('min at path', () => {
        const input = '{ "x": [{ "v": { "a": "a1,a2,a3", "b": 1, "c": 10 } }, { "v": { "a": "b1,b2", "b": 2, "c": 20 } }, { "v": { "a": "c1,c2,c3", "b": 3, "c": 30 } } ]}';
        const transformer = '{ \"min_at_path\": \"#minatpath(#valueof($.x),$.v.c)\" }';

        var result = new JsonTransformer(null).transform(transformer, input);
        
        expect(result).to.deep.equal({ min_at_path: 10 });
    });

    it('min at path fallback to default', () => {
        const input = '{ "x": [{ "v": { "a": "a1,a2,a3", "b": 1, "c": "" } }, { "v": { "a": "b1,b2", "b": 2, "c": 20 } }, { "v": { "a": "c1,c2,c3", "b": 3, "c": 30 } } ]}';
        const transformer = '{ \"min_at_path\": \"#minatpath(#valueof($.x),$.v.c)\" }';

        var result = new JsonTransformer({ evaluationMode: 'fallbackToDefault' }).transform(transformer, input);
        
        expect(result).to.deep.equal({ min_at_path: 0 });
    });

    it('min at path strict error', () => {
        const input = '{ "x": [{ "v": { "a": "a1,a2,a3", "b": 1, "c": "" } }, { "v": { "a": "b1,b2", "b": 2, "c": 20 } }, { "v": { "a": "c1,c2,c3", "b": 3, "c": 30 } } ]}';
        const transformer = '{ \"min_at_path\": \"#minatpath(#valueof($.x),$.v.c)\" }';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw('Invalid value!');
    });

    it('max with array', () => {
        const input = '{ "numbers": [ 1, 2, 3, 4, 5 ]}';
        const transformer = '{ "max": "#max(#valueof($.numbers))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ max: 5 });
    });

    it('max', () => {
        const input = '{ "numbers": [ 1, 2, 3, 4, 5 ]}';
        const transformer = '{ "max": "#max($.numbers)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ max: 5 });
    });

    it('max large numbers', () => {
        const input = '[ 1612260328, 1612260332, 1612260185 ]';
        const transformer = '{ "max": "#max(#valueof($))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ max: 1612260332 });
    });

    it('max fallback to default', () => {
        const input = '{ "numbers": [ 1, 2, "", 4, 5 ]}';
        const transformer = '{ "max": "#max($.numbers)" }';

        var result = new JsonTransformer({ evaluationMode: 'fallbackToDefault' }).transform(transformer, input);

        expect(result).to.deep.equal({ max: 0 });
    });

    it('max strict error', () => {
        const input = '{ "numbers": [ 1, 2, "", 4, 5 ]}';
        const transformer = '{ "max": "#max($.numbers)" }';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw();
    });

    it('max at path', () => {
        const input = '{ "x": [{ "v": { "a": "a1,a2,a3", "b": 1, "c": 10 } }, { "v": { "a": "b1,b2", "b": 2, "c": 20 } }, { "v": { "a": "c1,c2,c3", "b": 3, "c": 30 } } ]}';
        const transformer = '{ \"max_at_path\": \"#maxatpath(#valueof($.x),$.v.b)\" }';

        var result = new JsonTransformer(null).transform(transformer, input);
        
        expect(result).to.deep.equal({ max_at_path: 3 });
    });
    
    it('max at path fallback to default', () => {
        const input = '{ "x": [{ "v": { "a": "a1,a2,a3", "b": "", "c": 10 } }, { "v": { "a": "b1,b2", "b": 2, "c": 20 } }, { "v": { "a": "c1,c2,c3", "b": 3, "c": 30 } } ]}';
        const transformer = '{ \"max_at_path\": \"#maxatpath(#valueof($.x),$.v.b)\" }';

        var result = new JsonTransformer({ evaluationMode: 'fallbackToDefault' }).transform(transformer, input);
        
        expect(result).to.deep.equal({ max_at_path: 0 });
    });

    it('max at path strict error', () => {
        const input = '{ "x": [{ "v": { "a": "a1,a2,a3", "b": "", "c": 10 } }, { "v": { "a": "b1,b2", "b": 2, "c": 20 } }, { "v": { "a": "c1,c2,c3", "b": 3, "c": 30 } } ]}';
        const transformer = '{ \"max_at_path\": \"#maxatpath(#valueof($.x),$.v.b)\" }';

        expect(() => new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input)).to.throw('Invalid value!');
    });
});
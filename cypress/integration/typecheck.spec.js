import JsonTransformer from "../../jsonTransformer.js";

context('Type Check', () => {
  beforeEach(() => {
  });

  it('is number true integer', () => {
      const input = '{ "value": 0 }';
      const transformer = '{ "result": "#isnumber(#valueof($.value))" }';

      var result = new JsonTransformer(null).transform(transformer, input);

      expect(result).to.deep.equal({ result: true });
  });

  it('is number true decimal', () => {
    const input = '{ "value": 1.23 }';
    const transformer = '{ "result": "#isnumber(#valueof($.value))" }';

    var result = new JsonTransformer(null).transform(transformer, input);

    expect(result).to.deep.equal({ result: true });
  });

  it('is number false boolean', () => {
    const input = '{ "value": true }';
    const transformer = '{ "result": "#isnumber(#valueof($.value))" }';

    var result = new JsonTransformer(null).transform(transformer, input);

    expect(result).to.deep.equal({ result: false });
  });

  it('is number false string', () => {
    const input = '{ "value": "abc" }';
    const transformer = '{ "result": "#isnumber(#valueof($.value))" }';

    var result = new JsonTransformer(null).transform(transformer, input);

    expect(result).to.deep.equal({ result: false });
  });

  it('is number false array', () => {
    const input = '{ "value": [ "abc", "xyz" ] }';
    const transformer = '{ "result": "#isnumber(#valueof($.value))" }';

    var result = new JsonTransformer(null).transform(transformer, input);

    expect(result).to.deep.equal({ result: false });
  });

  it('is boolean false integer', () => {
    const input = '{ "value": 0 }';
    const transformer = '{ "result": "#isboolean(#valueof($.value))" }';

    var result = new JsonTransformer(null).transform(transformer, input);

    expect(result).to.deep.equal({ result: false });
  });

  it('is boolean false decimal', () => {
    const input = '{ "value": 1.23 }';
    const transformer = '{ "result": "#isboolean(#valueof($.value))" }';

    var result = new JsonTransformer(null).transform(transformer, input);

    expect(result).to.deep.equal({ result: false });
  });

  it('is boolean true boolean', () => {
    const input = '{ "value": true }';
    const transformer = '{ "result": "#isboolean(#valueof($.value))" }';

    var result = new JsonTransformer(null).transform(transformer, input);

    expect(result).to.deep.equal({ result: true });
  });

  it('is boolean false string', () => {
    const input = '{ "value": "abc" }';
    const transformer = '{ "result": "#isboolean(#valueof($.value))" }';

    var result = new JsonTransformer(null).transform(transformer, input);

    expect(result).to.deep.equal({ result: false });
  });

  it('is boolean false array', () => {
    const input = '{ "value": [ "abc", "xyz" ] }';
    const transformer = '{ "result": "#isboolean(#valueof($.value))" }';

    var result = new JsonTransformer(null).transform(transformer, input);

    expect(result).to.deep.equal({ result: false });
  });

  it('is string false integer', () => {
    const input = '{ "value": 0 }';
    const transformer = '{ "result": "#isstring(#valueof($.value))" }';

    var result = new JsonTransformer(null).transform(transformer, input);

    expect(result).to.deep.equal({ result: false });
  });

  it('is string false decimal', () => {
    const input = '{ "value": 1.23 }';
    const transformer = '{ "result": "#isstring(#valueof($.value))" }';

    var result = new JsonTransformer(null).transform(transformer, input);

    expect(result).to.deep.equal({ result: false });
  });

  it('is string false boolean', () => {
    const input = '{ "value": true }';
    const transformer = '{ "result": "#isstring(#valueof($.value))" }';

    var result = new JsonTransformer(null).transform(transformer, input);

    expect(result).to.deep.equal({ result: false });
  });

  it('is string true string', () => {
    const input = '{ "value": "abc" }';
    const transformer = '{ "result": "#isstring(#valueof($.value))" }';

    var result = new JsonTransformer(null).transform(transformer, input);

    expect(result).to.deep.equal({ result: true });
  });

  it('is string false array', () => {
    const input = '{ "value": [ "abc", "xyz" ] }';
    const transformer = '{ "result": "#isstring(#valueof($.value))" }';

    var result = new JsonTransformer(null).transform(transformer, input);

    expect(result).to.deep.equal({ result: false });
  });

  it('is array false integer', () => {
    const input = '{ "value": 0 }';
    const transformer = '{ "result": "#isarray(#valueof($.value))" }';

    var result = new JsonTransformer(null).transform(transformer, input);

    expect(result).to.deep.equal({ result: false });
  });

  it('is array false decimal', () => {
    const input = '{ "value": 1.23 }';
    const transformer = '{ "result": "#isarray(#valueof($.value))" }';

    var result = new JsonTransformer(null).transform(transformer, input);

    expect(result).to.deep.equal({ result: false });
  });

  it('is array false boolean', () => {
    const input = '{ "value": true }';
    const transformer = '{ "result": "#isarray(#valueof($.value))" }';

    var result = new JsonTransformer(null).transform(transformer, input);

    expect(result).to.deep.equal({ result: false });
  });

  it('is array false string', () => {
    const input = '{ "value": "abc" }';
    const transformer = '{ "result": "#isarray(#valueof($.value))" }';

    var result = new JsonTransformer(null).transform(transformer, input);

    expect(result).to.deep.equal({ result: false });
  });

  it('is array true array', () => {
    const input = '{ "value": [ "abc", "xyz" ] }';
    const transformer = '{ "result": "#isarray(#valueof($.value))" }';

    var result = new JsonTransformer(null).transform(transformer, input);

    expect(result).to.deep.equal({ result: true });
  });
});
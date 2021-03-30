import JsonTransformer from "../../jsonTransformer.js";

context('Loops', () => {
    beforeEach(() => {
    });
  
    it('current value primitive', () => {
        const input = '{ "numbers": [ 1, 2, 3, 4, 5 ]}';
        const transformer = '{ "iteration": { "#loop($.numbers)": { "current_value": \"#currentvalue()" } } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ iteration: [{ current_value: 1 },{ current_value: 2 },{ current_value: 3 },{ current_value: 4 },{ current_value: 5 }]});
    });

    it('current value object', () => {
        const input = '{ "arrayobjects\": [ { "country": { "name": "Norway", "language": "norsk" } }, { "country": { "name": "UK", "language": "english" } }, { "country": { "name": "Sweden", "language": "swedish" } }] }';
        const transformer = '{ "iteration": { "#loop($.arrayobjects)": { "current_value": "#currentvalue()" } } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ iteration: [{ current_value: { country: { name: "Norway", language: "norsk" }}}, { current_value: { country: { name: "UK", language: "english" }}},{ current_value: { country: { name: "Sweden", language: "swedish" }}}]});
    });

    it('current index', () => {
        const input = '{ "numbers": [ 1, 2, 3, 4, 5 ]}';
        const transformer = '{ "iteration": { "#loop($.numbers)": { "current_index": \"#currentindex()" } } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ iteration: [{ current_index: 0 },{ current_index: 1 },{ current_index: 2 },{ current_index: 3 },{ current_index: 4 }]});
    });

    it('last index', () => {
        const input = '{ "numbers": [ 1, 2, 3, 4, 5 ]}';
        const transformer = '{ "iteration": { "#loop($.numbers)": { "last_index": \"#lastindex()" } } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ iteration: [{ last_index: 4 },{ last_index: 4 },{ last_index: 4 },{ last_index: 4 },{ last_index: 4 }]});
    });

    it('last value primitive', () => {
        const input = '{ "numbers": [ 1, 2, 3, 4, 5 ]}';
        const transformer = '{ "iteration": { "#loop($.numbers)": { "last_value": \"#lastvalue()" } } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ iteration: [{ last_value: 5 },{ last_value: 5 },{ last_value: 5 },{ last_value: 5 },{ last_value: 5 }]});
    });

    it('last value object', () => {
        const input = '{ "arrayobjects\": [ { "country": { "name": "Norway", "language": "norsk" } }, { "country": { "name": "UK", "language": "english" } }, { "country": { "name": "Sweden", "language": "swedish" } }] }';
        const transformer = '{ "iteration": { "#loop($.arrayobjects)": { "last_value": "#lastvalue()" } } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ iteration: [{ last_value: { country: { name: "Sweden", language: "swedish" }}},{ last_value: { country: { name: "Sweden", language: "swedish" }}}, { last_value: { country: { name: "Sweden", language: "swedish" }}}] });
    });

    it('current value at path primitive', () => {
        const input = '{ "arrayobjects\": [ { "country": { "name": "Norway", "language": "norsk" } }, { "country": { "name": "UK", "language": "english" } }, { "country": { "name": "Sweden", "language": "swedish" } }] }';
        const transformer = '{ "iteration": { "#loop($.arrayobjects)": { "current_value_at_path": "#currentvalueatpath($.country.name)" } } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ iteration: [{ current_value_at_path: "Norway" }, { current_value_at_path: "UK" },{ current_value_at_path: "Sweden" }]});
    });

    it('current value at path object', () => {
        const input = '{ "arrayobjects\": [ { "country": { "name": "Norway", "language": "norsk" } }, { "country": { "name": "UK", "language": "english" } }, { "country": { "name": "Sweden", "language": "swedish" } }] }';
        const transformer = '{ "iteration": { "#loop($.arrayobjects)": { "current_value_at_path": "#currentvalueatpath($.country)" } } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ iteration: [{ current_value_at_path: { name: "Norway", language: "norsk" }}, { current_value_at_path: { name: "UK", language: "english" }},{ current_value_at_path: { name: "Sweden", language: "swedish" }} ]});
    });

    it('last value at path primitive', () => {
        const input = '{ "arrayobjects\": [ { "country": { "name": "Norway", "language": "norsk" } }, { "country": { "name": "UK", "language": "english" } }, { "country": { "name": "Sweden", "language": "swedish" } }] }';
        const transformer = '{ "iteration": { "#loop($.arrayobjects)": { "last_value_at_path": "#lastvalueatpath($.country.language)" } } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ iteration: [{ last_value_at_path: "swedish" },{ last_value_at_path: "swedish" }, { last_value_at_path: "swedish" }] });
    });

    it('last value at path object', () => {
        const input = '{ "arrayobjects\": [ { "country": { "name": "Norway", "language": "norsk" } }, { "country": { "name": "UK", "language": "english" } }, { "country": { "name": "Sweden", "language": "swedish" } }] }';
        const transformer = '{ "iteration": { "#loop($.arrayobjects)": { "last_value_at_path": "#lastvalueatpath($.country)" } } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ iteration: [{ last_value_at_path: { name: "Sweden", language: "swedish" }},{ last_value_at_path: { name: "Sweden", language: "swedish" }}, { last_value_at_path: { name: "Sweden", language: "swedish" }} ] });
    });

    it('nested looping', () => {
        const input = '{ "NestedLoop": { "Organization": { "Employee": [ { "Name": "E2", "Details": [ { "Country": "Iceland", "Age": "30", "Name": "Sven", "Language": "Icelandic", "Roles": [ { "Job": "Janitor", "Salary": 100 }, { "Job": "Security", "Salary": 200 } ] } ] }, { "Name": "E1", "Details": [ { "Country": "Denmark", "Age": "30", "Name": "Svein", "Language": "Danish", "Roles": [ { "Job": "Manager", "Salary": 300 }, { "Job": "Developer", "Salary": 400 } ] } ] } ] } } }';
        const transformer = '{ "hello": { "#loop($.NestedLoop.Organization.Employee)": { "Details": { "#loop($.Details)": { "CurrentCountry": "#currentvalueatpath($.Country)" } } } } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ hello: [{ Details: [{ CurrentCountry: "Iceland" }]},{ Details: [{ CurrentCountry: "Denmark" }] }] });
    });

    it('function as loop argument', () => {
        const input = '{ "NestedLoop": { "Organization": { "Employee": [ { "Name": "E2", "Details": [ { "Country": "Iceland", "Age": "30", "Name": "Sven", "Language": "Icelandic", "Roles": [ { "Job": "Janitor", "Salary": 100 }, { "Job": "Security", "Salary": 200 } ] } ] }, { "Name": "E1", "Details": [ { "Country": "Denmark", "Age": "30", "Name": "Svein", "Language": "Danish", "Roles": [ { "Job": "Manager", "Salary": 300 }, { "Job": "Developer", "Salary": 400 } ] } ] } ] } } }';
        const transformer = '{ "hello": { "#loop(#xconcat($.NestedLoop.,Organization,.Employee))": { "Details": { "#loop(#concat($.,Details))": { "CurrentCountry": "#currentvalueatpath($.Country)" } } } } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ hello: [{ Details: [{ CurrentCountry: "Iceland" }]},{ Details: [{ CurrentCountry: "Denmark" }] }] });
    });

    it('primitive type array result', () => {
        const input = '[{ "id": 1, "name": "Person 1", "gender": "M" },{ "id": 2, "name": "Person 2", "gender": "F" },{ "id": 3, "name": "Person 3", "gender": "M" }]';
        const transformer = '{ "result": { "#loop($[?(@.gender==\'M\')])": "#currentvalueatpath($.name)" } }';

        var result = new JsonTransformer({ evaluationMode: [ 'strict' ]}).transform(transformer, input);

        expect(result).to.deep.equal({ result: [ "Person 1", "Person 3" ]});
    });

    it('object type array result', () => {
        const input = '[{ "id": 1, "name": "Person 1", "gender": "M" },{ "id": 2, "name": "Person 2", "gender": "F" },{ "id": 3, "name": "Person 3", "gender": "M" }]';
        const transformer = '{ "result": { "#loop($[?(@.gender==\'M\')])": "#currentvalue()" } }';

        var result = new JsonTransformer({ evaluationMode: [ 'strict' ]}).transform(transformer, input);

        expect(result).to.deep.equal({ result: [{ id: 1, name: "Person 1", gender: "M" },{ id: 3, name: "Person 3", gender: "M" }]});
    });

    it('loop over properties', () => {
        const input = '{ "animals": { "cat": { "legs": 4, "sound": "meow" }, "dog": { "legs": 4, "sound": "woof" } }, "spell_numbers": { \"3\": "three", \"2\": "two", \"1\": "one" } }';
        const transformer = '{ "sounds": { "#loop($.animals)": { "#eval(#currentproperty())": "#currentvalueatpath($..sound)" } }, "number_index": { "#loop($.spell_numbers)": { "#eval(#currentindex())": "#currentvalueatpath(#concat($.,#currentproperty()))" } }}';

        var result = new JsonTransformer({ evaluationMode: [ 'strict' ]}).transform(transformer, input);

        expect(result).to.deep.equal({ sounds: { cat: "meow", dog: "woof" }, number_index: { 0: "three", 1: "two", 2: "one" }});
    });

    it('empty properties looping', () => {
        const input = '{ "animals": { } }';
        const transformer = '{ "sounds": { "#loop($.animals)": { "#eval(#currentproperty())": "#currentvalueatpath($..sound)" } } }';

        var result = new JsonTransformer({ evaluationMode: [ 'strict' ]}).transform(transformer, input);

        expect(result).to.deep.equal({ sounds: { }});
    });

    it('null looping', () => {
        const input = '{ "spell_numbers": null }';
        const transformer = '{ "number_index": { "#loop($.spell_numbers)": { "#eval(#currentindex())": "#currentvalueatpath(#concat($.,#currentproperty()))" } } }';

        var result = new JsonTransformer({ evaluationMode: [ 'strict' ]}).transform(transformer, input);

        expect(result).to.deep.equal({ number_index: null });
    });

    it('single result filter', () => {
        const input = '{ "array": [{ "resource": "Location", "number": "3" },{ "resource": "Organization", "number": "10" }] }';
        const transformer = '{ "result": { "#loop($.array[?(@.resource==\'Location\')])": { "existsLocation": true }}}';

        var result = new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input);

        expect(result).to.deep.equal({ result: [{ existsLocation: true }] });
    });

    it('single index reference', () => {
        const input = '{ "array": [{ "resource": "Location", "number": "3" },{ "resource": "Organization", "number": "10" }] }';
        const transformer = '{ "result": { "#loop($.array[1])": { "number": "#currentvalueatpath($.number)" }}}';

        var result = new JsonTransformer({ evaluationMode: 'strict' }).transform(transformer, input);

        expect(result).to.deep.equal({ result: [{ number: "10" }] });
    });

    it('looping alias', () => {
        const input = '{ "NestedLoop": { "Organization": { "Employee": [ { "Name": "E2", "Details": [ { "Country": "Iceland", "Age": "30", "Name": "Sven", "Language": "Icelandic", "Roles": [ { "Job": "Janitor", "Salary": 100 }, { "Job": "Security", "Salary": 200 } ] } ] }, { "Name": "E1", "Details": [ { "Country": "Denmark", "Age": "30", "Name": "Svein", "Language": "Danish", "Roles": [ { "Job": "Manager", "Salary": 300 }, { "Job": "Developer", "Salary": 400 } ] } ] } ] } } }';
        const transformer = '{ "hello": { "#loop($.NestedLoop.Organization.Employee, employee)": { "Details": { "#loop($.Details, details)": { "CurrentCountry": "#currentvalueatpath($.Country, details)", "OuterName": "#currentvalueatpath($.Name, employee)", "FirstLevel": { "#loop($.Roles, roles)": { "Employee": "#currentvalue(employee)", "Job": "#currentvalueatpath($.Job, roles)" } } } } } } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ hello: [{ Details: [{ CurrentCountry: "Iceland", OuterName: "E2", FirstLevel: [{ Employee: { Name: "E2", Details:[{ Country: "Iceland", Age: "30", Name: "Sven", Language: "Icelandic", Roles: [{ Job: "Janitor", Salary: 100},{ Job: "Security", Salary: 200 }] }] }, Job: "Janitor" },{ Employee: { Name: "E2", Details: [{ Country: "Iceland", Age: "30", Name: "Sven", Language: "Icelandic", Roles: [{ Job: "Janitor", Salary: 100 },{ Job: "Security", Salary: 200 }] }] }, Job: "Security" }] }] },{ Details: [{ CurrentCountry: "Denmark", OuterName: "E1", FirstLevel: [{ Employee: { Name: "E1", Details: [{ Country: "Denmark", Age: "30", Name: "Svein", Language: "Danish", Roles: [{ Job: "Manager", Salary: 300 },{ Job: "Developer", Salary: 400 }] }] }, Job: "Manager" },{ Employee: { Name: "E1", Details: [{ Country: "Denmark", Age: "30", Name: "Svein", Language: "Danish", Roles: [{ Job: "Manager", Salary: 300 },{ Job: "Developer", Salary: 400}] }] }, Job: "Developer" }] }] }] });
    });

    it('mixed looping alias', () => {
        const input = '{ "NestedLoop": { "Organization": { "Employee": [ { "Name": "E2", "Details": [ { "Country": "Iceland", "Age": "30", "Name": "Sven", "Language": "Icelandic", "Roles": [ { "Job": "Janitor", "Salary": 100 }, { "Job": "Security", "Salary": 200 } ] } ] }, { "Name": "E1", "Details": [ { "Country": "Denmark", "Age": "30", "Name": "Svein", "Language": "Danish", "Roles": [ { "Job": "Manager", "Salary": 300 }, { "Job": "Developer", "Salary": 400 } ] } ] } ] } } }';
        const transformer = '{ "hello": { "#loop($.NestedLoop.Organization.Employee, employee)": { "CurrentIndex": "#currentindex()", "Details": { "#loop($.Details)": { "CurrentCountry": "#currentvalueatpath($.Country)", "OuterName": "#currentvalueatpath($.Name, employee)" } } } } }';

        var result = new JsonTransformer({ evaluationMode: [ 'strict' ]}).transform(transformer, input);

        expect(result).to.deep.equal({ hello: [{ CurrentIndex: 0, Details: [{ CurrentCountry: "Iceland", OuterName: "E2" }] },{ CurrentIndex: 1, Details: [{ CurrentCountry: "Denmark", OuterName: "E1"}] }] });
    });

    it('bulk functions', () => {
        const input = '{ "score_PCS": [{ "data": "2020-04-08T10:20:21.335+00:00", "score": [{ "score_type": "pcs_tot", "score_value": 0.5 },{ "score_type": "pcs_help", "score_value": 0.46},{ "score_type": "pcs_rum", "score_value": 0.5 },{ "score_type": "pcs_mag", "score_value": 0.63 }] },{ "data": "2020-04-09T10:22:03.267+00:00", "score": [{ "score_type": "pcs_tot", "score_value": 0.38 },{ "score_type": "pcs_help", "score_value": 0.42 },{ "score_type": "pcs_rum", "score_value": 0.35 },{ "score_type": "pcs_mag", "score_value": 0.38 }] },{ "data": "2020-04-09T10:23:05.748+00:00", "score": [{ "score_type": "pcs_tot", "score_value": 0.44 },{ "score_type": "pcs_help", "score_value": 0.38 },{ "score_type": "pcs_rum", "score_value": 0.5 },{ "score_type": "pcs_mag", "score_value": 0.5 }] }] }';
        const transformer = '{ "score_pcs_tot": { "#loop($.score_PCS)": { "#": [ "#copy($.score[?(@.score_type==\'pcs_tot\')])" ], "score_data": "#currentvalueatpath($.data)" } }, "score_pcs_help": { "#loop($.score_PCS)": { "#": [ "#copy($.score[?(@.score_type==\'pcs_help\')])", "#replace($.score_type, #currentvalueatpath($.score[?(@.score_type==\'pcs_rum\')]))" ], "score_data": "#currentvalueatpath($.data)" } }, "score_pcs_rum": { "#loop($.score_PCS)": { "#": [ "#copy($.score[?(@.score_type==\'pcs_rum\')])", "#replace($.score_type, #currentvalueatpath($.score[?(@.score_type==\'pcs_help\')].score_type))" ], "score_data": "#currentvalueatpath($.data)" } }, "score_pcs_mag": { "#loop($.score_PCS)": { "#": [ "#copy($.score[?(@.score_type==\'pcs_mag\')])", "#delete($.score_type)" ], "score_data": "#currentvalueatpath($.data)" } } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ score_pcs_tot:[{ score_data: "2020-04-08T10:20:21.335+00:00", score_type: "pcs_tot", score_value: 0.5 },{ score_data: "2020-04-09T10:22:03.267+00:00", score_type: "pcs_tot", score_value: 0.38 },{ score_data: "2020-04-09T10:23:05.748+00:00", score_type: "pcs_tot", score_value: 0.44 }], score_pcs_help: [{ score_data: "2020-04-08T10:20:21.335+00:00", score_type: { score_type: "pcs_rum", score_value: 0.5 }, score_value: 0.46},{ score_data: "2020-04-09T10:22:03.267+00:00", score_type: { score_type: "pcs_rum", score_value: 0.35 }, score_value: 0.42 },{ score_data: "2020-04-09T10:23:05.748+00:00", score_type: { score_type: "pcs_rum", score_value: 0.5}, score_value: 0.38 }], score_pcs_rum: [{ score_data: "2020-04-08T10:20:21.335+00:00", score_type: "pcs_help", score_value: 0.5},{ score_data: "2020-04-09T10:22:03.267+00:00", score_type: "pcs_help", score_value: 0.35 },{ score_data: "2020-04-09T10:23:05.748+00:00", score_type: "pcs_help", score_value: 0.5 }], score_pcs_mag: [{ score_data: "2020-04-08T10:20:21.335+00:00", score_value: 0.63 },{ score_data: "2020-04-09T10:22:03.267+00:00", score_value: 0.38},{ score_data: "2020-04-09T10:23:05.748+00:00", score_value: 0.5 }] });
    });

    it('inside loop over root', () => {
        const input = '{ "ontologyElements": [ { "id": "8b8b9d6e-4574-466b-b2c3-0062ad0642fe", "name": "Ontology1", "description": "test1", "entityType": "Ontology" }, { "id": "3ac89bbd-0de2-4692-a077-1d5d41efab69", "name": "MainType1", "order": 1, "entityType": "MainType", "ontologyId": "8b8b9d6e-4574-466b-b2c3-0062ad0642fe" }, { "id": "97aa4eb2-0515-43d6-ba59-ffd931956b1a", "name": "SubType1", "order": 1, "entityType": "SubType", "ontologyId": "8b8b9d6e-4574-466b-b2c3-0062ad0642fe", "mainTypeId": "3ac89bbd-0de2-4692-a077-1d5d41efab69" } ] }';
        const transformer = '{ "id": "#valueof($.ontologyElements[?(@.entityType == \'Ontology\')].id)", "description": "#valueof($.ontologyElements[?(@.entityType == \'Ontology\')].description)", "maintypes": { "#loop($.ontologyElements[?(@.entityType == \'MainType\')])" : { "id": "#currentvalueatpath($.id)", "name": "#currentvalueatpath($.name)", "order": "#currentvalueatpath($.order)", "subTypes" : { "#loop($.ontologyElements[?/(@.entityType == \'SubType\' && @.ontologyId == \'8b8b9d6e-4574-466b-b2c3-0062ad0642fe\'/)], insideLoop, root)": { "name": "#currentvalueatpath($.name, insideLoop)" } } } } }';

        var result = new JsonTransformer({ evaluationMode: [ 'strict' ]}).transform(transformer, input);

        expect(result).to.deep.equal({ id: "8b8b9d6e-4574-466b-b2c3-0062ad0642fe", description: "test1", maintypes: [{ id: "3ac89bbd-0de2-4692-a077-1d5d41efab69", name: "MainType1", order: 1, subTypes: [{ name: "SubType1" }] }] });
    });

    it('dynamic expression', () => {
        const input = '{ "ontologyElements": [ { "id": "8b8b9d6e-4574-466b-b2c3-0062ad0642fe", "name": "Ontology1", "description": "test1", "entityType": "Ontology" }, { "id": "3ac89bbd-0de2-4692-a077-1d5d41efab69", "name": "MainType1", "order": 1, "entityType": "MainType", "ontologyId": "8b8b9d6e-4574-466b-b2c3-0062ad0642fe" }, { "id": "97aa4eb2-0515-43d6-ba59-ffd931956b1a", "name": "SubType1", "order": 1, "entityType": "SubType", "ontologyId": "8b8b9d6e-4574-466b-b2c3-0062ad0642fe", "mainTypeId": "3ac89bbd-0de2-4692-a077-1d5d41efab69" } ] }';
        const transformer = '{ "id": "#valueof($.ontologyElements[?(@.entityType == \'Ontology\')].id)", "description": "#valueof($.ontologyElements[?(@.entityType == \'Ontology\')].description)", "maintypes": { "#loop($.ontologyElements[?(@.entityType == \'MainType\')])" : { "id": "#currentvalueatpath($.id)", "name": "#currentvalueatpath($.name)", "order": "#currentvalueatpath($.order)", "subTypes" : { "#loop(#xconcat($.ontologyElements[?/(@.entityType == \'SubType\' && @.ontologyId == \', #currentvalueatpath($.ontologyId),\'/)]), #concat(inside,Loop), #concat(ro, ot))": { "name": "#currentvalueatpath($.name,insideLoop)" } } } } }';

        var result = new JsonTransformer({ evaluationMode: [ 'strict' ]}).transform(transformer, input);

        expect(result).to.deep.equal({ id: "8b8b9d6e-4574-466b-b2c3-0062ad0642fe", description: "test1", maintypes: [{ id: "3ac89bbd-0de2-4692-a077-1d5d41efab69", name: "MainType1", order: 1, subTypes: [{ name: "SubType1" }] }] });
    });

    it('function without alias', () => {
        const input = '{ "NestedLoop": { "Organization": { "Employee": [ { "Name": "E2", "Details": [ { "Country": "Iceland", "Age": "30", "Name": "Sven", "Language": "Icelandic", "Roles": [ { "Job": "Janitor", "Salary": 100 }, { "Job": "Security", "Salary": 200 } ] } ] }, { "Name": "E1", "Details": [ { "Country": "Denmark", "Age": "30", "Name": "Svein", "Language": "Danish", "Roles": [ { "Job": "Manager", "Salary": 300 }, { "Job": "Developer", "Salary": 400 } ] } ] } ] } } }';
        const transformer = '{ "result": { "#loop($.NestedLoop.Organization.Employee, employee)": { "Name": "#currentvalueatpath($.Name)"} } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ result: [{ Name: "E2" },{ Name: "E1"}] });
    });
});
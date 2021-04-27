import JsonTransformer from "../../jsonTransformer.js";

context('Readme', () => {
    beforeEach(() => {
    });
  
    it('value of', () => {
        const input = '{ "menu": { "id": { "file": "csv" }, "value": { "Window": "popup" }, "popup": { "menuitem": [ { "value": "New", "onclick": { "action": "CreateNewDoc()" } }, { "value": "Open", "onclick": "OpenDoc()" }, { "value": "Close", "onclick": "CloseDoc()" } ], "submenuitem": "CloseSession()" } } }';
        const transformer = '{"root": {"menu1": "#valueof($.menu.popup.menuitem[?(@.value==\'New\')].onclick)", "menu2": "#valueof($.menu.popup.menuitem[?(@.value==\'Open\')].onclick)"}}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ root: { menu1: { action: "CreateNewDoc()" }, menu2: "OpenDoc()" }});
    });

    it('if condition', () => {
        const input = '{ "menu": { "id" : "github", "repository" : "JUST" } }';
        const transformer = '{ "ifconditiontesttrue": "#ifcondition(#valueof($.menu.id),github,#valueof($.menu.repository),fail)", "ifconditiontestfalse": "#ifcondition(#valueof($.menu.id),xml,#valueof($.menu.repository),fail)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ ifconditiontesttrue: "JUST", ifconditiontestfalse: "fail"});
    });

    it('string math functions', () => {
        //TODO concat is empty array instead of null
        const input = '{ "stringref": "thisisandveryunuasualandlongstring", "numbers": [ 1, 2, 3, 4, 5 ] }';
        const transformer = '{ "stringresult": { "lastindexofand": "#lastindexof(#valueof($.stringref),and)", "firstindexofand": "#firstindexof(#valueof($.stringref),and)", "substring": "#substring(#valueof($.stringref),9,11)", "concat": "#concat(#valueof($.menu.id.file),#valueof($.menu.value.Window))", "length_string": "#length(#valueof($.stringref))", "length_array": "#length(#valueof($.numbers))", "length_path": "#length($.numbers)" }, "mathresult": { "add": "#add(#valueof($.numbers[0]),3)", "subtract": "#subtract(#valueof($.numbers[4]),#valueof($.numbers[0]))", "multiply": "#multiply(2,#valueof($.numbers[2]))", "divide": "#divide(9,3)", "round": "#round(10.005,2)" } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ stringresult: { lastindexofand: 21, firstindexofand: 6, substring: "veryunuasua", concat: null, length_string: 34, length_array: 5, length_path: 5 }, mathresult: { add: 4, subtract: 4, multiply: 6, divide: 3, round: 10.01 }});
    });

    it('operators', () => {
        const input = '{ "d": [ "one", "two", "three" ], "numbers": [ 1, 2, 3, 4, 5 ] }';
        const transformer = '{ "mathresult": { "third_element_equals_3": "#ifcondition(#mathequals(#valueof($.numbers[2]),3),true,yes,no)", "third_element_greaterthan_2": "#ifcondition(#mathgreaterthan(#valueof($.numbers[2]),2),true,yes,no)", "third_element_lessthan_4": "#ifcondition(#mathlessthan(#valueof($.numbers[2]),4),true,yes,no)", "third_element_greaterthanorequals_4": "#ifcondition(#mathgreaterthanorequalto(#valueof($.numbers[2]),4),true,yes,no)", "third_element_lessthanoreuals_2": "#ifcondition(#mathlessthanorequalto(#valueof($.numbers[2]),2),true,yes,no)", "one_stringequals": "#ifcondition(#stringequals(#valueof($.d[0]),one),true,yes,no)", "one_stringcontains": "#ifcondition(#stringcontains(#valueof($.d[0]),n),true,yes,no)" } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ mathresult: { third_element_equals_3: "yes", third_element_greaterthan_2: "yes", third_element_lessthan_4: "yes", third_element_greaterthanorequals_4: "no", third_element_lessthanoreuals_2: "no", one_stringequals: "yes", one_stringcontains: "yes"}});
    });

    it('aggregate functions', () => {
        const input = '{ "d": [ "one", "two", "three" ], "numbers": [ 1, 2, 3, 4, 5 ] }';
        const transformer = '{ "conacted": "#concatall(#valueof($.d))", "sum": "#sum($.numbers)", "avg": "#average(#valueof($.numbers))", "min": "#min($.numbers)", "max": "#max(#valueof($.numbers))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ conacted: "onetwothree", sum: 15, avg: 3, min: 1, max: 5});
    });

    it('aggregate functions multidimensional arrays', () => {
        const input = '{ "x": [ { "v": { "a": "a1,a2,a3", "b": "1", "c": "10" } }, { "v": { "a": "b1,b2", "b": "2", "c": "20" } }, { "v": { "a": "c1,c2,c3", "b": "3", "c": "30" } } ] }';
        const transformer = '{ "arrayconacted": "#concatallatpath(#valueof($.x),$.v.a)", "arraysum": "#sumatpath(#valueof($.x),$.v.c)", "arrayavg": "#averageatpath(#valueof($.x),$.v.c)", "arraymin": "#minatpath(#valueof($.x),$.v.b)", "arraymax": "#maxatpath(#valueof($.x),$.v.b)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ arrayconacted: "a1,a2,a3b1,b2c1,c2,c3", arraysum: 60, arrayavg: 20, arraymin: 1, arraymax: 3 });
    });

    it('type convertions', () => {
        const input = '{ "booleans": { "affirmative_string": "true", "negative_string": "false", "affirmative_int": 123, "negative_int": 0 }, "strings": { "integer": 123, "decimal": 12.34, "affirmative_boolean": true, "negative_boolean": false }, "integers": { "string": "123", "decimal": 1.23, "affirmative_boolean": true, "negative_boolean": false }, "decimals": { "integer": 123, "string": "1.23" }}';
        const transformer = '{ "booleans": { "affirmative_string": "#toboolean(#valueof($.booleans.affirmative_string))", "negative_string":"#toboolean(#valueof($.booleans.negative_string))", "affirmative_int":"#toboolean(#valueof($.booleans.affirmative_int))", "negative_int": "#toboolean(#valueof($.booleans.negative_int))" }, "strings": { "integer": "#tostring(#valueof($.strings.integer))", "decimal":"#tostring(#valueof($.strings.decimal))", "affirmative_boolean": "#tostring(#valueof($.strings.affirmative_boolean))", "negative_boolean": "#tostring(#valueof($.strings.negative_boolean))" }, "integers": { "string":"#tointeger(#valueof($.integers.string))", "decimal": "#tointeger(#valueof($.integers.decimal))", "affirmative_boolean":"#tointeger(#valueof($.integers.affirmative_boolean))", "negative_boolean":"#tointeger(#valueof($.integers.negative_boolean))" }, "decimals": { "integer":"#todecimal(#valueof($.decimals.integer))", "string": "#todecimal(#valueof($.decimals.string))" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ booleans: { affirmative_string: true, negative_string: false, affirmative_int: true, negative_int: false }, strings: { integer: "123", decimal: "12.34", affirmative_boolean: "true", negative_boolean: "false" }, integers: { string: 123, decimal: 1, affirmative_boolean: 1, negative_boolean: 0 }, decimals: { integer: 123.0, string: 1.23 }});
    });

    it('bulk functions', () => {
        const input = '{ "tree": { "branch": { "leaf": "green", "flower": "red", "bird": "crow", "extra": { "twig":"birdnest" } }, "ladder": {"wood": "treehouse" } } }';
        const transformer = '{ "#": [ "#copy($)", "#delete($.tree.branch.bird)", "#replace($.tree.branch.extra,#valueof($.tree.ladder))" ], "othervalue" : "othervalue" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ othervalue: "othervalue", tree: { branch: { leaf: "green", flower: "red", extra: { wood: "treehouse" }}, ladder: { wood: "treehouse" }}});
    });

    it('array looping', () => {
        const input = '{ "tree": { "branch": { "leaf": "green", "flower": "red", "bird": "crow", "extra": { "twig": "birdnest" } }, "ladder": { "wood": "treehouse" } }, "numbers": [ 1, 2, 3, 4 ], "arrayobjects": [ {"country": {"name": "norway","language": "norsk"}}, { "country": { "name": "UK", "language": "english" } }, { "country": { "name": "Sweden", "language": "swedish" } }], "animals": { "cat": { "legs": 4, "sound": "meow" }, "dog": { "legs": 4, "sound": "woof" }, "human": { "number_of_legs": 2, "sound": "@!#$?" } }, "spell_numbers": { "t_3": "three", "t_2": "two", "o_1": "one" } }';
        const transformer = '{ "iteration": { "#loop($.numbers)": { "CurrentValue": "#currentvalue()", "CurrentIndex": "#currentindex()", "IsLast": "#ifcondition(#currentindex(),#lastindex(),yes,no)", "LastValue": "#lastvalue()" } }, "iteration2": { "#loop($.arrayobjects)": { "CurrentValue": "#currentvalueatpath($.country.name)", "CurrentIndex": "#currentindex()", "IsLast": "#ifcondition(#currentindex(),#lastindex(),yes,no)", "LastValue": "#lastvalueatpath($.country.language)" } }, "sounds": { "#loop($.animals)": { "#eval(#currentproperty())": "#currentvalueatpath($..sound)" } }, "number_index": { "#loop($.spell_numbers)": { "#eval(#currentindex())": "#currentvalueatpath(#concat($.,#currentproperty()))" } }, "othervalue": "othervalue" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ iteration: [{ CurrentValue: 1, CurrentIndex: 0, IsLast: "no", LastValue: 4 },{ CurrentValue: 2, CurrentIndex: 1, IsLast: "no", LastValue: 4 },{ CurrentValue: 3, CurrentIndex: 2, IsLast :"no", LastValue: 4 },{ CurrentValue: 4, CurrentIndex: 3, IsLast: "yes", LastValue: 4 }], iteration2: [{ CurrentValue: "norway", CurrentIndex: 0, IsLast: "no", LastValue: "swedish" },{ CurrentValue: "UK", CurrentIndex: 1, IsLast: "no", LastValue: "swedish" },{ CurrentValue: "Sweden", CurrentIndex: 2, IsLast: "yes", LastValue: "swedish" }], sounds: { cat: "meow", dog: "woof", human: "@!#$?" }, number_index: { 0: "three", 1: "two", 2: "one" }, othervalue: "othervalue" });
    });

    it('nested array looping', () => {
        //TODO object instead of array on Country
        const input = '{ "NestedLoop": { "Organization": { "Employee": [ { "Name": "E2", "Surname": "S2", "Details": [ { "Countries": [ { "Name": "Iceland", "Language": "Icelandic" } ], "Age": 30 } ] }, { "Name": "E1", "Surname": "S1", "Details": [ { "Countries": [{ "Name": "Denmark", "Language": "Danish" }, { "Name": "Greenland", "Language": "Danish" } ], "Age": 31 } ] } ] } } }';
        const transformer = '{ "hello": { "#loop($.NestedLoop.Organization.Employee, employees)": { "CurrentName": "#currentvalueatpath($.Name, employees)", "Details": { "#loop($.Details)": { "Surname": "#currentvalueatpath($.Surname, employees)", "Age": "#currentvalueatpath($.Age)", "Country": { "#loop($.Countries[0], countries)": "#currentvalueatpath($.Name, countries)" } } } } } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ hello: [{ CurrentName: "E2", Details: [{ Surname: "S2", Age: 30, Country: [ "Iceland" ]} ]},{ CurrentName: "E1", Details: [{ Surname: "S1", Age: 31, Country: [ "Denmark" ]} ]} ]});
    });

    it('array grouping', () => {
        const input = '{ "Forest": [ { "type": "Mammal", "qty": 1, "name": "Hippo" }, { "type": "Bird", "qty": 2, "name": "Sparrow" }, { "type": "Amphibian", "qty": 300, "name": "Lizard" }, { "type": "Bird", "qty": 3, "name": "Parrot" }, { "type": "Mammal", "qty": 1, "name": "Elephant" }, { "type": "Mammal", "qty": 10, "name": "Dog" } ] }';
        const transformer = '{ "Result": "#grouparrayby($.Forest,type,all)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ Result: [{ type: "Mammal", all: [{ qty: 1, name: "Hippo" },{ qty: 1, name: "Elephant" },{ qty: 10, name: "Dog" } ]},{ type: "Bird", all: [{ qty: 2, name: "Sparrow" },{ qty: 3, name: "Parrot" } ]},{ type: "Amphibian", all: [{ qty: 300, name: "Lizard" } ]} ]});
    });

    it('complex nested functions', () => {
        const input = '{ "Name": "Kari", "Surname": "Nordmann", "MiddleName": "Inger", "ContactInformation": "Karl johans gate:Oslo:88880000" , "PersonalInformation": "45:Married:Norwegian" }';
        const transformer = '{ "FullName": "#concat(#concat(#concat(#valueof($.Name), ),#concat(#valueof($.MiddleName), )),#valueof($.Surname))",	"Contact Information": { "Street Name": "#substring(#valueof($.ContactInformation),0,#firstindexof(#valueof($.ContactInformation),:))", "City": "#substring(#valueof($.ContactInformation),#add(#firstindexof(#valueof($.ContactInformation),:),1),#subtract(#subtract(#lastindexof(#valueof($.ContactInformation),:),#firstindexof(#valueof($.ContactInformation),:)),1))", "PhoneNumber": "#substring(#valueof($.ContactInformation),#add(#lastindexof(#valueof($.ContactInformation),:),1),#subtract(#lastindexof(#valueof($.ContactInformation),),#lastindexof(#valueof($.ContactInformation),:)))" }, "Personal Information": { "Age": "#substring(#valueof($.PersonalInformation),0,#firstindexof(#valueof($.PersonalInformation),:))", "Civil Status": "#substring(#valueof($.PersonalInformation),#add(#firstindexof(#valueof($.PersonalInformation),:),1),#subtract(#subtract(#lastindexof(#valueof($.PersonalInformation),:),#firstindexof(#valueof($.PersonalInformation),:)),1))", "Ethnicity": "#substring(#valueof($.PersonalInformation),#add(#lastindexof(#valueof($.PersonalInformation),:),1),#subtract(#lastindexof(#valueof($.PersonalInformation),),#lastindexof(#valueof($.PersonalInformation),:)))" }}';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ FullName: "Kari Inger Nordmann", "Contact Information": { "Street Name": "Karl johans gate", City: "Oslo", PhoneNumber: "88880000" }, "Personal Information":{ Age: "45", "Civil Status": "Married", Ethnicity: "Norwegian" }});
    });

    it('multiple argument constant functions', () => {
        const input = '{ "Name": "Kari", "Surname": "Nordmann", "MiddleName": "Inger", "ContactInformation": "Karl johans gate:Oslo:88880000" , "PersonalInformation": "45:Married:Norwegian","AgeOfMother": 67,"AgeOfFather": 70 }';
        const transformer = '{ "FullName": "#xconcat(#valueof($.Name),#constant_comma(),#valueof($.MiddleName),#constant_comma(),#valueof($.Surname))", "AgeOfParents": "#xadd(#valueof($.AgeOfMother),#valueof($.AgeOfFather))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ FullName: "Kari,Inger,Nordmann", AgeOfParents: 137 });
    });

    it('check for existance', () => {
        const input = '{ "BuyDate": "2017-04-10T11:36:39+03:00", "ExpireDate": "" }';
        const transformer = '{ "BuyDateString": "#ifcondition(#exists($.BuyDate),true,#concat(Buy Date : ,#valueof($.BuyDate)),NotExists)", "BuyDateString2": "#ifcondition(#existsandnotempty($.BuyDate),true,#concat(Buy Date : ,#valueof($.BuyDate)),EmptyOrNotExists)", "ExpireDateString": "#ifcondition(#exists($.ExpireDate),true,#concat(Expire Date : ,#valueof($.ExpireDate)),NotExists)", "ExpireDateString2": "#ifcondition(#existsandnotempty($.ExpireDate),true,#concat(Expire Date : ,#valueof($.ExpireDate)),EmptyOrNotExists)", "SellDateString": "#ifcondition(#exists($.SellDate),true,#concat(Sell Date : ,#valueof($.SellDate)),NotExists)", "SellDateString2": "#ifcondition(#existsandnotempty($.SellDate),true,#concat(Sell Date : ,#valueof($.SellDate)),EmptyOrNotExists)" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ BuyDateString: "Buy Date : 2017-04-10T11:36:39+03:00", BuyDateString2: "Buy Date : 2017-04-10T11:36:39+03:00", ExpireDateString: "Expire Date : ", ExpireDateString2: "EmptyOrNotExists", SellDateString: "NotExists", SellDateString2: "EmptyOrNotExists" });
    });

    it('conditional transformation', () => {
        const input = '{ "Tree": { "Branch": "leaf", "Flower": "Rose" } }';
        let transformer = '{ "Result": { "Header": "JsonTransform", "#ifgroup(#exists($.Tree.Branch))": { "State": { "Value1": "#valueof($.Tree.Branch)", "Value2": "#valueof($.Tree.Flower)" } } } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ Result: { Header: "JsonTransform", State: { Value1: "leaf", Value2: "Rose" } } });

        transformer = '{ "Result": { "Header": "JsonTransform", "#ifgroup(#exists($.Tree.Root))": { "State": { "Value1": "#valueof($.Tree.Branch)", "Value2": "#valueof($.Tree.Flower)" } } } }';
        
        result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ Result: { Header: "JsonTransform" } });
    });

    it('dynamic properties', () => {
        const input = '{ "Tree": { "Branch": "leaf", "Flower": "Rose" } }';
        const transformer = '{ "Result": { "#eval(#valueof($.Tree.Flower))": "x" } }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ Result: { Rose: "x" } });
    });

    it('apply over', () => {
        const input = '{"d": [ "one", "two", "three" ], "values": [ "z", "c", "n" ]}';
        const transformer = '{ "result": "#applyover({ \\"condition\\": { \\"#loop($.values)\\": { \\"test\\": \\"#ifcondition(#stringcontains(#valueof($.d[0]),#currentvalue()),true,yes,no)\\" } } },#exists($.condition[?(@.test==\'yes\')]))" }';

        var result = new JsonTransformer({ evaluationMode: [ 'strict' ] }).transform(transformer, input);

        expect(result).to.deep.equal({ result: true });
    });

    it('escape', () => {
        const input = '{ "arg": "some_value" }';
        const transformer = '{ "sharp": "/#not_a_function", "parentheses": "#xconcat(func/(\',#valueof($.arg),\'/))", "comma": "#xconcat(func/(\',#valueof($.arg),\'/,\'other_value\'/))" }';

        var result = new JsonTransformer({ evaluationMode: [ 'strict' ] }).transform(transformer, input);

        expect(result).to.deep.equal({ sharp: "#not_a_function", parentheses: "func('some_value')", comma: "func('some_value','other_value')" });
    });

    it('array concatenation', () => {
        const input = '{ "drugs": [{ "code": "001", "display": "Drug1" },{ "code": "002", "display": "Drug2" }],"pa": [{ "code": "pa1", "display": "PA1" },{ "code": "pa2", "display": "PA2" }], "sa": [{ "code": "sa1", "display": "SA1" },{ "code": "sa2", "display": "SA2" }]}';
        const transformer = '{ "concat": "#concat(#valueof($.drugs), #valueof($.pa))", "multipleConcat": "#concat(#concat(#valueof($.drugs), #valueof($.pa)), #valueof($.sa))", "xconcat": "#xconcat(#valueof($.drugs), #valueof($.pa), #valueof($.sa))" }';

        var result = new JsonTransformer({ evaluationMode: [ 'strict' ] }).transform(transformer, input);

        expect(result).to.deep.equal({ concat: [{ code: "001", display: "Drug1" },{ code: "002", display: "Drug2" },{ code: "pa1", display: "PA1" },{ code: "pa2", display: "PA2" }], multipleConcat :[{ code: "001", display: "Drug1" },{ code: "002", display: "Drug2"},{ code: "pa1", display: "PA1" },{ code: "pa2", display: "PA2" },{ code: "sa1", display: "SA1" },{ code: "sa2", display: "SA2" }], xconcat: [{ code: "001", display: "Drug1" },{ code: "002", display: "Drug2" },{ code: "pa1", display: "PA1" },{ code: "pa2", display: "PA2" },{ code: "sa1", display: "SA1" },{ code: "sa2", display: "SA2" } ]});
    });
});
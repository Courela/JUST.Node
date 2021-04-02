import JsonTransformer from "../../jsonTransformer.js";

context('XFunctions', () => {
    beforeEach(() => {
    });

    it('xconcat', () => {
        const input = '{ "Name": "Kari", "Surname": "Nordmann", "MiddleName": "Inger", "ContactInformation": "Karl johans gate:Oslo:88880000" , "PersonalInformation": "45:Married:Norwegian", "AgeOfMother": 67, "AgeOfFather": 70 }';
        const transformer = '{ "FullName": "#xconcat(#valueof($.Name),#constant_comma(),#valueof($.MiddleName),#constant_comma(),#valueof($.Surname))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ "FullName":"Kari,Inger,Nordmann" });
    });

    it('xadd', () => {
        const input = '{ "Name": "Kari", "Surname": "Nordmann", "MiddleName": "Inger", "ContactInformation": "Karl johans gate:Oslo:88880000" , "PersonalInformation": "45:Married:Norwegian", "AgeOfMother": 67, "AgeOfFather": 70 }';
        const transformer = '{ "AgeOfParents": "#xadd(#valueof($.AgeOfMother),#valueof($.AgeOfFather))" }';

        var result = new JsonTransformer(null).transform(transformer, input);

        expect(result).to.deep.equal({ AgeOfParents: 137 });
    });
});
import jsonpath from 'jsonpath';
import JsonTransformer from './jsonTransformer.js';
import utilities from './utilities.js';

let rootRelatedFunctions = {
    "valueof": valueof
};

let tokenRelatedFunctions = { 
    "exists": exists,
    "existsandnotempty": existsAndNotEmpty,
    "concatallatpath": concatAllAtPath,
    "sumatpath": sumAtPath,
    "averageatpath": averageAtPath,
    "maxatpath": maxAtPath,
    "minatpath": minAtPath,
    "grouparrayby": groupArrayBy,
    "concatall": concatAll,
    "sum": sum,
    "average": average,
    "max": max,
    "min": min,
    "length": length,
    "loop": loop,
    "applyover": applyOver
};

function calculateJsonpath(obj, path) {
    return jsonpath.query(obj, path);
}

function valueof(obj, path) {
    let result = null;
    let output = calculateJsonpath(obj, path);
    if (/\[[^\d].+\]$/.test(path) || output.length > 1) {
        result = output;
    } else {
        result = output[0];
    }
    return result;
}

function exists(obj, path, el) {
    try {
        obj = calculateAlias(obj, el);
        let result = valueof(obj, path);
        return (!!result && (typeof result === 'string' || (Array.isArray(result) && result.length > 0))) ||
            (!result && (result === null || typeof result === 'string'));
    } catch (ex) {
        return { default: false, msg: ex };
    }
}

function existsAndNotEmpty(obj, path, el) {
    try {
        obj = calculateAlias(obj, el);
        let result = valueof(obj, path);
        return !!result && (typeof result === 'string' || Array.isArray(result)) && result.length > 0;
    } catch (ex) {
        return { default: false, msg: ex };
    }
}

function concatAllAtPath(obj, arr, path) {
    let result = '';
    try {
        arr.forEach(el => {
            result = concatStrings(result, valueof(el, path));
        });
    } catch (ex) {
        result = { default: null, msg: 'Invalid value to concatenate!' };
    }
    return result;
}

function sumAtPath(obj, arr, path) {
    let result = 0;
    try {
        arr.forEach(el => {
            result += parseInt(valueof(el, path));
            if (!isFinite(result)) {
                throw 'Invalid value!';
            }
        });
    } catch (ex) {
        return { default: 0, msg: ex };
    }
    return result;
}

function averageAtPath(obj, arr, path) {
    let result = 0;
    try {
        arr.forEach(el => {
            result += parseInt(valueof(el, path));
            if (!isFinite(result)) {
                throw 'Invalid value!';
            }
        });
    } catch (ex) {
        return { default: 0, msg: ex };
    }
    return result / arr.length;
}

function maxAtPath(obj, arr, path) {
    let result = null;
    try {
        arr.forEach(el => {
            let output = parseInt(valueof(el, path));
            if (!isFinite(output)) {
                throw 'Invalid value!';
            }
            result = result ? Math.max(output, result) : output;
        });
    } catch (ex) {
        return { default: 0, msg: ex }; 
    }
    return result;
}

function minAtPath(obj, arr, path) {
    let result = null;
    try {
        arr.forEach(el => {
            let output = parseInt(valueof(el, path));
            if (!isFinite(output)) {
                throw 'Invalid value!';
            }
            result = result ? Math.min(output, result) : output;
        });
    } catch (ex) {
        return { default: 0, msg: ex }; 
    }
    return result;
}

function groupArrayBy(arr, path, groupingElement, groupedElement) {
    let result = [];
    try {
        if (!groupingElement.includes(":")) {
            result = utilities.groupArray(valueof(arr, path), groupingElement, groupedElement);
        } else {
            let groupingElements = groupingElement.split(':');
            result = utilities.groupArrayMultipleProperties(valueof(arr, path), groupingElements, groupedElement);
        }
    } catch (ex) {
        return { default: [], msg: ex }; 
    }
    return result;
}

function concatAll(obj, pathOrArray) {
    let result = '';
    try {
        if (pathOrArray && typeof pathOrArray === 'string') {
            pathOrArray = valueof(obj, pathOrArray);
        }
        pathOrArray.forEach(el => {
            if (typeof el !== 'string' && !Array.isArray(el)) {
                throw 'Invalid value to concatenate!';
            }
            result += el;
        });
    } catch (ex) {
        return { default: null, msg: ex }; 
    }
    return result;
}

function ensureNumber(n) {
    let result = parseFloat(n);
    if (!isFinite(result)) {
        throw 'Invalid value!'
    }
    return result;
}

function sum(obj, pathOrArray) {
    let result = 0;
    try {
        if (pathOrArray && typeof pathOrArray === 'string') {
            pathOrArray = valueof(obj, pathOrArray);
        }
        pathOrArray.forEach(el => {
            result += ensureNumber(el);
        });
    } catch (ex) {
        return { default: 0, msg: ex }; 
    }
    return result;
}

function average(obj, pathOrArray) {
    let result = 0;
    try {
        if (pathOrArray && typeof pathOrArray === 'string') {
            pathOrArray = valueof(obj, pathOrArray);
        }
        pathOrArray.forEach(el => {
            result += ensureNumber(el);
        });
    } catch (ex) {
        return { default: 0, msg: ex }; 
    }
    return result / pathOrArray.length;
}

function max(obj, pathOrArray) {
    let result = null;
    try {
        if (pathOrArray && typeof pathOrArray === 'string') {
            pathOrArray = valueof(obj, pathOrArray);
        }
        pathOrArray.forEach(el => {
            if (result === null) {
                result = ensureNumber(el);
            } else {
                result = Math.max(result, ensureNumber(el));
            }
        });
    } catch (ex) {
        return { default: 0, msg: ex }; 
    }
    return result;
}

function min(obj, pathOrArray) {
    let result = null;
    try {
        if (pathOrArray && typeof pathOrArray === 'string') {
            pathOrArray = valueof(obj, pathOrArray);
        }
        pathOrArray.forEach(el => {
            if (result === null) {
                result = ensureNumber(el);
            } else {
                result = Math.min(result, ensureNumber(el));
            }
        });
    } catch (ex) {
        return { default: 0, msg: ex }; 
    }
    return result;
}

function length(obj, s) {
    try {
        if (typeof s === "string" && s.startsWith("$")) {
            s = valueof(obj, s);
        }
        if (s.length !== undefined) {
            return s.length;
        }
        return { default: 0, msg: 'Value not enumerable: ' + s.toString() };  
    } catch (ex) {
        return { default: 0, msg: ex }; 
    }
}

function loop(obj, path, alias, loopOverAlias, el) {
    if (!el) {
        if (alias && typeof alias === 'object') {
            el = alias;
            alias = null;
        }
        else if (loopOverAlias && typeof loopOverAlias === 'object') {
            el = loopOverAlias;
            loopOverAlias = null;
        }
    }
    let result = null;
    if (el) {
        result = valueof(calculateAlias(obj, el, loopOverAlias ? loopOverAlias : alias), path);
    } else {
        result = valueof(obj, path);
    }
    return /\[.+\]$/.test(path) && !Array.isArray(result) ? [ result ] : result;
}

function applyOver(input, transformerBefore, transformerAfter) {
    let jsonTransformer = new JsonTransformer();
    let output = jsonTransformer.transform(transformerBefore, input);
    let result = jsonTransformer.parseFunction(transformerAfter, output, {});
    return result;
}

let autonomousFunctions = {
    "concat": concat,
    "substring": substring,
    "firstindexof": firstIndexOf,
    "lastindexof": lastIndexOf,
    "add": add,
    "subtract": subtract,
    "multiply": multiply,
    "divide": divide,
    "constant_comma": constantComma,
    "constant_hash": constantHash,
    "stringequals": stringEquals,
    "stringcontains": stringContains,
    "mathequals": mathEquals,
    "mathgreaterthan": mathGreaterThan,
    "mathlessthan": mathLessThan,
    "mathgreaterthanorequalto": mathGreaterThanOrEqualTo,
    "mathlessthanorequalto": mathLessThanOrEqualTo,
    "tointeger": toInteger,
    "tostring": toStringJust,
    "toboolean": toBoolean,
    "isnumber": isNumber,
    "isboolean": isBoolean,
    "isstring": isString,
    "isarray": isArray,
    "round": round,
    "eval": evalFn
};

function concat(str1, str2) {
    try {
        return concatStrings(str1, str2);
    } catch (ex) {
        return { default: null, msg: 'Invalid value to concatenate!' };
    }
}

function concatStrings(str1, str2) {
    let result = '';
    if (typeof str1 === 'string') { 
        if (typeof str2 === 'string') { 
            result = str1.concat(str2);
        } else if (str2 === null) {
            result = str1;
        } else {
            throw 'Invalid value to concatenate!';
        }
    } else if (str1 === null && typeof str2 === 'string') {
        result = str2;
    } else if (Array.isArray(str1)) {
        if (Array.isArray(str2)) {
            result = str1.concat(str2);
        } else if (str2 === null) {
            result = str1;
        } else {
            throw 'Invalid value to concatenate!';
        }
    } else if (str1 === null && Array.isArray(str2)) {
        result = str2;
    } else if (str1 === null && str2 === null) {
        result = null;
    } else {
        throw 'Invalid value to concatenate!';
    }
    return result;
}

function substring(str, start, len) {
    try {
        let result = str.substr(start, len);
        if (!result) {
            throw 'Not found!';
        }
        return result;
    } catch (err) {
        return { default: null, msg: err };
    }
}

function firstIndexOf(str, find) {
    let result = str.indexOf(find);
    if (result === -1) {
        return { default: result, msg: "'" + find + "' not found in '" + str + "'"};
    }
    return result;
}

function lastIndexOf(str, find) {
    let result = str.lastIndexOf(find);
    if (result === -1) {
        return { default: result, msg: "'" + find + "' not found in '" + str + "'"};
    }
    return result;
}

function add(n1, n2) {
    try {
        let result = Number(n1) + Number(n2);
        if (!isFinite(result)) {
            throw 'Invalid value!';
        }
        return result;
    } catch (ex) {
        return { default: 0, msg: ex }
    }
}

function subtract(n1, n2) {
    try {
        let result = Number(n1) - Number(n2);
        if (!isFinite(result)) {
            throw 'Invalid value!';
        }
        return result;
    } catch (ex) {
        return { default: 0, msg: ex }
    }
}

function multiply(n1, n2) {
    try {
        let result = Number(n1) * Number(n2);
        if (!isFinite(result)) {
            throw 'Invalid value!';
        }
        return result;
    } catch (ex) {
        return { default: 0, msg: ex }
    }
}

function divide(n1, n2) {
    try {
        let result = Number(n1) / Number(n2);
        if (!isFinite(result)) {
            throw 'Invalid value!';
        }
        return result;
    } catch (ex) {
        return { default: 0, msg: ex }
    }
}

function constantComma() {
    return ',';
}

function constantHash() {
    return '#';
}

function stringEquals(str1, str2) {
    return str1 === str2;
}

function stringContains(str, find) {
    return str.includes(find);
}

function mathEquals(n1, n2) {
    try {
        if (!isFinite(n1) || !isFinite(n2)) {
            throw 'Invalid value!';
        }
        return Number(n1) === Number(n2);
    } catch (ex) {
        return { default: false, msg: ex }
    }
}

function mathGreaterThan(n1, n2) {
    try {
        if (!isFinite(n1) || !isFinite(n2)) {
            throw 'Invalid value!';
        }
        return Number(n1) > Number(n2);
    } catch (ex) {
        return { default: false, msg: ex }
    }
}

function mathLessThan(n1 ,n2) {
    try {
        if (!isFinite(n1) || !isFinite(n2)) {
            throw 'Invalid value!';
        }
        return Number(n1) < Number(n2);
    } catch (ex) {
        return { default: false, msg: ex }
    }
}

function mathGreaterThanOrEqualTo(n1, n2) {
    try {
        if (!isFinite(n1) || !isFinite(n2)) {
            throw 'Invalid value!';
        }
        return Number(n1) >= Number(n2);
    } catch (ex) {
        return { default: false, msg: ex }
    }
}

function mathLessThanOrEqualTo(n1, n2) {
    try {
        if (!isFinite(n1) || !isFinite(n2)) {
            throw 'Invalid value!';
        }
        return Number(n1) <= Number(n2);
    } catch (ex) {
        return { default: false, msg: ex }
    }
}

function toInteger(val) {
    let result = null;
    try {
        if (val && val === 'true') {
            result = 1;
        } else if (val && val === 'false') {
            result = 0;
        }
        result = round(Number(result !== null ? result : val), 0);
        if (!isFinite(result)) {
            throw 'Invalid value!'
        }
        return result;
    } catch (ex) {
        return { default: 0, msg: ex }; 
    }
}

function toStringJust(val) {
    return val.toString();
}

function toBoolean(val) {
    let result = false;
    if (val && typeof val === 'string') {
        result = val === 'true';
    } else if (val && typeof val === 'number') {
        result = val !== 0;
    } else {
        return { default: result, msg: 'String was not recognized as a valid Boolean' };
    }
    return result;
}

function round(val, decimalPlaces) {
    try {
        let result = +(Math.round(val + "e+" + decimalPlaces)  + "e-" + decimalPlaces);
        if (!isFinite(result)) {
            throw 'Invalid value!';
        }
        return result;
    } catch (ex) {
        return { default: 0, msg: ex }
    }
}

function evalFn(obj) {
    if (obj === undefined || obj === null) {
        throw 'Invalid value!'
    }
    return obj;
}

function isNumber(obj) {
    return typeof obj === "number"
}

function isBoolean(obj) {
    return typeof obj === "boolean"
}

function isString(obj) {
    return typeof obj === "string"
}

function isArray(obj) {
    return Array.isArray(obj)
}

let decimalPlacesFunctions = {
    "todecimal": toDecimal
};

function toDecimal(v) {
    return parseFloat(v);
}

let conditionalFunctions = {
    'ifgroup': ifGroup
};

function ifGroup(isToInclude, val) {
    if (isToInclude !== true && isToInclude !== false) {
        throw 'Invalid value!';
    }
    return val !== undefined ? (isToInclude ? val : undefined) : isToInclude;
}

let bulkFunctions = {
    "copy": copy,
    "replace": replace,
    "delete": deleteFn
};

function copy(obj, path, str) {
    let result = null;
    if (path === null) {
        throw "Invalid path for #copy: resolved to null!";
    } else if (typeof str === 'string') {
        result = valueof(obj, str);
    } else {
        result = valueof(calculateAlias(obj, str), path);
    }
    return { replaceElement: false, value: result && result.length === 1 ? result[0] : result };
}

function replace(obj, path, newObj) {
    let { navigatedObj, key } = findBulkObject(obj, path);

    navigatedObj[key] = newObj;
    return { replaceElement: true, value: obj };
}

function deleteFn(obj, path) {
    let { navigatedObj, key } = findBulkObject(obj, path);

    delete navigatedObj[key];
    return { replaceElement: true, value: obj };
}

function findBulkObject(obj, path) {
    let navigatedObj = obj;

    let key = null;
    let paths = jsonpath.paths(obj, path);

    paths.forEach(el => {
        el.forEach((e, i) => {
            if (e !== '$') {
                if (i + 1 === el.length) {
                    key = e;
                } else {
                    navigatedObj = navigatedObj[e];
                }
            }
        });
    });
    return { navigatedObj, key };
}

let concatenationFunctions = {
    "xconcat": xConcat,
    "xadd": xAdd
};

function xConcat(args) {
    let result = null;
    try {
        args.forEach(el => result = concatStrings(result, el));
    } catch (ex) {
        return { default: null, msg: ex };
    }
    return result;
}

function xAdd(args) {
    let result = 0;
    args.forEach(el => result = add(result, el));
    return result;
}

let arrayAndElementFunctions = {
    "currentvalue": currentValue,
    "currentindex": currentIndex,
    "lastvalue": lastValue,
    "lastindex": lastIndex,
    "currentproperty": currentProperty,
    "currentvalueatpath": currentValueAtPath,
    "lastvalueatpath": lastValueAtPath
};

function calculateAlias(obj, el, alias) {
    return calculate(obj, el, alias).element;
}

function calculateIndex(obj, el, alias) {
    return calculate(obj, el, alias).index;
}

function calculate(obj, el, alias) {
    let result = { element: obj, index: null };
    if (el) {
        if (alias && el[alias]) {
            result = el[alias];
        } else {
            let keys = Object.keys(el);
            alias = keys[keys.length - 1];
            result = el[alias];
        }
    }
    return result;
}

function currentValue(obj, alias, el) {
    if (!el && alias) {
        el = alias;
        alias = null;
    }
    return calculateAlias(obj, el, alias);
}

function currentIndex(obj, alias, el) {
    if (!el && alias) {
        el = alias;
        alias = null;
    }
    return calculateIndex(obj, el, alias);
}

function lastValue(obj, alias, el) {
    if (Array.isArray(obj)) {
        return obj[obj.length - 1];
    } else {
        return obj[Object.keys(obj).length -1];
    }
}

function lastIndex(obj, alias, el) {
    return obj.length - 1;
}

function currentProperty(obj, alias, el) {
    return Object.keys(obj)[0];
}

function currentValueAtPath(obj, path, alias, el) {
    if (!el && alias) {
        el = alias;
        alias = null;
    }

    let curr = calculateAlias(obj, el, alias);
    if (path === '$') {
        return curr;
    } else if (typeof obj === 'string') {
        return obj;
    }
    return valueof(curr, path);
}

function lastValueAtPath(obj, path, alias, el) {
    el = obj[obj.length - 1];
    if (path === '$') {
        return el;
    }
    return valueof(el, path);
}

function execute(functionName, args, input, customFunctions, isBulk) {
    let result = null;
    
    let output = null;
    if(isBulk) {
        if (Object.keys(bulkFunctions).includes(functionName)) {
            output = bulkFunctions[functionName](input, ...args);
        } else {
            throw 'Invalid function for bulk!';
        }
    } else if (Object.keys(rootRelatedFunctions).includes(functionName)) {
        input = args && args[1] ? args[1].root ? args[1].root.element : args[1] : input;
        output = rootRelatedFunctions[functionName](input, ...args);
    } else if (Object.keys(tokenRelatedFunctions).includes(functionName)) {
        output = tokenRelatedFunctions[functionName](input, ...args);
    } else if (Object.keys(autonomousFunctions).includes(functionName)) {
        output = autonomousFunctions[functionName](...args);
    } else if (Object.keys(conditionalFunctions).includes(functionName)) {
        output = conditionalFunctions[functionName](...args);
    } else if (Object.keys(decimalPlacesFunctions).includes(functionName)) {
        output = decimalPlacesFunctions[functionName](...args);
    } else if (Object.keys(concatenationFunctions).includes(functionName)) {
        if (typeof args[args.length - 1] === 'object' && !Array.isArray(args[args.length - 1])) {
            args.pop();
        }
        output = concatenationFunctions[functionName](args);
    } else if (Object.keys(arrayAndElementFunctions).includes(functionName)) {
        output = arrayAndElementFunctions[functionName](input, ...args);
    } else if (customFunctions && Object.keys(customFunctions).includes(functionName)) {
        output = customFunctions[functionName](input, ...args);
    } else {
        throw 'Invalid function: ' + functionName;
    }

    if (functionName === 'loop') {
        result = { isProperty: false, isLoop: true, alias: typeof args[1] === 'string' ? args[1] : undefined, value: output };
    } else if (functionName === 'eval') {
        result = { isProperty: true, isLoop: false, value: output }
    } else {
        result = { isProperty: false, isLoop: false, value: output };
    }

    return result;
}

export default {
    execute
}
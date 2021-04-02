import jsonpath from 'jsonpath'

let tokenRelatedFunctions = { 
    "valueof": valueof, 
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
    "loop": loop
};

function valueof(obj, path) {
    let result = null;
    if (/\[[^\d].+\]$/.test(path)) {
        result = jsonpath.query(obj, path);
    } else {
        let output = jsonpath.query(obj, path);
        if (output.length === 1) {
            result = output[0];
        } else { 
            result = output;
        }
    }
    return result;
}

function exists(obj, path, el) {
    obj = calculateAlias(obj, el);
    let result = valueof(obj, path);
    return (!!result && (typeof result === 'string' || (Array.isArray(result) && result.length > 0))) ||
        (!result && (result === null || typeof result === 'string'));
}

function existsAndNotEmpty(obj, path, el) {
    obj = calculateAlias(obj, el);
    let result = valueof(obj, path);
    return !!result && (typeof result === 'string' || Array.isArray(result)) && result.length > 0;
}

function concatAllAtPath(obj, arr, path) {
    let result = '';
    if (arr && arr.length > 0) {
        arr.forEach(el => {
            result +=  valueof(el, path);            
        });
        if (!result || typeof result !== 'string') {
            throw 'Invalid value in array to concatenate: ' + result.toString();
        }
    }
    return result;
}

function sumAtPath(obj, arr, path) {
    let result = 0;
    if (arr && arr.length > 0) {
        arr.forEach(el => {
            result += Number(valueof(el, path));
        });
    }
    return result;
}

function averageAtPath(obj, arr, path) {
    let result = 0;
    if (arr && arr.length > 0) {
        arr.forEach(el => {
            result += Number(valueof(el, path));
        });
    }
    return result / arr.length;
}

function maxAtPath(obj, arr, path) {
    let result = null;
    if (arr && arr.length > 0) {
        arr.forEach(el => {
            if (result === null) {
                result = Number(valueof(el, path));
            } else {
                result = Math.max(Number(valueof(el, path)), result);
            }
        });
    }
    return result;
}

function minAtPath(obj, arr, path) {
    let result = null;
    if (arr && arr.length > 0) {
        arr.forEach(el => {
            if (result === null) {
                result = Number(valueof(el, path));
            } else {
                result = Math.min(Number(valueof(el, path)), result);
            }
        });
    }
    return result;
}

function groupArrayBy(arr, groupingElement, groupedElement, path) {
    let result = [];
    if (!groupingElement.contains(":")) {
        //TODO
        result = Utilities.GroupArray(path, arr, groupingElement, groupedElement);
    } else {
        //TODO
        let groupingElements = groupingElement.split(':');
        result = Utilities.GroupArrayMultipleProperties(path, arr, groupingElements, groupedElement);
    }
    return result;
}

function concatAll(obj, pathOrArray) {
    let result = '';
    if (pathOrArray && typeof pathOrArray === 'string') {
        pathOrArray = valueof(obj, pathOrArray);
    }
    pathOrArray.forEach(el => {
        result += el;
    });
    return result;
}

function sum(obj, pathOrArray) {
    let result = 0;
    if (pathOrArray && typeof pathOrArray === 'string') {
        pathOrArray = valueof(obj, pathOrArray);
    }
    pathOrArray.forEach(el => result += el);
    return result;
}

function average(obj, pathOrArray) {
    let result = 0;
    if (pathOrArray && typeof pathOrArray === 'string') {
        pathOrArray = valueof(obj, pathOrArray);
    }
    pathOrArray.forEach(el => result += el);
    return result / pathOrArray.length;
}

function max(obj, pathOrArray) {
    let result = null;
    if (pathOrArray && typeof pathOrArray === 'string') {
        pathOrArray = valueof(obj, pathOrArray);
    }
    result = Math.max(...pathOrArray);
    return result;
}

function min(obj, pathOrArray) {
    let result = null;
    if (pathOrArray && typeof pathOrArray === 'string') {
        pathOrArray = valueof(obj, pathOrArray);
    }
    result = Math.min(...pathOrArray);
    return result;
}

function length() {
    //TODO
    throw 'Not implemented';
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
    if (el) {
        return valueof(calculateAlias(obj, el, loopOverAlias ? loopOverAlias : alias), path);
    } else {
        return valueof(obj, path);
    }
}

let autonomousFunctions = {
    "ifcondition": ifCondition,
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
    "round": round,
    "eval": evalFn
};

function ifCondition(condition, val, trueResult, falseResult) {
    return condition == val ? trueResult : falseResult;
}

function concat(str1, str2) {
    return str1.concat(str2);
}

function substring(str, start, len) {
    return str.substr(start, len);
}

function firstIndexOf(str, find) {
    return str.indexOf(find);
}

function lastIndexOf(str, find) {
    return str.lastIndexOf(find);
}

function add(n1, n2) {
    return Number(n1) + Number(n2);
}

function subtract(n1, n2) {
    return Number(n1) - Number(n2);
}

function multiply(n1, n2) {
    return Number(n1) * Number(n2);
}

function divide(n1, n2) {
    return Number(n1) / Number(n2);
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
    return Number(n1) === Number(n2);
}

function mathGreaterThan(n1, n2) {
    return Number(n1) > Number(n2);
}

function mathLessThan(n1 ,n2) {
    return Number(n1) < Number(n2);
}

function mathGreaterThanOrEqualTo(n1, n2) {
    return Number(n1) >= Number(n2);
}

function mathLessThanOrEqualTo(n1, n2) {
    return Number(n1) <= Number(n2);
}

function toInteger(val) {
    let result = null;
    if (val && val === 'true') {
        result = 1;
    } else if (val && val === 'false') {
        result = 0;
    }
    return round(Number(result ?? val), 0);
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
    }
    return result;
}

function round(val, decimalPlaces) {
    return +(Math.round(val + "e+" + decimalPlaces)  + "e-" + decimalPlaces);
}

function evalFn(obj) {
    return obj;
}

let decimalPlacesFunctions = {
    "todecimal": toDecimal
};

function toDecimal() {
    //TODO
    throw 'Not implemented';
}

let conditionalFunctions = {
    'ifgroup': ifGroup
};

function ifGroup(val) {
    return val;
}

let bulkFunctions = {
    "copy": copy,
    "replace": replace,
    "delete": deleteFn
};

function copy(obj, path, str) {
    let result = null;
    if (typeof str === 'string') {
        result = valueof(obj, str);
    } else {
        result = valueof(calculateAlias(obj, str), path);
    }
    return { replaceElement: false, result: result && result.length === 1 ? result[0] : result };
}

function replace(obj, path, newObj, str) {
    let { navigatedObj, key } = findBulkObject(obj, path);

    navigatedObj[key] = newObj;
    return { replaceElement: true, result: obj };
}

function deleteFn(obj, path, str) {
    let { navigatedObj, key } = findBulkObject(obj, path);

    delete navigatedObj[key];
    return { replaceElement: true, result: obj };
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
    let result = '';
    args.forEach(el => result += el);
    return result;
}

function xAdd() {
    //TODO
    throw 'Not implemented';
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
    let result = obj;
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

    el = calculateAlias(obj, el, alias);
    return obj.indexOf(el);
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

function execute(functionName, args, input) {
    let result = null;
    
    let output = null;
    if (Object.keys(tokenRelatedFunctions).includes(functionName)) {
        output = tokenRelatedFunctions[functionName](input, ...args);
    } else if (Object.keys(autonomousFunctions).includes(functionName)) {
        output = autonomousFunctions[functionName](...args);
    } else if (Object.keys(conditionalFunctions).includes(functionName)) {
        output = conditionalFunctions[functionName](...args);
    } else if (Object.keys(decimalPlacesFunctions).includes(functionName)) {
        output = decimalPlacesFunctions[functionName](...args);
    } else if (Object.keys(bulkFunctions).includes(functionName)) {
        output = bulkFunctions[functionName](input, ...args);
    } else if (Object.keys(concatenationFunctions).includes(functionName)) {
        if (typeof args[args.length - 1] === 'object') {
            args.pop();
        }
        output = concatenationFunctions[functionName](args);
    } else if (Object.keys(arrayAndElementFunctions).includes(functionName)) {
        output = arrayAndElementFunctions[functionName](input, ...args);
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
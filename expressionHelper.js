const funcArgsRegex = new RegExp("^\\s*#(.+?)[(](.*)[)]\\s*$")
const escapeChar = '/';
function tryParseFunctionNameAndArguments(input) {
    if (input && typeof input === "string" && input.length > 0) {
        let match = funcArgsRegex.exec(input);
        if (match && match.length > 0) {
            return { success: true, functionName: match[1], arguments: match[2] };
        }
    }
    return { success: false, functionName: null, arguments: null};
};

function splitArguments(args) {
    if (typeof args === 'string' && args.length > 0) {
        let brackettOpen = false;

        let result = [];
        let index = 0;

        let openBrackettCount = 0;
        let closebrackettCount = 0;
        let isEscapedChar = false;

        for (let i = 0; i < args.length; i++) {
            let currentChar = args[i];
            if (currentChar == escapeChar) {
                isEscapedChar = !isEscapedChar;
                continue;
            }
            if (currentChar == '(') {
                if (!isEscapedChar) { openBrackettCount++; }
                else { isEscapedChar = !isEscapedChar; }
            }
            else if (currentChar == ')') {
                if (!isEscapedChar) { closebrackettCount++; }
                else { isEscapedChar = !isEscapedChar; }
            }

            brackettOpen = openBrackettCount != closebrackettCount;
            if (currentChar == ',' && !brackettOpen) {
                if (!isEscapedChar) {
                    result.push(unescape(index != 0 ?
                        args.substr(index + 1, i - index - 1) :
                        args.substr(index, i)));
                    index = i;
                } else { 
                    isEscapedChar = !isEscapedChar; 
                }
            } else { 
                isEscapedChar = false; 
            }
        }

        result.push(index > 0 ?
            unescape(args.substr(index + 1, args.length - index - 1)) :
            unescape(args));

        return result;
    }
    return [];
};

function unescape(str) {
    return !isFunction(str) ?
        str.replace("\\/([\\/(),])", "$1") :
        str;
}

function isFunction(val) {
    return /^\\s*#/.test(val);
}

function unescapeSharp(val) {
    return val.replace("^(\\s*)\\/(#)", "$1$2");
}

export default {
    tryParseFunctionNameAndArguments,
    splitArguments,
    unescapeSharp,
    escapeChar
};
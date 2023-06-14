function Token(type, value) { this.type=type; this.value=value; }
Token.prototype.precedence = function() { return prec[this.value]; };
Token.prototype.associativity = function() { return assoc[this.value]; };

TokenTypes = {
    literal : 0,
    variable : 1,
    operator : 2,
    function : 3,
    leftParenthesis : 4,
    rightParenthesis : 5,
    argumentSeparator : 6
}

let CharTypes = {
    digit : 0,
    letter : 1,
    operator : 3,
    leftParenthesis : 4,
    rightParenthesis : 5,
    comma : 6
}

let assoc = {
    "^" : "right",
    "*" : "left",
    "/" : "left",
    "+" : "left",
    "-" : "left"
}

let prec = {
    "^" : 4,
    "*" : 3,
    "/" : 3,
    "+" : 2,
    "-" : 2
}

function tokenize(str) {
    let result = [];
    let numberBuffer = [];
    let letterBuffer = [];
    let isSubtraction = false;
    str.replace(/\s+/g, "");
    str = str.split("");
    str.forEach((char, idx) => {
        let type = GetCharType(char);
        switch (type) {
            case CharTypes.digit:
                //add the digit to the number buffer
                numberBuffer.push(char);

                //Compile the letter buffer into tokens
                if(letterBuffer.length > 0) {
                    letterBuffer.forEach((l, i) => {
                        result.push(new Token(TokenTypes.variable, l));
                        result.push(new Token(TokenTypes.operator, "*"));
                    });
                    letterBuffer = [];
                }
                //A following '-' will be a subtraction
                isSubtraction=true;
                break;
            case CharTypes.letter:
                //add the letter to the letter buffer
                letterBuffer.push(char);
                
                //compile the number buffer into a token
                if(numberBuffer.length > 0) {
                    result.push(new Token(TokenTypes.literal, numberBuffer.join("")));
                    result.push(new Token(TokenTypes.operator, "*"));
                    numberBuffer = [];
                }
                //A following '-' will be a subtraction
                isSubtraction = true;
                break;
        } 
        
        if(isOperator(char)) {
           if(!isSubtraction && char==="-") {
               numberBuffer.push("-");
               return;
           }
            if(numberBuffer.length > 0) {
                result.push(new Token(TokenTypes.literal, numberBuffer.join("")));
                numberBuffer = [];
            } else if (letterBuffer.length > 0) {
                letterBuffer.forEach((l, i) => {
                    if(i > 0) { result.push(new Token(TokenTypes.operator, "*")); }
                    result.push(new Token(TokenTypes.variable, l));
               });
               letterBuffer = [];
            }
            isSubtraction = false;
            result.push(new Token(TokenTypes.operator, char));
       } else if(isLeftParenthesis(char)) {
           if(letterBuffer.length > 0) {
               result.push(new Token(TokenTypes.function, letterBuffer.join("")));
               letterBuffer = [];
           }
           isSubtraction = false;
           result.push(new Token(TokenTypes.leftParenthesis, char));
       } else if(isRightParenthesis(char)) {
            if(numberBuffer.length > 0) {
                result.push(new Token(TokenTypes.literal, numberBuffer.join("")));
                numberBuffer = [];
            } else if (letterBuffer.length > 0) {
                letterBuffer.forEach((l, i) => {
                    if(i > 0) { result.push(new Token(TokenTypes.literal, "*")); }
                    result.push(new Token(TokenTypes.variable, l));
            });
            letterBuffer = [];
            }
            isSubtraction = true;
           result.push(new Token(TokenTypes.rightParenthesis, char));
       } else if(isComma(char)) {
            if(numberBuffer.length > 0) {
                result.push(new Token(TokenTypes.literal, numberBuffer.join("")));
                numberBuffer = [];
            } else if (letterBuffer.length > 0) {
                letterBuffer.forEach((l, i) => {
                    if(i > 0) { result.push(new Token(TokenTypes.operator, "*")); }
                    result.push(new Token(TokenTypes.variable, l));
            });
            letterBuffer = [];
            }
            isSubtraction = false;
           result.push(new Token(TokenTypes.argumentSeparator, char));
       }
    });

    if(numberBuffer.length > 0) {
        result.push(new Token(TokenTypes.literal, numberBuffer.join("")));
        numberBuffer = [];
    } else if (letterBuffer.length > 0) {
        letterBuffer.forEach((l, i) => {
            if(i > 0) { result.push(new Token(TokenTypes.operator, "*")); }
            result.push(new Token(TokenTypes.variable, l));
       });
       letterBuffer = [];
    }
    return result;
}

function isComma(ch) { return (ch === ","); }
function isDigit(ch) { return /\d/.test(ch) || ch === "."; }
function isLetter(ch) { return /[a-z]/i.test(ch); }
function isOperator(ch) { return /\+|-|\*|\/|\^/.test(ch); }
function isLeftParenthesis(ch) { return (ch === "("); }
function isRightParenthesis(ch) { return (ch === ")"); }

function GetCharType(char) {
    if(/\d/.test(char) || char === ".") return CharTypes.digit;
    if(/[a-z]/i.test(char)) return CharTypes.letter;
    if(/\+|-|\*|\/|\^/.test(char)) return CharTypes.operator;
    if(char === "(") return CharTypes.leftParenthesis;
    if(char === ")") return CharTypes.rightParenthesis;
    if (char === ",") return CharTypes.comma;
}


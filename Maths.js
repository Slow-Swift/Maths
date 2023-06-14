   
class Maths {
    static calculateFormula(formula) {
        try {
            let result = eval(formula);
            return result;
        } catch (error) {
            return error;
        }
    }
}

function factorial(a) {
    let val = 1;
    for(let i = 2; i<=a; i++) {
        val *= i;
    }

    return val;
}

function floor(a) {
    return Math.floor(a);
}

function ceil(a) {
    return Math.ceil(a);
}

function round (a) {
    return Math.round(a);
}

function derivative_powerRule(val, variable="x") {
    let coeffiecient = (parseFloat(val) || "") + "";

    if(val.length == coeffiecient.length) return "0";
    if(val.length == coeffiecient.length + 1) return parseFloat(coeffiecient) || 1

    let power = parseFloat(val.substr(coeffiecient.length + 3));
    if(power != 2 && power != 1)
        return power * parseFloat(coeffiecient) + variable + "**" + (power-1);
    
    return power * (parseFloat(coeffiecient)||1) + variable;
}

function derivative(val, variable="x") {
    let derivative = "";
    let sections = val.split("+");
    sections.forEach(section => {
        let parts = section.split("-");
        parts.forEach(part => {
            derivative += derivative_powerRule(part, variable);
            if(parts[parts.length-1]!=parts)
                derivative += "-";
        });
        if(sections[sections.length-1]!=section)
            derivative += "+";
    });
    return derivative;
}
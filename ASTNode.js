class ASTNode {

    constructor(token, ...nodes) {
        this.token = token.value;
        this.nodes = nodes;
        this.type = token.type;
        //operators are considered functions
        this.isFunction = token.type == TokenTypes.function || 
            token.type == TokenTypes.operator;
    }    

    toString(count=1) {
        if(this.nodes.length==0) 
            return this.token;

        count = count || 1;
        count++;

        let result = this.token + "\t=>";
        for(let i=0; i<this.nodes.length; i++) {
            if(i>0) {
                result += "\n" + Array(count).join("\t") + "=>";
            }
            result += this.nodes[i].toString(count);
        }
        return result;
    }

    getVariables() {
        if(!this.isFunction) {
            if(this.type == TokenTypes.variable) return [this.token];
            return [];
        }

        let variables = [];
        this.nodes.forEach((node) => {
            let childVars = node.getVariables();
            childVars.forEach((v) => {if(!variables.includes(v)) variables.push(v);})
        });
        return variables;
    }

    getVariableCount() {
        return this.getVariables().length;
    }

    getMaxDepth() {
        if(this.nodes.length == 0) return 1;

        let max = 1;
        this.nodes.forEach((node) => {
            max = Mathf.max(max, node.getMaxDepth());
        });
        return max;
    }

    calculate(varVals=[]) {
        if(!this.isFunction) {
            if(this.type == TokenTypes.literal) return parseFloat(this.token);
            return varVals[this.token];
        }

        let childResults = [];
        this.nodes.forEach((node) => {childResults.push(node.calculate(varVals));});
        return inbuiltFunctions[this.token](...childResults);
    }
}

inbuiltFunctions = {
    '+' : (a,b) => {return a + b},
    '-' : (a,b) => {return a - b},
    '*' : (a,b) => {return a * b},
    '/' : (a,b) => {return a / b},
    '^' : (a,b) => {return a ** b},
    sin : Math.sin,
    cos : Math.cos,
    tan : Math.tan,
    ln : Math.log,
    log : Math.log10,
    sqrt : Math.sqrt,
    nrt : (val, n) => { return Math.pow(val, 1/n); },
}
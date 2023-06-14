//Add a peek method to Array.
Array.prototype.peek = function() { return this.slice(-1)[0];}
//Add a method to add a node to an Array
Array.prototype.addNode = function(operatorToken, childNodeCount=2) { 
    let childNodes = [];
    for(let i=0; i<childNodeCount; i++) {
        childNodes.unshift(this.pop());
    }
    this.push(new ASTNode(operatorToken, ...childNodes));
}

/*function ASTNode(token, ...nodes) {
    this.token = token.value;
    this.nodes = nodes;
}

ASTNode.prototype.toString = function(count=1) {
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
    return this.token + "\t=>" + this.leftChildNode.toString(count) +
        "\n" + Array(count).join("\t") + "=>" + this.rightChildNode.toString(count);
}

ASTNode.prototype.calculate = function() {
    if(this.nodes.length==0) return parseFloat(this.token);

    switch(this.token) {
        case "+":
            return this.nodes[0].calculate() + this.nodes[1].calculate();
        case "-":
            return this.nodes[0].calculate() - this.nodes[1].calculate();
        case "*":
            return this.nodes[0].calculate() * this.nodes[1].calculate();
        case "/":
            return this.nodes[0].calculate() / this.nodes[1].calculate();
        case "^":
            return this.nodes[0].calculate() ** this.nodes[1].calculate();
        case "sin":
            return Math.sin(this.nodes[0].calculate());
        case "cos":
            return Math.cos(this.nodes[0].calculate());
    }
}*/

function parse(input) {
    let outStack = [];
    let opStack = [];
    let functionArgumentCounts = [];
    let tokens = tokenize(input);
    tokens.forEach(function(token) {
        switch(token.type) {
            case TokenTypes.literal:
            case TokenTypes.variable:
                if(token.value == "-") token.value = "-1";
                outStack.push(new ASTNode(token));
                break;
            case TokenTypes.function:
                opStack.push(token);
                functionArgumentCounts.push(0);
                break;
            case TokenTypes.argumentSeparator:
                while(opStack.peek().type != TokenTypes.leftParenthesis) {
                    outStack.addNode(opStack.pop())
                }
                functionArgumentCounts[functionArgumentCounts.length-1]++;
                break;
            case TokenTypes.operator:
                let o = opStack.peek();
                while(o && o.type == TokenTypes.operator && (
                    (o.associativity() === "left" && token.precedence() <= o.precedence()) ||
                    (o.associativity() === "right" && token.precedence() < o.precedence()))) 
                {
                    outStack.addNode(opStack.pop());
                    o = opStack.peek();
                }
                opStack.push(token);
                break;
            case TokenTypes.leftParenthesis:
                opStack.push(token);
                break;
            case TokenTypes.rightParenthesis:
                while(opStack.peek().type!=TokenTypes.leftParenthesis) {
                    outStack.addNode(opStack.pop());
                }
                opStack.pop();
                if(opStack.peek() && opStack.peek().type == TokenTypes.function) {
                    outStack.addNode(opStack.pop(), functionArgumentCounts.pop()+1);
                }
                break;
        }
    });

    let length = opStack.length;
    for(let i = 0; i<length; i++) {
        outStack.addNode(opStack.pop());
    }
    return outStack.peek();
}
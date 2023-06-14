class SLFunction {

    constructor(rightHandSide, leftHandSide=null) {
        this.rightHandSide = rightHandSide;
        this.leftHandSide = leftHandSide || 
            new ASTNode(new Token(TokenTypes.variable, "y"));
    }
    
    //calculate the function result
    calculate(...params) {}

    /**
     * Get inverse of this function 
     * (only works for built in functions and functions with one variable)
     * @returns {SLFunction} The inverse function or null if the function cannot be inversed.
     */
    inverse() {
        
        return this.solveFor(this.rightHandSide.getVariables[0]);
    }

    //solve for the specified variable
    solveFor(variable) {
        //if it already solved for the variable there is no need to do anything
        if(this.leftHandSide.getMaxDepth() == 1 && 
            this.leftHandSide.token == variable &&
            !this.rightHandSide.getVariables().includes(variable)) return this;
    }

    //Get the zeros of the function
    zeros() {}
}
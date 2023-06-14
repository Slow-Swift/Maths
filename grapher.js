class Grapher {

    constructor(canvas) {
        this.canvas = canvas;
        this.functions = [];
        this.lineWidth = 3;
        this.minX = -5;
        this.maxX = 5;
        this.minY = -5;
        this.maxY = 5;
        this.resolution = 100;
        this.ctx= canvas.getContext('2d');
        this.calculateCanvasConversions();
        this._drawGridDetails();
        canvas.onmousemove = (e) => {this._onMouseDrag(e)};
        canvas.onmousewheel = (e) => {this._onMouseScroll(e)};
    }

    /**
     * Add a function to the list of graphed functions
     * @param {ASTNode} f The function to add
     * @param {boolean} graph should the function be graphed right away
     * @returns {boolean} whether the function was succesfully added
     */
    addFunction(f, graph=true) {
        let variables = f.getVariables();
        if(variables.length > 1 || variables[0] != "x") {
            console.log("The function cannot be added: incorrect variables");
            return false;
        }

        this.functions.push(f);

        if(graph)
            this._graphFunction(f);

        return true;
    }

    /**
     * Remove function f from the of graphed functions
     * @param {ASTNode} f the function to remove
     * @returns {boolean} whether the function was succesfully removed
     */
    removeFunction(f) {
        let index = this.functions.indexOf(f);
        if(index < 0) {
            console.log("The function has not been added yet!");
            return false;
        }

        if(f == this.functions.peek())
            this.functions.pop();
        else
            this.functions[index] = this.functions.pop();
        return true;
    }

    calculateCanvasConversions() {
        this.rXToCx = this.canvas.width / (this.maxX - this.minX);
        this.rYToCy = this.canvas.height / (this.maxY - this.minY);
    }

    xToCX(x) {
        return (x - this.minX) * this.rXToCx;
    }

    yToCY(y) {
        return this.canvas.height - ((+y - this.minY) * this.rYToCy);
    }

    /**
     * Graph the function f
     * @param {ASTNode} f The function to graph
     */
    _graphFunction(f) {
        let iToX =  (this.maxX - this.minX) / this.resolution;
        let begunPath = false;
        this.ctx.lineWidth = this.lineWidth;
        for(let i = 0; i <= this.resolution; i++) {
            //convert from i to x
            let x = i * iToX + this.minX;
            let y = f.calculate({x:x});
            let cx = this.xToCX(x);
            let cy = this.yToCY(y);
            this.ctx.lineTo(cx, cy);
            if(!begunPath) {
                this.ctx.beginPath();
                begunPath = true;
            }
        }
        this.ctx.stroke();
    }

    /**
     * Graph all the functions
     */
    graphFunctions() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this._drawGridDetails();

        this.ctx.strokeStyle = "black";
        this.functions.forEach((f) => {
            this._graphFunction(f);
        });
    }

    _drawGridDetails() {
        this.ctx.strokeStyle = "#888";
        this.ctx.lineWidth = this.lineWidth;

        //x-Axis
        this.ctx.beginPath();
        this.ctx.lineTo(0, this.yToCY(0));
        this.ctx.lineTo(this.canvas.width, this.yToCY(0));
        this.ctx.stroke();

        //y-Axis
        this.ctx.beginPath();
        this.ctx.lineTo(this.xToCX(0), 0);
        this.ctx.lineTo(this.xToCX(0), this.canvas.height);
        this.ctx.stroke();

        this.ctx.strokeStyle = "#aaa";
        this.ctx.lineWidth = 1;
        for(let x=Math.floor(this.minX-1); x<this.maxX+1; x++) {
            let cx = this.xToCX(x);
            this.ctx.beginPath();
            this.ctx.lineTo(cx, 0);
            this.ctx.lineTo(cx, this.canvas.height);
            this.ctx.stroke();
        }

        for(let y=Math.floor(this.minY-1); y<this.maxY+1; y++) {
            let cy = this.yToCY(y);
            this.ctx.beginPath();
            this.ctx.lineTo(0, cy);
            this.ctx.lineTo(this.canvas.width, cy);
            this.ctx.stroke();
        }
    }

    _onMouseDrag(eventData) {
        if(eventData.which != 1) return;

        let dx = eventData.movementX;
        let dy = eventData.movementY;
        dx = dx / this.rXToCx;
        dy = dy / this.rYToCy;

        this.minX -= dx;
        this.maxX -= dx;
        this.minY += dy;
        this.maxY += dy;
        this.graphFunctions();
    }

    _onMouseScroll(eventData) {
        let scrollSensitivity = 0.01;
        this.maxX += eventData.wheelDelta * scrollSensitivity;
        this.minX -= eventData.wheelDelta * scrollSensitivity;
        this.maxY += eventData.wheelDelta * scrollSensitivity;
        this.minY -= eventData.wheelDelta * scrollSensitivity;
        this.calculateCanvasConversions();
        this.graphFunctions();
    }
}
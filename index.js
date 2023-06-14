let input;
let varsInputArea;
let result;
let textArea;
let currentFunction;
let ctx;
let canvas;
let grapher;
let functionInputArea;
let functionInputs = [];
let functions = [];

let specialCharacters = {
    "integrand" : String.fromCharCode(8747)
}

function initialize() {
    input = document.getElementById("inputFormula");
    valueInput = document.getElementById("inputValue");
    varsInputArea = document.getElementById("varInputs");
    functionInputArea = document.getElementById("functionInputs");
    result = document.getElementById("result");
    textArea = document.getElementById("textarea");
    canvas = document.getElementById("graphCanvas");
    ctx = canvas.getContext('2d');
    grapher = new Grapher(canvas);
    OnAddFunctionPressed();
}

function OnCalculatePressed() {
    if(currentFunction == null) {
        result.innerText = "No Function Ready";
        return;
    }

    let varInputs = varsInputArea.children;
    let varValues = {};
    for(let i=0; i<varInputs.length; i++) {
        let input = varInputs[i];
        varValues[input.placeholder] = input.value;
    }

    let value = currentFunction.calculate(varValues);
    
    result.innerHTML = "Result: " + value;
}

function OnSubmitPressed() {
    grapher.removeFunction(currentFunction);

    try {
        currentFunction = parse(input.value);
        textArea.innerHTML = currentFunction.toString();

        let vars = currentFunction.getVariables();
        varsInputArea.innerHTML = "";
        for(let i=0; i<vars.length; i++) {
            varsInputArea.innerHTML += '<input type="number" class="valueInput" placeholder="' + vars[i] + '"></input>';
        }
    } catch (error) {
        textArea.innerText = "Error parsing function: " + error;
        currentFunction = null;
        return;
    }

    try {
        grapher.addFunction(currentFunction, false);
        grapher.graphFunctions();
    } catch (error) {
        textArea.innerText = "Graphing Error: " + error;
    }
}

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(currentFunction == null) return;
    let variables = currentFunction.getVariables();
    if(variables.length > 1 || variables[0] != "x") return;
    
    let variable = {'x':0}
    let halfWidth = canvas.width / 2;
    ctx.beginPath();
    for(let x=-halfWidth; x<=halfWidth; x++) {
        variable.x = x;
        let result = currentFunction.calculate(variable);
        //invert the result because canvas (0, 0) is at screen top
        ctx.lineTo(x + halfWidth, -result + halfWidth, 1, 1);
    }
    ctx.closePath();
    ctx.stroke();
}

function formatFormula(formula) {
    let formatted;
    formatted = formula.replace("int", specialCharacters.integrand);
    return formatted;
}

function OnAddFunctionPressed() {
    let bar = document.createElement('div');
    let input = document.createElement('input');
    input.type = 'text';
    input.onchange = onFunctionChanged;
    input.classList.add("functionInput");
    bar.appendChild(input);
    let button = document.createElement('button');
    button.innerHTML = "X";
    button.classList.add('functionDeleteButton');
    button.onclick = onDeleteFunctionPressed;
    bar.appendChild(button);
    bar.classList.add('functionInputBar');
    functionInputArea.appendChild(bar);
    functionInputs.push(input);
    bar.id = functionInputs.length;
}

function onDeleteFunctionPressed(eventData) {
    let id = eventData.target.parentElement.id;
    grapher.removeFunction(functions[id]);
    functionInputArea.removeChild(eventData.target.parentElement);

    try {
        grapher.graphFunctions();
    } catch (error) {
        textArea.innerText = "Graphing Error: " + error;
    }
}

function onFunctionChanged(eventData) {
    let input = eventData.target;
    let id = input.parentElement.id;
    grapher.removeFunction(functions[id]);

    let f;
    try {
        f = parse(input.value);
        functions[id] = f;

        if(f==undefined) return;
    } catch (error) {
        textArea.innerText = "Error parsing function: " + error;
        return;
    }

    if(f.getVariableCount() === 0) {
        result.innerHTML = "Result: " + f.calculate();
        return;
    }

    try {
        grapher.addFunction(f, false);
        grapher.graphFunctions();
    } catch (error) {
        textArea.innerText = "Graphing Error: " + error;
    }
}
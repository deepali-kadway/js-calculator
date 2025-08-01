const inputbox = document.getElementById("inputs");
const expression = document.getElementById("expression");
const output = document.getElementById("result");

// define expression variable to hold the current expression
// define result variable to hold the result of the expression
let expressionValue = "";
let resultValue = "";

// Function to handle button clicks
function handleButtonClick(event){
//Fetch the data-action and data-value attributes from the button. dataset is property that provides access to all custom data attributes on that element.
const target = event.target;
const action = target.dataset.action;
const value = target.dataset.value;

//switch case to handle different actions
switch(action){
    case 'number':
        addValue(value);
        break;
    case 'clear':
        clear();
        break;
    case 'backspace':
        backspace();
        break;
    case 'submit':
        submit();
        break;
    case 'addition':
    case 'subtraction':
    case 'multiplication':
    case 'division':
    case 'modulo':
        if(expressionValue === '' && resultValue !== ''){
            startFromResult(value);
        } else if (expressionValue !== '' && !isLastCharOperator()){
            addValue(value);
        }
        break;
    case 'decimal':
        decimal(value);
        break;
}
//update display
updateDisplay(expressionValue, resultValue);
}


inputbox.addEventListener('click', handleButtonClick);

// Function to add value to expression
function addValue(value) {
    if (value === '.') {
        addDecimal();
        return;
    }
    expressionValue += value;  // append the value to the expression
}

// Function to clear calculator
function clear() {
    expressionValue = "";
    resultValue = "";
}


// Function to handle backspace
function backspace() {
    if (expressionValue !== "") {
        expressionValue = expressionValue.slice(0, -1);
    }
    if (resultValue !== "") {
        resultValue = "";
    }
}

// Function to handle equals/submit
function submit() {
    //case 1: if there is no expression to calculate but there is a result, do nothing
    if (expressionValue === "" && resultValue !== "") return;
    
    //case 2: if there is an expression to calculate
    if (expressionValue !== "") {
        try {
            // Replacing display symbols with eval-compatible operators
            let evalExpression = expressionValue.replace(/x/g, '*').replace(/÷/g, '/');
            // performs actual mathematical calculation. Eg: eval("5*2") returns 10
            resultValue = eval(evalExpression);
            
            // Check for result if it is infinite or NaN
            if (!isFinite(resultValue)) {
                resultValue = "Error";
                return;
            }
            // clear the expression so the result shows alone
            expressionValue = "";
        } catch (error) {
            resultValue = "Error";
            expressionValue = "";
        }
    }
}

// Function to handle decimal point
function decimal(value) {
    // split the expression by operators to find individual numbers. eg: "5+3.1" -> ["5", "3.1"]
    const parts = expressionValue.split(/[+\-*/]/);
    const lastPart = parts[parts.length - 1];
    
    if (!lastPart.includes('.')) {
        if (lastPart === '' || isLastCharOperator()) {
            addValue('0.');
        } else {
            addValue('.');
        }
    }
}

// Helper function to add decimal
function addDecimal() {
    const parts = expressionValue.split(/[+\-*/]/);
    const lastPart = parts[parts.length - 1];
    
    if (!lastPart.includes('.')) {
        if (lastPart === '' || isLastCharOperator()) {
            expressionValue += '0.';
        } else {
            expressionValue += '.';
        }
    }
}

// Function to start calculation from previous result
function startFromResult(operator) {
    if (resultValue !== "") {
        expressionValue = resultValue + operator;
        resultValue = "";
    }
}

// Helper function to check if last character is an operator
function isLastCharOperator() {
    const lastChar = expressionValue.charAt(expressionValue.length - 1);
    return ['+', '-', '*', '/', 'x', '÷', '%'].includes(lastChar);
}

// Function to update display
function updateDisplay(expressionVal, resultVal) {
    expression.textContent = expressionVal || "";
    output.textContent = (resultVal !== null && resultVal !== undefined) ? resultVal.toString() : "";
}

// Initialize display
updateDisplay(expressionValue, resultValue);
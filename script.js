const expressionElement = document.getElementById('expression');
const resultElement = document.getElementById('result');

const operators = ['+', '−', '×', '÷'];

let expression = '';

// ==========================
// UPDATE DISPLAY
// ==========================

function updateDisplay() {

  expressionElement.textContent = expression || '0';

}

// ==========================
// NORMALIZE OPERATORS
// ==========================

function normalizeExpression(value) {

  return value
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-');

}

// ==========================
// APPEND NUMBER
// ==========================

function appendNumber(number) {

  if (expression === '0') {

    expression = number;

  }

  else {

    expression += number;

  }

  updateDisplay();

}

// ==========================
// APPEND OPERATOR
// ==========================

function appendOperator(operator) {

  if (!expression) return;

  const lastChar = expression.slice(-1);

  // Replace operator if already exists
  if (operators.includes(lastChar)) {

    expression =
      expression.slice(0, -1) + operator;

  }

  else {

    expression += operator;

  }

  updateDisplay();

}

// ==========================
// DECIMAL
// ==========================

function appendDecimal() {

  const tokens =
    expression.split(/([+−×÷])/);

  const currentToken =
    tokens[tokens.length - 1];

  if (!currentToken.includes('.')) {

    if (
      expression === '' ||
      operators.includes(expression.slice(-1))
    ) {

      expression += '0.';

    }

    else {

      expression += '.';

    }

  }

  updateDisplay();

}

// ==========================
// CLEAR
// ==========================

function clearAll() {

  expression = '';

  resultElement.textContent = '0';

  updateDisplay();

}

// ==========================
// PERCENT
// ==========================

function applyPercent() {

  if (!expression) return;

  expression += '%';

  updateDisplay();

}

// ==========================
// TOGGLE SIGN
// ==========================

function toggleSign() {

  if (!expression) return;

  if (expression.startsWith('-')) {

    expression = expression.slice(1);

  }

  else {

    expression = '-' + expression;

  }

  updateDisplay();

}

// ==========================
// CALCULATE
// ==========================

function calculate() {

  let exp = expression;

  // Handle percentages
  // Example:
  // 100−10% = 90
  // 200+10% = 220

  exp = exp.replace(

    /(\d+)([+\−×÷])(\d+)%/g,

    (match, num1, op, num2) => {

      let percentage =
        (parseFloat(num1) * parseFloat(num2)) / 100;

      // Convert symbols
      if (op === '×') op = '*';
      if (op === '÷') op = '/';
      if (op === '−') op = '-';

      return `${num1}${op}${percentage}`;

    }

  );

  // Normalize operators
  exp = normalizeExpression(exp);

  try {

    let result = eval(exp);

    resultElement.textContent = result;

  }

  catch {

    resultElement.textContent = 'Error';

  }

}

// ==========================
// BUTTON EVENTS
// ==========================

function bindEvents() {

  // Number buttons
  document.querySelectorAll('[data-num]')
    .forEach((button) => {

      button.addEventListener('click', () => {

        appendNumber(button.dataset.num);

      });

    });

  // Operator buttons
  document.querySelectorAll('[data-op]')
    .forEach((button) => {

      button.addEventListener('click', () => {

        appendOperator(button.dataset.op);

      });

    });

  // Decimal
  document
    .querySelector('[data-action="decimal"]')
    .addEventListener('click', appendDecimal);

  // Clear
  document
    .querySelector('[data-action="clear"]')
    .addEventListener('click', clearAll);

  // Percent
  document
    .querySelector('[data-action="percent"]')
    .addEventListener('click', applyPercent);

  // Toggle sign
  document
    .querySelector('[data-action="sign"]')
    .addEventListener('click', toggleSign);

  // Equals
  document
    .querySelector('[data-action="equals"]')
    .addEventListener('click', calculate);

}

// ==========================
// KEYBOARD SUPPORT
// ==========================

document.addEventListener('keydown', (e) => {

  // Numbers
  if (e.key >= '0' && e.key <= '9') {

    appendNumber(e.key);

  }

  // Operators
  else if (e.key === '+') {

    appendOperator('+');

  }

  else if (e.key === '-') {

    appendOperator('−');

  }

  else if (e.key === '*') {

    appendOperator('×');

  }

  else if (e.key === '/') {

    appendOperator('÷');

  }

  // Decimal
  else if (e.key === '.') {

    appendDecimal();

  }

  // Enter
  else if (e.key === 'Enter') {

    calculate();

  }

  // Escape
  else if (e.key === 'Escape') {

    clearAll();

  }

});

// ==========================
// START APP
// ==========================

window.addEventListener('DOMContentLoaded', () => {

  bindEvents();

  updateDisplay();

});
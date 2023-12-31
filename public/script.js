class Sprite {
    constructor(name) {
        this.name = name;
        this.x = 0;
        this.y = 0;
        this.direction = 0;
        this.color = 0;
        this.width = 50;
        this.height = 50;
        this.velocity = { x: 0, y: 0 }; // Define velocity with initial values
    }
    
    draw(context) {
        context.fillStyle = this.color; // Use the sprite's color
        context.fillRect(this.x, this.y, this.width, this.height);
    }


    moveToTarget(target) {
        // Simple logic to move towards the target sprite
        var deltaX = target.x - this.x;
        var deltaY = target.y - this.y;
        
        // Calculate the angle towards the target
        var angle = Math.atan2(deltaY, deltaX);
    
        // Set a speed for movement
        var speed = 1; // You can adjust this value based on your game's needs
    
        // Update the sprite's velocity
        this.velocity.x = Math.cos(angle) * speed;
        this.velocity.y = Math.sin(angle) * speed;
    }
    
    updatePosition() {
        // Update the sprite's position based on its velocity
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
tag(target) 
// Check if this sprite is close enough to tag the target
const distance = Math.sqrt(Math.pow(this.x - target.x, 2) + Math.pow(this.y - target.y, 2));
if (distance < 10) { // Assuming a tagging distance of 10 units
    this.isIt = false;
    target.isIt = true;
}
class Game {
    constructor() {
        this.env = new Environment();
        this.context = this.setupCanvas();
        this.userCodeCommands = []; // Placeholder for user commands
    }

    setupCanvas() {
        let canvas = document.getElementById('gameCanvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'gameCanvas';
            canvas.width = 800; // Set canvas width
            canvas.height = 600; // Set canvas height
            document.body.appendChild(canvas);
        }
        return canvas.getContext('2d');
    }

    updateGameState() {
        for (let command of this.userCodeCommands) {
            switch (command.type) {
                case 'moveSprite':
                    this.moveSprite(command.sprite, command.direction, command.distance);
                    break;
                case 'changeSpriteColor':
                    this.changeSpriteColor(command.sprite, command.color);
                    break;
                case 'ifCondition':
                    if (evaluateCondition(command.condition)) {
                        executeCommands(command.commands);
                   }
                case 'repeatLoop':
                    for (let i = 0; i < command.count; i++) {
                        executeCommands(command.commands);
                    }
                    break;
                case 'rotateSprite':
                    this.rotateSprite(command.sprite, command.angle);
                    break;
                case 'scaleSprite':
                    this.scaleSprite(command.sprite, command.scaleFactor);
                    break;
            }
        }
    }

    moveSprite(spriteName, direction, distance) {
        const sprite = this.env.getSpriteByName(spriteName);
        if (!sprite) return;

        const radians = direction * (Math.PI / 180);
        sprite.x += Math.cos(radians) * distance;
        sprite.y += Math.sin(radians) * distance;
    }

    changeSpriteColor(spriteName, color) {
        const sprite = this.env.getSpriteByName(spriteName);
        if (!sprite) return;

        sprite.color = color;
    }

    scaleSprite(spriteName, scaleFactor) {
        const sprite = this.env.getSpriteByName(spriteName);
        if (!sprite) return;

        sprite.width *= scaleFactor;
        sprite.height *= scaleFactor;
    }
}


    startGameLoop() ;{
        const render = () => {
            this.context.clearRect(0, 0, canvas.width, canvas.height);
            this.env.draw(this.context);
            this.updateGameState();
            requestAnimationFrame(render);
        };
        render();
    }

// Usage
const game = new Game();
game.startGameLoop();

function defineFunction(name, func) {
window[name] = func;
}

function repeat(times, func) {
for (let i = 0; i < times; i++) {
func();
}
}

function onKeyPress(key, func) {
document.addEventListener('keydown', event => {
if (event.key === key) {
    func();
}
});
}

function checkCollision(sprite1, sprite2) {
// Simple bounding box collision detection
return sprite1.x < sprite2.x + sprite2.width &&
   sprite1.x + sprite1.width > sprite2.x &&
   sprite1.y < sprite2.y + sprite2.height &&
   sprite1.y + sprite1.height > sprite2.y;
}

function gameLoop() {
context.clearRect(0, 0, canvas.width, canvas.height);

// Update game state
updateGameState();

// Draw sprites
env.sprites.forEach(sprite => sprite.draw(context));

requestAnimationFrame(gameLoop);
}
function onCollision(sprite1, sprite2, func) {
// Call function if collision occurs
if (checkCollision(sprite1, sprite2)) {
func();
}
}


class Environment {
constructor() {
this.sprites = [];
this.nonSpriteObjects = [];
// Initialize environment
}

addSprite(sprite) {
this.sprites.push(sprite);
}

draw(context) {
// Create a linear gradient background
let gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, 'skyblue'); // Start color
gradient.addColorStop(1, 'white'); // End color

context.fillStyle = gradient; // Set the gradient as fill style
context.fillRect(0, 0, canvas.width, canvas.height); // Fill the entire canvas with the gradient
}
}

function setupCanvas() {
let canvas = document.getElementById('gameCanvas');

if (!canvas) {
canvas = document.createElement('canvas');
canvas.id = 'gameCanvas';
canvas.width = 800; // Set canvas width
canvas.height = 600; // Set canvas height
document.body.appendChild(canvas);
}

return canvas.getContext('2d');
}

const context = setupCanvas();
const env0 = new Environment(); // Create an instance of Environment

function render() {
context.clearRect(0, 0, canvas.width, canvas.height);

// Draw the environment (if it has a draw method)
env0.draw(context);

// Draw each sprite
env0.sprites.forEach(sprite => {
if (sprite.draw) { // Ensure the sprite has a draw method
    sprite.draw(context);
}
});

requestAnimationFrame(render);
}

// Call render to start the animation loop
render();

function setupIDE() {
const editor = document.getElementById('code-editor');
const projectNameInput = document.getElementById('project-name');
const runButton = document.getElementById('run-button');
const saveButton = document.getElementById('save-button');
const loadButton = document.getElementById('load-button');
const canvas = document.getElementById('display-area');
const context = canvas.getContext('2d');

runButton.addEventListener('click', () => {
   const code = editor.value;
   const commands = interpret(buildAST(tokenize(parse(code))));
   commands.forEach(executeCommand);
});

loadButton.addEventListener('click', () => {
const projectName = projectNameInput.value || 'defaultProjectName';
loadProject(projectName, (code) => {
    editor.value = code;
});
});
}
function extractBlockStatements(lines, startIndex) {
let statements = [];
let openBraces = 1; // Start after the opening brace
let i;

for (i = startIndex + 1; i < lines.length && openBraces > 0; i++) {
let line = lines[i].trim();
if (line === '{') {
    openBraces++;
} else if (line === '}') {
    openBraces--;
} else if (openBraces > 0) {
    statements.push(line);
}
}

return { statements, nextIndex: i };
}
function parseIfStatement(line, lines, currentIndex) {
const condition = extractCondition(line);
let statements = [];
let elseStatements = [];
let nextIndex = currentIndex + 1;

if (lines[nextIndex] && lines[nextIndex].trim() === '{') {
// Block statement
let blockResult = extractBlockStatements(lines, nextIndex);
statements = blockResult.statements;
nextIndex = blockResult.nextIndex;
} else {
// Single-line statement
statements = [lines[nextIndex].trim()];
nextIndex++;
}

// Check for else
if (lines[nextIndex] && lines[nextIndex].trim().startsWith('else')) {
nextIndex++;
if (lines[nextIndex] && lines[nextIndex].trim() === '{') {
    // Else with block statement
    let blockResult = extractBlockStatements(lines, nextIndex);
    elseStatements = blockResult.statements;
    nextIndex = blockResult.nextIndex;
} else {
    // Single-line else
    elseStatements = [lines[nextIndex].trim()];
    nextIndex++;
}
}

return { ifNode: { type: 'ifStatement', condition, statements, elseStatements }, nextIndex };
}

function parseRepeat(line, lines, currentIndex) {
const count = extractRepeatCount(line);
let { statements, nextIndex } = extractBlockStatements(lines, currentIndex + 1);

return { repeatNode: { type: 'repeat', count, statements }, nextIndex };
}

function extractRepeatCount(line) {
const match = line.match(/\((.*?)\)/);
return match ? parseInt(match[1].trim()) : 0;
}
function parseRepeatUntil(line, lines, currentIndex) {
const condition = extractCondition(line);
let { statements, nextIndex } = extractBlockStatements(lines, currentIndex + 1);

return { repeatUntilNode: { type: 'repeatUntil', condition, statements }, nextIndex };
}
function tokenize(expression) {
    const operators = ['<', '>', '<=', '>=', '==', '!=', 'and', 'or', 'not', 'xor', '(', ')'];
    const tokens = [];
    let currentToken = '';

    for (let char of expression) {
        if (char === ' ' && currentToken) {
            tokens.push(currentToken);
            currentToken = '';
        } else if (operators.includes(currentToken + char) || char === '(' || char === ')') {
            if (currentToken) tokens.push(currentToken);
            currentToken = char === '(' || char === ')' ? '' : char;
            if (char === '(' || char === ')') tokens.push(char);
        } else {
            currentToken += char;
        }
    }
    if (currentToken) tokens.push(currentToken);

    return tokens.filter(token => token.trim());
}

function buildAST(tokens) {
    if (tokens.length === 1) {
        return { type: 'literal', value: tokens[0] };
    }

    const operatorPrecedence = {
        'not': 5,
        'and': 4,
        'or': 3,
        'xor': 3,
        '<': 2, '>': 2, '<=': 2, '>=': 2, '==': 2, '!=': 2
    };

    let minPrecedence = Infinity;
    let operatorIndex = -1;

    // Handle parentheses
    let depth = 0;
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === '(') {
            if (depth === 0) {
                let end = findClosingParenthesis(tokens, i);
                let subExpr = tokens.slice(i + 1, end);
                return buildAST(subExpr);
            }
            depth++;
        } else if (tokens[i] === ')') {
            depth--;
        } else if (depth === 0) {
            const tokenPrecedence = operatorPrecedence[tokens[i]];
            if (tokenPrecedence && tokenPrecedence < minPrecedence) {
                minPrecedence = tokenPrecedence;
                operatorIndex = i;
            }
        }
    }

    if (operatorIndex === -1) {
        throw new Error('Invalid expression');
    }

    return {
        type: tokens[operatorIndex],
        left: buildAST(tokens.slice(0, operatorIndex)),
        right: buildAST(tokens.slice(operatorIndex + 1))
    };
}

function findClosingParenthesis(tokens, startIndex) {
    let depth = 1;
    for (let i = startIndex + 1; i < tokens.length; i++) {
        if (tokens[i] === '(') {
            depth++;
        } else if (tokens[i] === ')') {
            depth--;
            if (depth === 0) {
                return i;
            }
        }
    }
    throw new Error('No matching closing parenthesis');
}



function parse(code) {
    const lines = code.split('\n');
    const ast = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        if (line.startsWith('if')) {
            let { ifNode, nextIndex } = parseIfStatement(line, lines, i);
            ast.push(ifNode);
            i = nextIndex - 1;
        } else if (line.startsWith('touching')) {
                const targetSpriteName = line.substring(line.indexOf('(') + 1, line.indexOf(')')).trim();
                ast.push({ type: 'touching', targetSprite: targetSpriteName });           
        } else if (line.startsWith('during')) {
            let { duringNode, nextIndex } = parseDuringBlock(line, lines, i);
            ast.push(duringNode);
            i = nextIndex;         
        } else if (line.match(/^(<|>|<=|>=|==|!=)/)) {
            ast.push(parseComparison(line));
        } else if (line.match(/^(and|or|not)/)) {
            ast.push(parseLogical(line));
        } else if (line.includes('+')) {
            const parts = line.split('+');
            const left = parseInt(parts[0].trim());
            const right = parseInt(parts[1].split(';')[0].trim());
        } else if (line.startsWith('it?')) {
            ast.push({ type: 'itCheck', spriteName: line.split(' ')[1] });
        } else if (line.startsWith('fastForward')) {
            ast.push({ type: 'fastForward', spriteName: line.split(' ')[1] });
        } else if (line.startsWith('attack')) {
            const parts = line.split(' ');
            ast.push({ type: 'attack', spriteName: parts[1], targetName: parts[2] });
        } else if (line.startsWith('forever')) {
            let { statements, nextIndex } = extractBlockStatements(lines, i);
            ast.push({ type: 'forever', statements });
            i = nextIndex;
        } else if (line.startsWith('repeat ')) {
            let { repeatNode, nextIndex } = parseRepeat(line, lines, i);
            ast.push(repeatNode);
            i = nextIndex;
        } else if (line.startsWith('repeatUntil ')) {
            let { repeatUntilNode, nextIndex } = parseRepeatUntil(line, lines, i);
            ast.push(repeatUntilNode);
            i = nextIndex;
        } else if (line.startsWith('forward')) {
            ast.push({ type: 'forward', spriteName: line.split(' ')[1] });
        } else if (line.startsWith('left')) {
            ast.push({ type: 'left', spriteName: line.split(' ')[1] });
        } else if (line.startsWith('right')) {
            ast.push({ type: 'right', spriteName: line.split(' ')[1] });
        } else if (line.startsWith('backward')) {
            ast.push({ type: 'backward', spriteName: line.split(' ')[1] });
        } else if (line.startsWith('playGameFunctionIt')) {
            ast.push({ type: 'playGameFunctionIt' });
        }
        // Add other conditions as necessary
    }

    return ast;
}

return ast;
function parseDuringBlock(line, lines, currentIndex) {
let { statements, nextIndex } = extractBlockStatements(lines, currentIndex);
return { duringNode: { type: 'during', statements }, nextIndex };
}
function interpret(ast) {
const variables = {};

for (let node of ast) {
switch (node.type) {
    case 'variableAssignment':
        variables[node.variable] = interpretExpression(node.expression, variables);
        break;
    case 'addition':
        return node.left + node.right;
}
}
function interpret(node, context = {}) {
switch (node.type) {
case 'literal':
    return parseInt(node.value);  // Assuming literals are integers
case 'and':
    return interpret(node.left, context) && interpret(node.right, context);
case 'or':
    return interpret(node.left, context) || interpret(node.right, context);
case 'xor':
    return !!(interpret(node.left, context) ^ interpret(node.right, context));
case 'not':
    return !interpret(node.left, context);
case '<':
    return interpret(node.left, context) < interpret(node.right, context);
// ... handle other operators
default:
    throw new Error(`Unknown node type: ${node.type}`);
}
}

return variables;
}
function parseComparison(line) {
const operators = ['<', '>', '<=', '>=', '==', '!='];
let operator = operators.find(op => line.includes(op));
if (!operator) {
throw new Error('Invalid comparison operator');
}

const operands = line.split(operator).map(operand => operand.trim());
return {
type: 'comparison',
operator: operator,
operands: operands
};
}
function parseLogical(line) {
const operators = ['and', 'or', 'not'];
let operator = operators.find(op => line.includes(op));
if (!operator) {
throw new Error('Invalid logical operator');
}

if (operator === 'not') {
const operand = line.split(operator)[1].trim();
return {
    type: 'logical',
    operator: operator,
    operands: [operand]
};
} else {
const operands = line.split(operator).map(operand => operand.trim());
return {
    type: 'logical',
    operator: operator,
    operands: operands
};
}
}
function interpretExpression(expression, variables) {
if (expression.includes('+')) {
const parts = expression.split('+');
return parseInt(variables[parts[0].trim()]) + parseInt(parts[1].trim());
}

return parseInt(expression);
}

function saveProject(name, code) {
fetch('http://86.3.72.80:3306/save', {
method: 'POST',
headers: {
    'Content-Type': 'application/json',
},
body: JSON.stringify({ name, code }),
});
}

function loadProject(name, callback) {
fetch(`http://86.3.72.80:3306/load?name=${name}`)
.then(response => response.json())
.then(data => {
    callback(data.code);
});
}
function forever(statements, delay = 0) {
// Define an inner function to handle recursion
function executeForever() {
statements.forEach(executeCommand);

// Use setTimeout for a delay or requestAnimationFrame for the next repaint
setTimeout(executeForever, delay);
}

// Start the recursive loop
executeForever();
}
function PlayGameFunction() {
// Find the sprite that is 'it'
let itSprite = env.sprites.find(sprite => sprite.isIt);
if (!itSprite) {
// If no sprite is 'it', make the first sprite 'it'
itSprite = env.sprites[0];
itSprite.isIt = true;
}
function fastForward(sprite) {
const speedMultiplier = 2; // Increase speed by this factor
sprite.velocity.x *= speedMultiplier;
sprite.velocity.y *= speedMultiplier;
}


// Each sprite moves and checks for tagging
env.sprites.forEach(sprite => {
if (sprite !== itSprite) {
    sprite.moveToTarget(itSprite);
}
sprite.updatePosition();
if (sprite.isIt) {
    env.sprites.forEach(target => {
        if (target !== sprite) {
            sprite.tag(target);
        }
    });
}
});
}


// Function to execute a single command
function executeCommand(command) {
switch (command.type) {
case 'moveSprite':
    // [spriteName, direction, distance]
    moveSprite(findSpriteByName(command.args[0]), command.args[1], parseInt(command.args[2]));
    break;
case 'variableAssignment':
    // [variableName, value]
    assignVariable(command.args[0], command.args[1]);
    break;
case 'addition':
    // [operand1, operand2]
    return addition(command.args[0], command.args[1]);
case 'subtraction':
    // [operand1, operand2]
    return subtraction(command.args[0], command.args[1]);
case 'multiplication':
    // [operand1, operand2]
    return multiplication(command.args[0], command.args[1]);
case 'defineFunction':
    // [functionName, ...params]
    defineFunction(command.args[0], command.args.slice(1));
    break;
case 'forward':
    // [spriteName]
    forward(findSpriteByName(command.args[0]));
    break;
case 'backward':
    // [spriteName]
    backward(findSpriteByName(command.args[0]));
    break;
case 'left':
    // [spriteName]
    left(findSpriteByName(command.args[0]));
    break;
case 'right':
    // [spriteName]
    right(findSpriteByName(command.args[0]));
    break;
case 'rotate':
    // [spriteName, degrees]
    rotate(findSpriteByName(command.args[0]), parseInt(command.args[1]));
    break;
case 'ifCondition':
    // Handle if condition
    ifCondition(command.condition, command.statements);
    break;
case 'ifElseCondition':
    // Handle if-else condition
    ifElseCondition(command.condition, command.ifStatements, command.elseStatements);
    break;
case 'repeat':
    // [times, statements]
    repeat(parseInt(command.args[0]), command.statements);
    break;
case 'repeatUntil':
    // [condition, statements]
    repeatUntil(command.condition, command.statements);
    break;
case 'attack':
    // [spriteName, targetSpriteName]
    attack(findSpriteByName(command.args[0]), findSpriteByName(command.args[1]));
    break;
            case 'playGameFunction':
    // Assuming the argument is a function name
    playGameFunction(command.args[0]);
    break;
case 'playGameFunction':
    PlayGameFunction();
    break;

case 'fastForward':
    const sprite = findSpriteByName(command.args[0]);
    fastForward(sprite);
    break;

case 'it':
    const checkSprite = findSpriteByName(command.args[0]);
    return checkSprite.isIt;


case 'forever':
    // Execute the block of commands indefinitely
    forever(command.statements);
    break;
}
}


function findSpriteByName(name) {
return env.getSpriteByName(name);
}
const env = {
sprites: [],
variables: {},

addSprite(sprite) {
this.sprites.push(sprite);
},

removeSprite(name) {
this.sprites = this.sprites.filter(sprite => sprite.name !== name);
},

getSpriteByName(name) {
return this.sprites.find(sprite => sprite.name === name);
},

updateSprite(name, properties) {
let sprite = this.getSpriteByName(name);
if (sprite) {
    Object.assign(sprite, properties);
}
},

setVariable(name, value) {
this.variables[name] = value;
},

getVariable(name) {
return this.variables[name];
},

resetEnvironment() {
this.sprites = [];
this.variables = {};
},
};

setupIDE();
setupCanvas();

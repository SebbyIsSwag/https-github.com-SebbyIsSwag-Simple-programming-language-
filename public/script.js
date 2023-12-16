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
               // Example drawing method for the sprite
               context.fillStyle = 'red'; // Set the sprite color
            context.fillRect(this.x, this.y, this.width, this.height); // Draw the sprite as a rectangle

            moveToTarget(target) 
                // Simple logic to move towards the target sprite
                const deltaX = target.x - this.x;
                const deltaY = target.y - this.y;
                const angle = Math.atan2(deltaY, deltaX);
                const speed = 1;
                this.velocity.x = Math.cos(angle) * speed;
                this.velocity.y = Math.sin(angle) * speed;
            }

            updatePosition() {
                this.x += this.velocity.x;
                this.y += this.velocity.y;
            }
        }
    tag(target) 
        // Check if this sprite is close enough to tag the target
        const distance = Math.sqrt(Math.pow(this.x - target.x, 2) + Math.pow(this.y - target.y, 2));
        if (distance < 10) { // Assuming a tagging distance of 10 units
            this.isIt = false;
            target.isIt = true;
        }

    function updateGameState() {
    // Iterate through each command in the user-written code
    for (let command of userCodeCommands) {
        switch (command.type) {
            case 'moveSprite':
                moveSprite(command.sprite, command.direction, command.distance);
                break;
            case 'changeSpriteColor':
                changeSpriteColor(command.sprite, command.color);
                break;
            case 'ifCondition':
                if (evaluateCondition(command.condition)) {
                    executeCommands(command.commands);
                }
                break;
            case 'repeatLoop':
                for (let i = 0; i < command.count; i++) {
                    executeCommands(command.commands);
                }
                break;
            // Additional command types...
        }
    }
}
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
           const commands = parse(code);
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

function parse(code) {
    const lines = code.split('\n');
    const ast = [];

    for (let line of lines) {
         if (line.includes('=')) {
             let line = lines[i].trim();
         if (line.startsWith('if')) {
             let { ifNode, nextIndex } = parseIfStatement(line, lines, i);
             ast.push(ifNode);
             i = nextIndex - 1; // Adjust index to continue parsing after the if statement
         } else if (line.includes('+')) {
             const parts = line.split('+');
             const left = parseInt(parts[0].trim());
             const right = parseIntparts[1].split(';')[0].tri
         } else if (line.startsWith('it?')) {
            ast.push({ type: 'itCheck', spriteName: line.split(' ')[1] });
        } else if (line.startsWith('fastForward')) {
            ast.push({ type: 'fastForward', spriteName: line.split(' ')[1] });
        } else if (line.startsWith('attack')) {
            const parts = line.split(' ');
            ast.push({ type: 'attack', spriteName: parts[1], targetName: parts[2] });
        } else if (line.startsWith('forever')) {
            ast.push({ type: 'forever', statements: extractBlockStatements(lines, currentIndex) });
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
     }

    return ast;
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

    return variables;
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

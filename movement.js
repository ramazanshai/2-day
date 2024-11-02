const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function drawVerticalRay(x, color = 'black') {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.strokeStyle = color;
    ctx.stroke();
}

function drawHorizontalRay(y, color = 'black') {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.strokeStyle = color;
    ctx.stroke();
}

function drawPoint(x, y, color = 'black') {
    ctx.beginPath();
    ctx.ellipse(x, y, 10, 10, Math.PI / 4, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawRect(rect) {
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.fillStyle = rect.color;
    ctx.fill();
}

function drawCircle(circle) {
    ctx.beginPath();
    ctx.ellipse(circle.x, circle.y, circle.radius, circle.radius, Math.PI / 4, 0, 2 * Math.PI);
    ctx.fillStyle = circle.color;
    ctx.fill();
}

function checkRectsCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.height + rect1.y > rect2.y
}

function checkCirclesCollision(circle1, circle2) {
    const distance = Math.sqrt(Math.pow(circle1.x - circle2.x, 2) + Math.pow(circle1.y - circle2.y, 2));

    return distance < (circle1.radius + circle2.radius);
}

function checkCircleRectCollision(circle, rect) {
    let distX = Math.abs(circle.x - rect.x - rect.width / 2);
    let distY = Math.abs(circle.y - rect.y - rect.height / 2);

    if (distX > (rect.width / 2 + circle.radius)) { return false; }
    if (distY > (rect.height / 2 + circle.radius)) { return false; }

    if (distX <= (rect.width / 2)) { return true; }
    if (distY <= (rect.height / 2)) { return true; }

    let dx = distX - rect.width / 2;
    let dy = distY - rect.height / 2;
    return (dx * dx + dy * dy <= (circle.radius * circle.radius));
}

let rect1 = {
    x: 100,
    y: 100,
    width: 100,
    height: 70,
    color: 'green'
}

let rect2 = {
    x: 400,
    y: 300,
    width: 100,
    height: 70,
    color: 'green'
}

let circle1 = {
    x: 100,
    y: 100,
    radius: 30,
    color: 'green'
}

let circle2 = {
    x: 300,
    y: 340,
    radius: 80,
    color: 'green'
}

let ball = {
    x: 400,
    y: 300,
    radius: 50,
    color: 'yellow'
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

let balls = []

for (let i = 1; i < 10; i++) {
    balls.push({
        x: i * 100,
        y: getRandom(100, 300),
        dx: getRandom(3, 5),
        dy: getRandom(3, 5),
        radius: getRandom(15, 30),
        color: 'green'
    })
}

let rect = {
    x: 200,
    y: 400,
    dx: 4,
    dy: 4,
    width: 200,
    height: 40,
    color: 'blue'
}

canvas.addEventListener('mousemove', function(event){
    ball.x = event.offsetX;
    //point.y = event.offsetY;
})

canvas.addEventListener('mousedown', function(event){
    ball.color = 'red';
})

canvas.addEventListener('mouseup', function(event){
    ball.color = 'blue';
})

const pressed = {}
document.addEventListener('keydown', function(event){
    pressed[event.code] = true;
})

document.addEventListener('keyup', function(event){
    pressed[event.code] = false;
})

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (pressed['ArrowRight'] && rect.x + rect.width <= canvas.width) {
        rect.x = rect.x + rect.dx
    }

    if (pressed['ArrowLeft'] && rect.x >= 0) {
        rect.x = rect.x - rect.dx
    }

    if (pressed['ArrowUp'] && rect.y >= 0) {
        rect.y = rect.y - rect.dy
    }

    if (pressed['ArrowDown'] && rect.y + rect.height <= canvas.height) {
        rect.y = rect.y + rect.dy
    }

    for (const ball of balls) {
        ball.x = ball.x + ball.dx
        ball.y = ball.y + ball.dy
    }

    if (
        (rect.x + rect.width >= canvas.width) ||
        (rect.x <= 0)
    ) {
        rect.dx = rect.dx * (-1)
        rect.x = rect.x + rect.dx
    }

    for (const ball of balls) {
        if ((ball.y + ball.radius >= canvas.height) || (ball.y - ball.radius <= 0) || checkCircleRectCollision(ball, rect)) {
            ball.dy = ball.dy * (-1)
            ball.y = ball.y + ball.dy
        }

        if ((ball.x + ball.radius >= canvas.width) || (ball.x - ball.radius <= 0) || checkCircleRectCollision(ball, rect)) {
            ball.dx = ball.dx * (-1)
            ball.x = ball.x + ball.dx
        }
    }
   
    for (const ball of balls) {
       drawCircle(ball);
    }
    drawRect(rect);

    window.requestAnimationFrame(render);
}
window.requestAnimationFrame(render);

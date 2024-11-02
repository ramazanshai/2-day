const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function drawCircle(circle) {
    ctx.beginPath();
    ctx.ellipse(circle.x, circle.y, circle.radius, circle.radius, Math.PI / 4, 0, 2 * Math.PI);
    ctx.fillStyle = circle.color;
    ctx.fill();
    ctx.closePath();
}

function drawCircleStroke(circle) {
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.ellipse(circle.x, circle.y, circle.radius, circle.radius, Math.PI / 4, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
}

function drawTarget(point) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "orange";
    ctx.moveTo(point.x - 20, point.y);
    ctx.lineTo(point.x + 20, point.y);
    ctx.moveTo(point.x, point.y - 20);
    ctx.lineTo(point.x, point.y + 20);
    ctx.stroke();
    ctx.closePath();
}

function checkCirclesCollision(circle1, circle2) {
    const distance = Math.sqrt(Math.pow(circle1.x - circle2.x, 2) + Math.pow(circle1.y - circle2.y, 2))
    return distance < (circle1.radius + circle2.radius);
}

function getDistance(point1, point2) {
    return Math.sqrt((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y))
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min
}

const enemyArr = []

for(let i = 0; i < 30; i++){
    enemyArr.push({
        x: getRandom(50, 900),
        y: getRandom(50, 400),
        radius: 15,
        color: "blue",
        dangerRadius: 150,
        hunting: false,
        speed: 2,
        target: {
            x: getRandom(50, 900),
            y: getRandom(50, 400),
            radius: 20,
            color: "green"
        }    
    })   
}

const player = {
    x: 0,
    y: 0,
    radius: 15,
    color: "yellow"
}

canvas.addEventListener("mousemove", function(event){
    player.x = event.pageX - event.target.offsetLeft
    player.y = event.pageY - event.target.offsetTop
})

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const enemy of enemyArr) {
    const distance = getDistance(enemy, enemy.target)

    enemy.x += (enemy.target.x - enemy.x) * enemy.speed / distance
    enemy.y += (enemy.target.y - enemy.y) * enemy.speed / distance

    const zone = {
        x: enemy.x,
        y: enemy.y,
        radius: enemy.dangerRadius,
        color: "red"
    }

    if(checkCirclesCollision(player, zone) === true){
        enemy.hunting = true
        enemy.speed = 5
        enemy.dangerRadius = 250
        enemy.target = player;
    }else{
        if(enemy.hunting === true){
        enemy.hunting = false
        enemy.speed = 2
        enemy.dangerRadius = 150
        enemy.target = {
            x: getRandom(50, 900),
            y: getRandom(50, 400),
            radius: 20,
            }
        }
    }

    if(checkCirclesCollision(enemy.target, enemy) === true){
        if(enemy.hunting === true){
            console.log("Попался");
        } else{
            enemy.target = {
                x: getRandom(50, 900),
                y: getRandom(50, 400),
                radius: 20,
                color: "green"
           }
        }
    }
    }

    drawCircle(player)
    
    for (const enemy of enemyArr) {
        drawCircle(enemy)
    }

    window.requestAnimationFrame(render)
}

window.requestAnimationFrame(render)



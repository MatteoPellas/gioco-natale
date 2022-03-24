import Levels from "./levels";

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;


// Map
Levels terreno = new Levels(25,16,32,32,)

// globals variabiles
const keys = [];
let projectile = []
let enemies = [];
let enemyPosition = []
let enemiesInterval = 500;
let frame = 0;
let fall = false
let right = false;
let left = false;
let up = false;
let timer = 0;
let controlTime = false;
let gameOver = false;
let caricatore = 12;
let score = 0;

//player
const player = {
    x: 0,
    y: 400,
    width: 32,
    height: 48,
    frameX: 0,
    frameY: 0,
    speed : 2,
    //jump: 60, 
    gravity : 3,
    moving: false,
    health: 100
}

// projectiles and shoot system
class Ammo{
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 5;
        this.height = 10;
        this.power = 20;
        this.speed = 5;
        this.dx = this.x - mouse.x;
        this.dy = this.y - mouse.y;
    }
    update(){
        this.x -= this.dx/this.speed
        this.y -= this.dy/this.speed;
    } 
    draw (){
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
        ctx.fill();
    }   
}

function handleAmmo(){
    for (let i = 0; i < projectile.length; i++){
        projectile[i].update();
        projectile[i].draw();

        for (let j = 0; j<enemies.length; j++){
            if(enemies[j] && projectile[j] && collision(projectile[j], enemies[j])){
                enemies[j].health -= projectile[j].power;
                projectile.splice(i, 1);
                i--
            }
        }
        if(projectile[i] && projectile[i].x > canvas.width){
            projectile.splice(i, 1);
            i--
        }
    }
}
//image and sprite animation
const playerSprite = new Image();
playerSprite.src = "bloodelf_male2.png"
const background = new Image ();
background.src = "theophile-curto-twfbetc4-x4size.jpg";
const flor = new Image();
flor.src = "mntn_gray_d.jpg"
const terrain = {
    x : 0,
    y : canvas.width - 450,
    width : 150,
    height : canvas.height,
    color : "grey" 
}

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

function handlePlayerFrame(){
    if (player.frameX< 3 && player.moving == true) player.frameX++
    else player.frameX =0
}

// Mouse interattivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x:canvas.width/2,
    y:canvas.height/2,
    click :false
}
canvas.addEventListener('mousedown', function(event){
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
    mouse.click = true
    
    if (caricatore > 0){
        projectile.push(new Ammo(player.x, player.y + 15))
    }
    else {
        ctx.fillStyle='black';
        ctx.font = '30px Arial';
        ctx.fillText ('RELOAD', 135,330);
    }
    caricatore --;
})
canvas.addEventListener('mouseup', function(event){
    mouse.click = false
    controlTime = false
})

// interazioni e anti-ghosting
window.addEventListener("keydown", function(e){
    keys[e.keyCode] = true ;
    
})
window.addEventListener("keyup", function(e){
    delete keys[e.keyCode];
    player.moving = false;
})

function movePlayer(){
    if (keys[68] && player.x<canvas.width-player.width){
        player.x += player.speed
        player.frameY = 2;
        right = true
        left = false
        up = false
        player.moving = true;
    }
    if (keys[65] && player.x>0){
        player.x -= player.speed
        player.frameY = 1;
        left = true
        right = false;
        up = false
        player.moving = true;
    }
    if (keys [87] && player.y>250) {
        player.y -= player.speed;
        player.frameY =3
        player.moving = true;
    }
    if (keys[83] && player.y<canvas.height - player.height){
        player.y += player.speed;
        player.frameY = 0
        player.moving = true;
    }
    if (keys[82]){
        while(caricatore != 12){
            caricatore += 0.5
            ctx.fillStyle='yellow';
            ctx.font = '20px Arial';
            ctx.fillText ('RELOADING...', 10,90);
        }
    }
}

//enemy and figth
class Enemy{
    constructor(verticalPos){
        this.x = canvas.width;
        this.y = verticalPos;
        this.width = player.width;
        this.height = player.height;
        this.speed = Math.random() * 0.2 + 0.4;
        this.movement = this.speed;
        this.health = 100;
        this.maxHealth = this.health;
        this.dx = this.x - player.x;
        this.dy = this.y - player.y;
    }
    update(){
        if(this.y > player.y){
            this.y -= this.speed;
        }
        if(this.y < player.y){
            this.y += this.speed;
        }
        if(this.x > player.x){
            this.x -= this.speed;
        }
        if(this.x < player.x){
            this.x += this.speed;
        }
        
    }
    draw(){
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
function handleEnemies(){
    for (let i = 0;i<enemies.length;i++){
        enemies[i].update();
        enemies[i].draw();
        if(enemies[i].health <= 0){
            enemies.splice(i, 1);
            i--
            score += 10
        }
    }
    if (frame % enemiesInterval === 0){
        let verticalPos = Math.floor(Math.random() * 6 + 5)*player.height;
        enemies.push(new Enemy(verticalPos))
        enemyPosition.push(verticalPos)
        if (enemiesInterval > 120) enemiesInterval -= 100
    }
}
function damage(){
    for (let i = 0; i< enemies.length; i++){
        if(collision(player, enemies[i])){
            enemies[i].movement = 0;
            player.health -= 5;
        }
        if (player.health <= 0){
            gameOver = true
        }
    }
}

function lose(){
    if (gameOver){
        ctx.fillStyle='yellow';
        ctx.font = '60px Arial';
        ctx.fillText ('GAME OVER', 135,330);
    }
}

//score
function topFrame(){
    ctx.fillStyle='yellow';
    ctx.font = '20px Arial';
    ctx.fillText ('Score: ' + score, 10,30);

    ctx.fillStyle='yellow';
    ctx.font = '20px Arial';
    ctx.fillText ('Lifepoint: ' + player.health, 10,60);
}

// collision
function collision(first, second){
    if (    !(  first.x > second.x + second.width || first.x + first.width < second.x || first.y > second.y + second.height || first.y + first.height < second.y)
    ){
        return true;
    }
}

// Loop
if(gameOver == false){
    setInterval(function(){
        ctx.clearRect(0,0,canvas.width,canvas.height)
        ctx.drawImage(background, 0,-250, canvas.width, canvas.height);
        //ctx.drawImage(flor, terrain.x, terrain.y, terrain.width, terrain.height)
        drawSprite(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height)
        topFrame()
        handlePlayerFrame()
        handleEnemies ()
        movePlayer();
        handleAmmo();
        damage();
        lose()
        frame ++
    }, 40)
}



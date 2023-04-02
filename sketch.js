var bgSprite,bgImage;
var player,playerImage;
var bullet, bulletImage;
var enemy,enemyImage;
var meteor, meteorImage;
var obstacleGroup;
const maxBullets = 20;
var totalBullets = maxBullets;
var bulletGroup;
const life = 3;
var currentlife = 3;
const PLAY = 0;
const END = 1;
const INIT = -1;
var gameState = INIT; 
const maxScore = 800;
var score = 0;
var livesImage;
var livesGroup;
var gameOver ,gameOverImg;
var youWin , youWinImg;
var restart, restartImg;
var obstacleHitSound;
var gameOverSound;
var youWinSound;
var playerHitSound;

function preload(){
      //Load the images
      bgImage = loadImage("Images/bg2.jpg");
      playerImage = loadImage("Images/spaceship.png");
      bulletImage = loadImage("Images/bullet.png");
      enemyImage = loadImage("Images/enemy spaceship.png");
      meteorImage = loadImage("Images/meteor.png");
      livesImage = loadImage("Images/lives.png");
      gameOverImg = loadImage("Images/game over.png");
      youWinImg = loadImage("Images/youWin.png");
      restartImg = loadImage("Images/restart.png");

      obstacleHitSound = loadSound("Sounds/collided.wav");
      gameOverSound = loadSound("Sounds/gameOver.wav");
      youWinSound = loadSound("Sounds/win.mp3");
      playerHitSound = loadSound("Sounds/life lost.wav");

}
  
function setup(){

    createCanvas(windowWidth-25,windowHeight-25);
    //Create bg and add velocity to it 
    bgSprite = createSprite(windowWidth/2,windowHeight/2,50,50);
    bgSprite.addImage(bgImage);
    bgSprite.scale = 0.7;
    bgSprite.velocityX = -3;
    //Create player and add image
    player = createSprite(100,windowHeight-50,10,20);
    player.setCollider("circle", 0, -3, 110);    
    player.addImage(playerImage);
    player.scale = 0.5;

    obstacleGroup = new Group();
    bulletGroup = new Group();
    livesGroup = new Group();

    for (var i = 0;i<currentlife;i++){
         var heart = createSprite(displayWidth-(currentlife-i)*60,40,20,20);
         heart.addImage(livesImage);
         heart.scale = 0.2;
         livesGroup.add(heart);
    }

    restart = createSprite(windowWidth/2 - 20,windowHeight/2 + 200,20,20);
    restart.addImage(restartImg);
    restart.visible = false;
    restart.scale = 0.5;

    gameOver = createSprite(windowWidth/2 -20,windowHeight/2 - 100,20,20);
    gameOver.addImage(gameOverImg);
    gameOver.visible = false;
    gameOver.scale = 0.7;

    youWin = createSprite(windowWidth/2 - 20,windowHeight/2 - 100,20,20);
    youWin.addImage(youWinImg);
    youWin.visible = false;
    youWin.scale = 0.8;

    swal({ title: `Story!${"\n"}`,
     text: "You are trying to reach another planet.. Aliens on that planet don't want you to enter their planet.So the aliens are sending spaceships to kill you.Control you spaceship with up arrow and down arrow keys.Press space to shoot bullets that destory the obstacles in your way.You have 3 lives and 20 bullets , Use them well.BEST OF LUCK", 
    confirmButtonText: "Ok", closeOnConfirm:true }, function(isConfirm) { if (isConfirm) gameState = PLAY; return true; } );

}

function draw(){
      //Background should not end
      if (bgSprite.x<100){
          bgSprite.x = windowWidth/2;
      }

      if (gameState == PLAY){

          handlePlayerControls();    
          spawnObstacles();
          obstacleGroup.overlap(bulletGroup,destroyEnemy);
          obstacleGroup.overlap(player,handlePlayerLife);              

          if (currentlife<=0 || totalBullets<=0){
              gameOver.visible = true;
              gameOverSound.play();
              gameState = END;         
          }

          if (score>= maxScore){
              youWin.visible = true;  
              youWinSound.play();          
              gameState = END;
          }

      }

      drawSprites();

      if (gameState == END){
          restart.visible = true ;
          bgSprite.velocityX = 0;

          if (mousePressedOver(restart)){
              reset();
          }

          obstacleGroup.setLifetimeEach(-1);
          obstacleGroup.destroyEach();
          bulletGroup.destroyEach();
          obstacleGroup.setVelocityXEach(0);
       
      }

      displayScore();

  
}

function spawnObstacles(){
    //Spawn enemy spaceships

    if (score>250){    
        if (frameCount % 30 === 0 ){
            var obstacle = createSprite(windowWidth,Math.round(random(100,windowHeight-100)),20,20);
            obstacle.setCollider("circle", -100, 0, 500);
            var r = Math.round(random(1,2));
            switch(r){
            case 1 : obstacle.addImage(enemyImage);
            break ; 
            case 2 : obstacle.addImage(meteorImage);
            break ;
            default : obstacle.addImage(enemyImage);
            break ;
            }                
                
            obstacle.scale = 0.1;
            player.depth = obstacle.depth + 1 ;
            obstacle.velocityX = -8;
            obstacle.lifetime = 350;
            obstacleGroup.add(obstacle);
        }
    } else if (frameCount % 50 === 0 ){
        var obstacle = createSprite(windowWidth,Math.round(random(100,windowHeight-100)),20,20);
        obstacle.setCollider("circle", -100, 0, 500);
        var r = Math.round(random(1,2));
        switch(r){
        case 1 : obstacle.addImage(enemyImage);
        break ; 
        case 2 : obstacle.addImage(meteorImage);
        break ;
        default : obstacle.addImage(enemyImage);
        break ;
        }                
            
        obstacle.scale = 0.1;
        player.depth = obstacle.depth + 1 ;
        obstacle.velocityX = -7;
        obstacle.lifetime = 350;
        obstacleGroup.add(obstacle);
    }  
}    


function destroyEnemy(obstacle,bullet){
         obstacle.destroy();
         bullet.destroy();
         score = score + 50;
         obstacleHitSound.play();
}

function handlePlayerLife(obstacle,player){
         if (currentlife>0){
             currentlife = currentlife - 1;   
             livesGroup[currentlife].destroy();          
         }
         obstacle.destroy();
         playerHitSound.play();
}

function displayScore(){
         textSize(30);
         fill("cyan");
         text("Bullets = "+totalBullets,20,40);               
         text("Score = "+score,20,90);
         
}

function handlePlayerControls(){
    //Add movement keys to the player
    if (keyDown("UP_ARROW")){
        player.y = player.y-7;
    }

    if (keyDown("DOWN_ARROW")){
        player.y = player.y+7;
    }

    //Set a boundary for the player
    if (player.y<0){
        player.y = 30;
    }

    if (player.y>windowHeight){
        player.y = windowHeight-30;
    }

    //Create bullet
    if (keyWentDown("space")){
        bullet = createSprite(player.x + 75,player.y-2,10,10);
        bullet.addImage(bulletImage);
        player.depth = bullet.depth + 1;
        bullet.velocityX = 10;
        bullet.scale = 0.1;
        bullet.lifetime = 250;
        bullet.setCollider("circle", 25, 10, 150);
        bulletGroup.add(bullet);
        totalBullets = totalBullets - 1 ;          
    }
}

function reset(){

         gameState = PLAY ;    
         
         totalBullets = maxBullets;
         score = 0;
         currentlife = life;
         restart.visible = false;
         gameOver.visible = false;
         youWin.visible = false;
         obstacleGroup.destroyEach();      
         livesGroup.destroyEach();
         bgSprite.velocityX = -3;

         for (var i = 0;i<currentlife;i++){
              var heart = createSprite(displayWidth-(currentlife-i)*60,40,20,20);
              heart.addImage(livesImage);
              heart.scale = 0.2;
              livesGroup.add(heart);
         }         
}
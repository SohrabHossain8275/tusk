var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, gimage;
var iground;
var bagelnine = [3, 6, 9, 12, 15, 18, 21, 24];
var cloud, cloudsGroup, cloudImage;
var ob1, ob2, ob3, ob4, ob5, ob6, obGroup;
var score = 0;
var gameOverImg;
var resetImg
var jound, chound, downed;

function preload(){
  trex_running = loadAnimation("trex1.png", "trex2.png", "trex3.png");
  trex_collided = loadAnimation("trex_collided.png")
  gimage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  ob1 = loadImage("obstacle1.png");
  ob2 = loadImage("obstacle2.png");
  ob3 = loadImage("obstacle3.png");
  ob4 = loadImage("obstacle4.png");
  ob5 = loadImage("obstacle5.png");
  ob6 = loadImage("obstacle6.png");
  gameOverImg = loadImage("gameOver.png");
  resetImg = loadImage("restart.png");
  jound = loadSound("jump.mp3");
  chound = loadSound("checkpoint.mp3");
  downed = loadSound("die.mp3");
}

function setup(){
  //createCanvas(600,200);
  createCanvas(windowWidth,windowHeight);
  average();
  //create a trex sprite
  trex = createSprite(50, height - 70, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;

  //create a ground sprite
  //ground = createSprite(200, 180, 400, 20);
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground", gimage);
  ground.x = ground.width/2;
  ground.velocityX = -(6+3*score/100);

  //create an invisible ground sprite
  //iground = createSprite(200,190,400,10);
  iground = createSprite(width/2,height-10,width,125);
  iground.visible = false;

  //gameOver = createSprite(300,100);
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;

  //restart = createSprite(300,140);
  restart = createSprite(width/2,height/2);
  restart.addImage(resetImg);
  restart.scale = 0.5;
  restart.visible = false;
  /*for (var i=0; i<bagelnine.length; i++){
    if (bagelnine[i]>=15){
      console.log(bagelnine[i]);
    }
  }*/

  obGroup = createGroup();
  cloudsGroup = createGroup();

  //trex.debug = true;
  trex.setCollider("circle",0,0,40);
}

function draw(){
  background(255);
  text("Score: "+score,400,50);
  
  if (gameState === PLAY){
  gameOver.visible = false;
  restart.visible = false;

  ground.velocityX = -6;
  score += Math.round(frameCount/60);
  console.log("hello");

  if(score > 0 && score % 100 === 0){
    chound.play();
  }

  if (ground.x<0){
    ground.x = ground.width/2
  }

  //trex jump
  if ((touches.length>0 || keyDown("space")) && trex.y >= height-120){
    trex.velocityY = -15;
    jound.play();
    touches = [];
  }

  //add gravity
  trex.velocityY += 0.8;

  //clouds
  spawnClouds();
  
  spawnObstacles();
  /*ground.depth = 0;
  trex.depth += 1;*/
  if (obGroup.isTouching(trex)){
    ////adding AI to trex
    //trex.velocityY = -15;
    //jound.play();
    gameState = END;
    downed.play();
  }
  }
  else if(gameState === END){
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.changeAnimation("collided",trex_collided);
    obGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart) || touches.length>0 || keyDown("SPACE")){
      reset();
      touches = [];
    }
  }
    //stop trex from falling down
    trex.collide(iground);
    drawSprites();  
}

function spawnObstacles(){
  if (frameCount%60 === 0){
    //var obstacle = createSprite(600,165,10,40);
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.velocityX = -6;
    var r = Math.round(random(1,6));
    switch (r){
      case 1:
        obstacle.addImage(ob1);
      break;
      case 2:
        obstacle.addImage(ob2);
      break;
      case 3:
        obstacle.addImage(ob3);
      break;
      case 4:
        obstacle.addImage(ob4);
      break;
      case 5:
        obstacle.addImage(ob5);
      break;
      case 6:
        obstacle.addImage(ob6);
      break;
      default:
      break;
    }
    obstacle.scale = 0.5;
    obstacle.lifetime = 250;
    obGroup.add(obstacle);
  }
}

function spawnClouds(){
  if (frameCount%60 === 0){
   //cloud = createSprite(640, 100, 40, 10);
   var cloud = createSprite(width+20,height-300,40,10);
   cloud.y = Math.round(random(100, 220));
   cloud.addImage(cloudImage);
   cloud.velocityX = -9;
   cloud.depth = trex.depth;
   trex.depth += 1;
   cloud.lifetime = 250;
   cloudsGroup.add(cloud);
  }
}

function reset(){
 gameState = PLAY; 
 trex.changeAnimation("running",trex_running);
 gameOver.visible = false;
 restart.visible = false;
 obGroup.destroyEach();
 cloudsGroup.destroyEach();
 score = 0;
}
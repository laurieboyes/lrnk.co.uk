//Thanks for the tips Matt Hackett (great programmer name by the way) http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/

//must credit http://www.bfxr.net/ on the site for the sound creation

//sprites made in Paint.Net

//coding done in Notepad++



/*** DEBUG FLAGS */

drawCollBoxes = false;



//get script path to get content via relative addressing

//bobince http://stackoverflow.com/questions/2161159/get-script-path

var path = document.getElementsByTagName('script')[0].src;

var mydir= path.split('/').slice(0, -1).join('/')+'/';  // remove last filename part of path



//temp

platformWidth = 200;

platformHeight = 50;



Collisions = {"noColl":0, "north":1, "south":2, "northsouth":3, "east":4, "west":5, "westeast":6 };



States = {"playing":0, "paused":1, "movingFrame":2};

soundOn = true;



var gravity = 500;

frameWidth = 600;

currentFrame = 0;

//temp, make dynamic/dependent on level

lastFrame =  7;

//for moving frame purposes only

var goalFrame;

var frameMoveDirection;



var gameState = States.playing;



var prePauseState;



/*BRB

   

   make platforms/tiles nice

   

   badguys

   

*/



/*TODO (see code for more TODOs)

   possibly move onscreen checks out of drawMe and update drawable list on the fly? Not sure if will be faster or not or even make a difference

*/



/*Known issues / semi-resolved bugs



   Right, this annoying DOMException 12. I know it only happens once, right at the beginning at the prog,

   but putting a break point in doesn't seem to stop it, so it would appear to be an issue occuring

   before the program starts. Hmm. - Ha! I get this problem on most websites on my Chrome, I just don't normally

   have the javascript debugger on. Fancy that.

 

*/



/*Things learnt/do differently next time

   'compress' frames in jump animation are useless because when jumping you need to leave the ground straight away

   

   man doesn't appear to jump as high on slow update rate as on a slower update rate the measurement interval is 

   larger so it doesn't happen to catch it at the height of the jump

   which.... will cause collision problems for people running slow machines but sod'em

   my game's for future people, not losers lagging behind in the past

*/



// Create the canvas

var canvas = document.createElement("canvas");

//stretch the canvas to a size I like. This flexibility is quite good actually, I didn't realise I could do this

canvas.setAttribute("style", "width: 1000px; height: 700px;"); 



var ctx = canvas.getContext("2d");

canvas.width = frameWidth;

canvas.height = 400;

document.body.appendChild(canvas);



//keyboardz

Keys = {"w":119, "W":87, "a":97, "A":65, "s":115, "S":83, "d":100, "D":68, "l":108, "L":76, "p":112, "P":80, "m":109, "M":77};

var keysDown = {};

addEventListener("keydown", function (e) {

   

   if(e.keyCode == Keys.p || e.keyCode == Keys.P) {

      if(gameState != States.paused) {

         pauseTimers();

         prePauseState = gameState;

         gameState = States.paused;

      } else {

         gameState = prePauseState;

         resumeTimers();

      }

   } else if(e.keyCode == Keys.m || e.keyCode == Keys.M) {

      soundOn = (soundOn)? false : true;

   }   

   else {

      keysDown[e.keyCode] = true;

   }

}, false);

addEventListener("keyup", function (e) {

      delete keysDown[e.keyCode];

}, false);





//for resuming state after pause

var timerPauseTime = null;



/*

   These functions complicated by the fact that you can pause whilst moving frame

      - essentially pause while action is paused

   Record at what point action is first paused (this time). If action already paused, do nothing

*/

function pauseTimers() {

   if(gameState == States.playing) {

      timerPauseTime = Date.now();

   }

}

/*

   Resume the action, update all the timers

*/

function resumeTimers() {

   if(gameState == States.playing) {

      var now = Date.now()

      for(i in timerUpdateObjs) {

         timerUpdateObjs[i].updateTimers(now - timerPauseTime);

      }

   }

}





//sound

sounds = new Array();

sounds["jump"] = new Audio("resources/audio/little-green-men/jump.wav");

sounds["shootm"] = new Audio("resources/audio/little-green-men/shootm.wav");



function playSound(soundID) {

   if(soundOn) {

      var s = sounds[soundID];

      if(s != undefined) {

         s.volume = 0.1;

         s.play();

         s.currentTime=0;

      } else {

         console.log("attempt to play nonexistant sound: " + soundID);

      }

   }

}





var sprites = {  



   hero_stand_right: new sprite(6,4,33,43,-8,-4),

   hero_stand_left: new sprite(42,4,69,43,-12,-4),

   hero_walk_right: [new sprite(6,56,33,95,-8,-4),

                     new sprite(42,54,67,95,-6,-6),

                     new sprite(76,54,101,95,-6,-6),

                     new sprite(108,56,135,95,-8,-4),

                     new sprite(144,54,169,95,-6,-6),

                     new sprite(178,54,203,95,-6,-6)],

   hero_walk_left: [new sprite(8,106,35,145,-12,-4),

                    new sprite(42,104,67,145,-12,-6),

                    new sprite(76,104,101,145,-12,-6),

                    new sprite(110,106,137,145,-12,-4),

                    new sprite(144,104,169,145,-12,-6),

                    new sprite(178,104,203,145,-12,-6)],

   hero_ascend_right: new sprite(6,154,33,203,-8,-4),

   hero_descend_right: new sprite(40,154,65,195,-6,-4),

   hero_ascend_left: new sprite(106,154,133,203,-12,-4),

   hero_descend_left: new sprite(74,154,99,195,-12,-4),

   s_missile_right: new sprite(6,214,11,215,-4,0),

   s_missile_left: new sprite(112,214,117,215,0,0),

   m_missile_right: [new sprite(20,214,31,217,-8,0),

                     new sprite(20,228,31,231,-8,0)],

   m_missile_left: [new sprite(92,214,103,217,0,0),

                     new sprite(92,228,103,231,0,0)]



   //l_missile                  

   //...

};



/*

x_off/y_off: offset of the sprite from the collision box

all params in scaled pixels

*/

function sprite (topleft_x, topleft_y, bottomright_x, bottomright_y, x_off, y_off) {

   this.topleft_x = topleft_x;

   this.topleft_y = topleft_y;

   this.bottomright_x = bottomright_x;

   this.bottomright_y = bottomright_y;

   this.x_off = x_off;

   this.y_off = y_off;

   this.getX = function () {

      return topleft_x;

   }

   this.getY = function () {

      return topleft_y;

   }

   this.getW = function () {

      return (this.bottomright_x + 1) - this.topleft_x;

   }

   this.getH = function () {

      return (this.bottomright_y + 1) - this.topleft_y;

   }

}



var sprites_ready = false;

var spriteSheet = new Image();

spriteSheet.onload = function (){

   sprites_ready = true; 

};

spriteSheet.src = "resources/images/little-green-men/spritesheetBig.png";



var backdrop_ready = false;

var backdrop = new Image();

backdrop.onload = function (){

   backdrop_ready = true; 

};

//background images used with permission from Paul Bourke: http://paulbourke.net/miscellaneous/mars128/

backdrop.src = "resources/images/little-green-men/backdrop2.png";







/* If this function is passed a non-anim sprite (so the value contains the the single sprite, not an array of 

   sprites), it will just display the sprite.

*/

function loopAnimate(fps, animSprite, animStartTime) {

   if(animSprite.length == undefined) {

      return animSprite;

   }

   var no_seconds_in_anim_loop = (1/fps) * animSprite.length

   var time_passed_wrt_animation = ((Date.now() - animStartTime) / 1000) % no_seconds_in_anim_loop;

   var spriteIndex = Math.floor(time_passed_wrt_animation * fps); 

   return animSprite[spriteIndex];



}





function moveViewFrameCheck() {

   var heroXCentre = hero.getX() + hero.getW() / 2

   if(heroXCentre > getFrameXMax() && currentFrame < lastFrame) {

      pauseTimers();

      gameState = States.movingFrame;

      goalFrame = currentFrame + 1;

      frameMoveDirection = 'e';

   } 

   if (heroXCentre < getFrameXMin() && currentFrame > 0) {

      pauseTimers();

      gameState = States.movingFrame;

      goalFrame = currentFrame - 1;

      frameMoveDirection = 'w';

   }

}



function getFrameXMax() {return (currentFrame + 1) * frameWidth;}

function getFrameXMin() {return currentFrame * frameWidth;}





function collBox (xPos, yPos, wi, hi) {

   this.x = xPos;

   this.y = yPos;

   this.w = wi;

   this.h = hi;

    

   this.drawBox = function() {

     ctx.strokeStyle = "#FF0000";

     ctx.strokeRect(this.x - getFrameXMin(), this.y, this.w, this.h);

   };

   

   this.yCollide = function(otherBox) {

      //NOTE: Collision directions are with respect to hero

      //TODO: detect other collisions

      if(this.x + this.w > otherBox.x && this.x < otherBox.x + otherBox.w) { 

      

         if(this.y + this.h > otherBox.y && this.y + this.h < otherBox.y + otherBox.h) { 

            return Collisions.south;

         }

         if(this.y < otherBox.y + otherBox.h && this.y > otherBox.y) {

            return Collisions.north;

         }

         if(this.y + this.h >= otherBox.y + otherBox.h && this.y <= otherBox.y) {

            return Collisions.northsouth;

         }

      }

      return Collisions.noColl;

   };

   this.xCollide = function(otherBox) {

      //NOTE: Collision directions are with respect to hero

      //TODO: detect other collisions

      if(this.y + this.h > otherBox.y && this.y < otherBox.y + otherBox.h) {

      

         if(this.x + this.w > otherBox.x && this.x < otherBox.x ) { 

            return Collisions.east;

         }

         if(this.x < otherBox.x + otherBox.w && this.x + this.w > otherBox.x + otherBox.w) {

            return Collisions.west;

         }

         if(this.x >= otherBox.x && this.x + this.w <= otherBox.x + otherBox.w) {

            return Collisions.westeast;

         }

      }

      return Collisions.noColl;

   };

   

};





function platform (posX, posY) {

   this.x = posX;

   this.y = posY;

   this.w = platformWidth;

   this.h = platformHeight;

   this.drawMe = function() {

      if(this.x > getFrameXMax() ||

         this.x + this.w < getFrameXMin()) return;

      ctx.fillStyle="#000000";

      ctx.fillRect(this.x - getFrameXMin(), this.y, this.w, this.h);

   

      ctx.strokeStyle="#FFFFFF";

      ctx.font = "8pt Calibri";

      ctx.strokeText(i, (this.x - getFrameXMin()) + 10, this.y + 10, 50);

   }

};

var platforms = new Array();

//temp

for(i = 0; i <= lastFrame; i++) {

   var n = 5 * i

   platforms[n] = new platform(40 + frameWidth * i, 200);

   platforms[n + 1] = new platform(200 + frameWidth * i, 300);

   platforms[n + 2] = new platform(-100 + frameWidth * i, 180);

   platforms[n + 3] = new platform(300 + frameWidth * i, 200);

   platforms[n + 4] = new platform(350 + frameWidth * i, 180);



}







//GAME ENTITIES

var hero = new heroObj(500, 100);



var updatable = [hero];

//multiple drawable arrays to allow for drawing things in specified order

var drawableA = [hero];

var drawableB = new Array(); //currently just for missiles 

var drawableC = platforms;



//this is a list of objects that need to have their timers modified when the game action is paused, e.g. in the hero's

//case, need to make sure he can't use the pause bottom to cheat and effectively rapidfire

//all objects passed in here must implement an updateTimers(int) function

var timerUpdateObjs = [hero];



var update = function (modifier) {



   if(gameState == States.playing) {

   

      var dead = new Array();

      for(i = 0; i < updatable.length; i++) {

         updatable[i].update(modifier);

         if(updatable[i].dead) {

            dead.push(i);

         }

      }

      //bring out yer dead 

      for(i = 0; i < dead.length; i++) {

         updatable.splice(dead[i],1);

      }

   }

   else if (gameState == States.movingFrame) {

      v_frame = 1.3;

      if(frameMoveDirection == 'e') {

         currentFrame += v_frame * modifier;

         if(currentFrame > goalFrame) {

            currentFrame = goalFrame;

            gameState = States.playing;

            resumeTimers();

         }

      }

      else if(frameMoveDirection == 'w') {

         currentFrame -= v_frame * modifier;

         if(currentFrame < goalFrame) {

            currentFrame = goalFrame;

            gameState = States.playing;

            resumeTimers();

         }

      }

   }

   //if paused, update nothing

   

}



var render = function() {

   

   //background

   if(backdrop_ready) {

      //TODO: pass height and width in a more intelligent way

      ctx.drawImage(backdrop, currentFrame * 50, 0, canvas.width / 2, canvas.height / 2, 0, 0, canvas.width, canvas.height);

      

   } else {

      ctx.fillStyle="#FFFF99";

      ctx.fillRect(0,0,canvas.width,canvas.height);

   }

   

   for(i = 0; i < drawableC.length; i++) {

      drawableC[i].drawMe();

   }

   

   //currently only things in drawableB are capable of dying

   var dead = new Array();   

   for(i = 0; i < drawableB.length; i++) {

      if(drawableB[i].dead) {

         dead.push(i);

         continue;

      }

      drawableB[i].drawMe();

   }

   //bring out yer dead 

   for(i = 0; i < dead.length; i++) {

      drawableB.splice(dead[i],1);

   }

   

   

   for(i = 0; i < drawableA.length; i++) {

      drawableA[i].drawMe();

   }

   

   if(gameState == States.paused) {

      ctx.font = "14pt Calibri";

      ctx.strokeStyle = "#FF0000";

      ctx.fillStyle = "#FF0000";

      var text = "PAUSED";

      var textWidth = 60;

      ctx.fillText(text, (frameWidth / 2) - (textWidth / 2),150,textWidth);

      ctx.strokeText(text, (frameWidth / 2) - (textWidth / 2),150,textWidth);

   }

   

   

   //Temptext

   ctx.strokeStyle = "#FF0000";

   ctx.font = "20pt Calibri";

   ctx.lineWidth = 1;

   ctx.strokeText("Little Green Men", 20,40,1000);

   ctx.lineWidth = 0.5;

   ctx.font = "9pt Calibri";

   ctx.fillStyle = "#FF0000";

   var text = "A game under construction by Laurie Boyes";

   ctx.fillText(text, 20,60,1000);

   ctx.strokeText(text, 20,60,1000);

   ctx.lineWidth = 1;

   

   //debug

   //ctx.strokeText("y: " + hero.heroCollBox.yCollide(platforms[2]), 350, 20, 50)

   //ctx.strokeText("x: " + hero.heroCollBox.xCollide(platforms[2]), 350, 40, 50)

   

}







// The main game loop



var main = function () {



	var now = Date.now();

	var delta = now - then;

   

   update(delta / 1000);

	render();



	then = now;

};



var then = Date.now();

setInterval(main, 16); // Approx 60 fpss


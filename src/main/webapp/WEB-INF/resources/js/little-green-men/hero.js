
function heroObj(x, y) {
   this.v_x = 0;
   this.v_y = 0;
   //w/h of collision box (sprite frame size varies)
   this.w = 10;
   this.h = 34;
   this.heroCollBox = new collBox(x,y,this.w,this.h);
   
   this.inAir = true;
   
   this.moveOneStep = function (modifier) {
      this.setX(this.getX() + (this.v_x * modifier));
      this.setY(this.getY() + (this.v_y * modifier));
      moveViewFrameCheck();
   };
   
   this.moveOneStepCheckColl = function (modifier) {
      
      hero.inAir = true; //assume floating until we get a southcollision
      
      function hitNorth(hero, platform) {
         if(hero.v_y <= 0) {
            hero.v_y = 0; 
            hero.setY(platform.y + platform.h);
         }
      }
      function hitSouth(hero, platform) {
         //check this collision to avoid mucking up case where e.g. we jump up a ledge 
         //holding the direction - we don't want to lose all our up velicity
         if(hero.v_y >= 0) {
            hero.v_y = 0; 
            hero.setY(platform.y - hero.getH());
            hero.inAir = false;
         }
      }
      function hitWest(hero, platform) {
         hero.v_x = 0;
         hero.setX(platform.x + platform.w);
      }
      function hitEast(hero, platform) {
         hero.v_x = 0;
         hero.setX(platform.x - hero.getW());
      }
      
      /*Note this function must check collisions along the movement vector in intervals to avoid missing collidable object
         if the hero is moving too fast
        This check is currently completely hero-centric.
      */
      var aug_x = this.v_x * modifier;
      var aug_y = this.v_y * modifier;
      
      //make this hero height/weight to catch worst case in which where platform/wall is one pixel thick.
      //-1 because i'm paranoid and cba to test this theory in sufficient detail.
      moveInterval = Math.min(this.h, this.w) - 1;
      
      var checkSteps;
      var x_dist = Math.abs(aug_x);
      var y_dist = Math.abs(aug_y);
      var x_interval;
      var y_interval;

      //make this check to avoid doing potentially unnecessary four divisions every single gamestep.
      if(x_dist > moveInterval || y_dist > moveInterval) {
         checkSteps = Math.ceil(Math.max(x_dist / moveInterval,
                                         y_dist / moveInterval));
         x_interval = aug_x / checkSteps;
         y_interval = aug_y / checkSteps;
      } else {
         checkSteps = 1;
         x_interval = aug_x;
         y_interval = aug_y;
      }
      
      /*Stop looping peek intervals once we've found a collision
        But, when we find a collision looping platforms on a particular peek, keep looking
        for other platform collisions on that peek
        Then move on
      */
      var collPlatform;
      var peekPos;
      var xColl;
      var yColl;
      var collision = false;
      var i = 1;
      while(i <= checkSteps && !collision) {
         peekPos = new collBox(this.getX() + x_interval * i,
                               this.getY() + y_interval * i, 
                               this.getW(), this.getH());
                        
         //TODO: loop all collidable objs
         for(j = 0; j < platforms.length; j++) {
            collPlatform = platforms[j];
            xColl = peekPos.xCollide(collPlatform);
            yColl = peekPos.yCollide(collPlatform);
            if(xColl != Collisions.noColl || yColl != Collisions.noColl) {
               
               collision = true;
               
               //collide North of hero
               if (xColl == Collisions.westeast && yColl == Collisions.north) {
                  hitNorth(this, collPlatform);
               }
               //collide South of hero
               if (xColl == Collisions.westeast && yColl == Collisions.south) {
                  hitSouth(this, collPlatform);
               }
               //collide East of hero
               else if (xColl == Collisions.east && yColl == Collisions.northsouth) {
                  hitEast(this, collPlatform);
               }
               //collide West of hero
               else if (xColl == Collisions.west && yColl == Collisions.northsouth) {
                  hitWest(this, collPlatform);
               }
               /*Corner collisions:
                  - get vector between corresponding colliding corners of hero/platform
                  - work out appropriate collision direction based on relative x/y length of vector 
               */
               //collide SE of hero
               else if(xColl == Collisions.east && yColl == Collisions.south) {
                  var vector_x = (peekPos.x + this.getW()) - collPlatform.x;
                  var vector_y = (peekPos.y + this.getH()) - collPlatform.y;
                  if(vector_x >= vector_y) {
                     hitSouth(this, collPlatform);
                  } else {
                     hitEast(this, collPlatform);
                  }
               }
               //collide SW of hero
               else if(xColl == Collisions.west && yColl == Collisions.south) {
                  var vector_x = peekPos.x - (collPlatform.x + collPlatform.w);
                  var vector_y = (peekPos.y + this.getH())- collPlatform.y;
                  if(-vector_x >= vector_y) {
                     hitSouth(this, collPlatform);
                  } else {
                     hitWest(this, collPlatform);
                  }
               }
               //collide NE of hero
               else if(xColl == Collisions.east && yColl == Collisions.north) {
                  var vector_x = (peekPos.x + this.getW()) - collPlatform.x;
                  var vector_y = peekPos.y - (collPlatform.y + collPlatform.h);
                  if(vector_x >= -vector_y) {
                     hitNorth(this, collPlatform);
                  } else {
                     hitEast(this, collPlatform);
                  }
               }
               //collide NW of hero
               else if(xColl == Collisions.west && yColl == Collisions.north) {
                  var vector_x = peekPos.x - (collPlatform.x + collPlatform.w);
                  var vector_y = peekPos.y - (collPlatform.y + collPlatform.h);
                  if(-vector_x >= -vector_y) {
                     hitNorth(this, collPlatform);
                  } else {
                     hitWest(this, collPlatform);
                  }
               }
            }
         }
         i++;
      }

   
      this.moveOneStep(modifier);
   };
   
   this.setX = function (x) { this.heroCollBox.x = x; };
   this.setY = function (y) { this.heroCollBox.y = y; };
   this.getX = function () { return this.heroCollBox.x; };
   this.getY = function () { return this.heroCollBox.y; };
   this.getW = function () { return this.heroCollBox.w; };
   this.getH = function () { return this.heroCollBox.h; };
   
   this.mv_right_held = null,
   this.mv_left_held = null,
   this.jump_start = null,
   this.facing = 'r';
   this.lastShotTime = Date.now();
   this.shootInterval = 400; //milliseconds
   this.missileSpeed = 400;
   
   //called when action is paused with arg for how long
   this.updateTimers = function (addTime) {
      this.lastShotTime += addTime;
   }
   
   this.update = function (modifier) {
      var a = Keys.a in keysDown || Keys.A in keysDown;
      var d = Keys.d in keysDown || Keys.D in keysDown;
      var w = Keys.w in keysDown || Keys.W in keysDown;
      var shoot = Keys.l in keysDown || Keys.L in keysDown; //shoot is currently L but maybe this should change
      
      if (a && !d) { // Player holding left
         this.v_x = -100;
         if(!this.mv_left_held){
            this.mv_right_held = null;
            this.mv_left_held = Date.now();
         }
         this.facing = 'l';
      } else if (d && !a) { // Player holding right
         this.v_x = 100;
         if(!this.mv_right_held){
            this.mv_right_held = Date.now();
            this.mv_left_held = null;
         }
         this.facing = 'r';
      } else { 
         this.v_x = 0;
         this.mv_right_held = null;
         this.mv_left_held = null;
      }
      
      //jumping
      if(w && !this.inAir) {
         this.v_y = -200;
         this.jump_start = Date.now();
         playSound("jump");
      }
      
      //shooting
      var canShoot = (Date.now() - this.lastShotTime > this.shootInterval);
      if(shoot && canShoot) {
         this.lastShotTime = Date.now();
         //make a bullet (pewpew)
         var missileX; //these values are approximations - get proper position of gunbarrel?
         var missileY = this.getY() + 14;
         var missileV_X;
         if(this.facing == 'r') {
            missileX = this.getX() + this.getW();
            missileV_X = this.missileSpeed;
         } else {
            missileX = this.getX();
            missileV_X = -this.missileSpeed;
         }
         
         var newMissile = new missile (missileX, missileY, missileV_X, 'm', Date.now());
         
         updatable.push(newMissile); //must make sure this is properly deleted when appropriate
         drawableB.push(newMissile);
         
         playSound("shootm");
      }
      
      //gravity
      this.v_y += gravity * modifier;      
      this.moveOneStepCheckColl(modifier);
   };
   
   this.currentSprite = sprites.hero_stand_right; //default
   this.drawMe = function () {
      if(sprites_ready) {
         //sprite attribs (for quick reference): x, y, w, h, x_off, y_off
         var s;
         
         if(gameState == States.playing) {
            if(!this.inAir){ 
               if(this.mv_right_held == null && this.mv_left_held == null) {
                  if (this.facing == 'r') { s = sprites.hero_stand_right; }
                  else if (this.facing == 'l') { s = sprites.hero_stand_left; }
                  else {console.log("Value for facing set to something that wasn't l or r. Resetting to r"); this.facing = 'r'; s = sprites.hero_stand_right;}
               } else if (this.mv_right_held != null) {
                  s = loopAnimate(9, sprites.hero_walk_right, this.mv_right_held);
               } else if (this.mv_left_held != null) {
                  s = loopAnimate(9, sprites.hero_walk_left, this.mv_left_held);
               }
            } else {//inAir
               if(this.v_y >= 0) { //descending jump              

                  if(this.facing == 'r') {s = sprites.hero_descend_right; }
                  else if (this.facing == 'l') { s = sprites.hero_descend_left; }
                  else {console.log("Defaulting to r in descend"); this.facing = 'r'; s = sprites.hero_descend_right; }
                  
               } else { //ascending in jump
                  if(this.facing == 'r') {s = sprites.hero_ascend_right; }
                  else if (this.facing == 'l') { s = sprites.hero_ascend_left; }
                  else {console.log("Defaulting to r in descend"); this.facing = 'r'; s = sprites.hero_ascend_right; }
               }
            }
            this.currentSprite = s; 
         
         } else { //paused/movingFrame
            s = this.currentSprite;
         }
         var xPos = this.getX() + s.x_off - getFrameXMin();
         var yPos = this.getY() + s.y_off;
         //Make sure it aligns at all times to avoid antialiasing. This is extra important with the special draw function
         //it will antialias between the pixels and look weird
         xPos = Math.round(xPos);
         yPos = Math.round(yPos);
         
         ctx.drawImage(spriteSheet, s.getX(), s.getY(), s.getW(), s.getH(), xPos, yPos, s.getW(), s.getH());
      }
      if(drawCollBoxes){
         this.heroCollBox.drawBox();
      }
   };
};
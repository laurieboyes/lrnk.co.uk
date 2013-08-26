//should really use an enum for this last attribute
function missile (x, y, v_x, size, initTime) {
   this.v_x = v_x;
   this.size = size;
   this.collBoxSize;
   this.sprite;
   this.currentSprite;
   this.dead = false;
   this.initTime = initTime; //for selection of animation
   switch (size)
   {
      case 's':
         this.collBoxSize = 2;
         this.sprite = (v_x >= 0)? sprites.s_missile_right : sprites.s_missile_left;
         break;
      case 'm':
         this.collBoxSize = 4;
         this.sprite = (v_x >= 0)? sprites.m_missile_right : sprites.m_missile_left;
         break;
      case 'l':
         this.collBoxSize = 6;
         this.sprite = (v_x >= 0)? sprites.l_missile_right : sprites.l_missile_left;
         break;
      default: console.log("invalid missle size: " + size); break;
   }
   this.collBox = new collBox(x, y, this.collBoxSize, this.collBoxSize);
   
   
   this.getX = function () { return this.collBox.x; }
   this.getY = function () { return this.collBox.y; }
   
   this.update = function (modifier) {
      this.collBox.x += v_x * modifier;
      //kill any bullet that goes more than a frame out of view
      if(this.getX() > getFrameXMax() + frameWidth ||
         this.getX() < getFrameXMin() - frameWidth) {
         this.dead = true;
      }
   };
   this.drawMe = function () {
      var s;
         
      if(gameState == States.playing) {
         s = loopAnimate(7, this.sprite, initTime)
         this.currentSprite = s;
      } else {
         s = this.currentSprite;
      }
      
      if(this.currentSprite != undefined) {
         var xPos = this.getX() + s.x_off;
         var yPos = this.getY() + s.y_off;
         xPos = Math.round(xPos);
         yPos = Math.round(yPos);
         ctx.drawImage(spriteSheet, s.getX(), s.getY(), s.getW(), s.getH(), xPos - getFrameXMin(), yPos, s.getW(), s.getH());
      }
      
      if(drawCollBoxes){
         this.collBox.drawBox();
      }
   };
}
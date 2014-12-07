function Head (position_, angle_, front_)
{
	// Display Logic
	this.front = front_;
	this.position = position_;
	this.angle = angle_;
	this.direction = new Vec2(Math.cos(this.angle), Math.sin(this.angle));
	this.scaleMouth = 0.75;// + (Math.random() > 0.5 ? 0.5 : 0);
	this.scaleEar = 0.75;//0.37 + (Math.random() > 0.5 ? 0.37 : 0);
	this.scaleEyes = 0.75;

	// Animation Logic
	this.animationDelay = 1;
	this.animationElapsed = timeElapsed;
	this.speakDelay = animationDelay;
	this.speakElapsed = timeElapsed;
	this.listenTimeStartLeft = 0;
	this.listenTimeStartRight = 0;
	this.listenTimeDelay = 0.2;

	// Head
	this.spriteHead = new PIXI.Graphics();
	this.spriteHead.x = this.position.x;
	this.spriteHead.y = this.position.y;
	//this.spriteHead.width = this.spriteHead.height = sizeHead;
	/*this.spriteHead.beginFill(0xffffff);
	this.spriteHead.lineStyle(2, 0x000000);
	this.spriteHead.drawCircle(0, 0, sizeHead);
	this.spriteHead.endFill(); */   
	this.spriteHead.rotation = this.front ? this.angle - pi/2 : this.angle + pi;
	this.directionHead = new Vec2(Math.cos(this.spriteHead.rotation), Math.sin(this.spriteHead.rotation));
	stage.addChild(this.spriteHead);

	// Visage
	this.spriteVisage = new PIXI.Sprite(textureHead);
	this.spriteVisage.anchor.x = this.spriteVisage.anchor.y = 0.5;
	this.spriteVisage.width = this.spriteVisage.height = sizeHead * 3;
	this.spriteHead.addChild(this.spriteVisage);

	// Eyes
	this.spriteEyes = new PIXI.Sprite(TextureEyes());
	this.spriteEyes.anchor.x = this.spriteEyes.anchor.y = 0.5;
	this.spriteEyes.scale.x = this.spriteEyes.scale.y = this.scaleEyes;
	this.spriteEyes.x = 0;//(this.front ? 0 : -sizeHead);
	this.spriteEyes.y = -sizeHead * 0.5;//(this.front ? -sizeHead * 0.5 : 0);
	this.spriteHead.addChild(this.spriteEyes);

	// Ears
	this.textureEar = this.front ? TextureEarFront() : TextureEarSide();
	
	// Ear Left
	if (this.front)
	{
		this.spriteEarLeft = new PIXI.Sprite(this.textureEar);
		this.spriteEarLeft.anchor.x = 0.5;
		this.spriteEarLeft.anchor.y = 0.5;
		//this.spriteEarLeft.y = this.position.y;// - sizeHead/2;
		this.spriteEarLeft.scale.x *= this.scaleEar;
		this.spriteEarLeft.scale.y *= this.scaleEar;
		this.spriteEarLeft.x = - sizeHead;
		this.spriteHead.addChild(this.spriteEarLeft);
	}

	// Ear Right
	this.spriteEarRight = new PIXI.Sprite(this.textureEar);
	this.spriteEarRight.anchor.x = this.spriteEarRight.anchor.y = 0.5;
	this.spriteEarRight.scale.x = -1;
	this.spriteEarRight.x = sizeHead;
	//this.spriteEarRight.y = this.position.y;// - sizeHead/2;
	this.spriteEarRight.scale.x *= this.scaleEar;
	this.spriteEarRight.scale.y *= this.scaleEar;
	this.spriteHead.addChild(this.spriteEarRight);
	
	// Mouth
	this.spriteMouth = new PIXI.Sprite(this.front ? TextureMouthFront() : TextureMouthSide());
	this.spriteMouth.anchor.x = this.spriteMouth.anchor.y = 0.5;
	this.spriteMouth.x = (this.front ? 0 : -sizeHead);
	this.spriteMouth.y = (this.front ? sizeHead * 0.5 : 0);
	this.spriteMouth.scale.x *= this.scaleMouth;
	this.spriteMouth.scale.y *= this.scaleMouth;
	this.spriteHead.addChild(this.spriteMouth);
     
    if (this.front)
    {
   		// Drag & Drop
	    this.spriteHead.interactive = true;
	    this.spriteHead.buttonMode = true;
	    this.spriteHead.mousedown = function(data)
		{
		    eventData = data;
		    dragged = this;
		    dragging = true;
			//stage.setChildIndex(this, stage.children.length - 1);
		};
    }

	this.Update = function (delta)
	{

		// Ear Animations

		if (this.front) {
			var ratioLeft = (timeElapsed - this.listenTimeStartLeft) / this.listenTimeDelay;
			ratioLeft = Math.max(0, Math.min(1, ratioLeft));
			var stretchLeft = Math.sin(ratioLeft * pi2) * 0.25 * (1 - ratioLeft);
			this.spriteEarLeft.scale.x = this.scaleEar + stretchLeft;
			this.spriteEarLeft.scale.y = this.scaleEar - stretchLeft;
		}
		
		var ratioRight = (timeElapsed - this.listenTimeStartRight) / this.listenTimeDelay;
		ratioRight = Math.max(0, Math.min(1, ratioRight));
		var stretchRight = Math.sin(ratioRight * pi2) * 0.25 * (1 - ratioRight);
		this.spriteEarRight.scale.x = -(this.scaleEar + stretchRight);
		this.spriteEarRight.scale.y = this.scaleEar - stretchRight;

		if (this.animationElapsed + this.animationDelay < timeElapsed)
		{
			this.animationElapsed = timeElapsed;
			this.spriteEyes.texture = TextureEyes();
		}

		//this.spriteEarLeft.rotation = Math.sin(ratioLeft * 8) * pi/2 * (1 - ratioLeft);
		//this.spriteEarRight.rotation = Math.sin(ratioRight * 8) * pi/2 * (1 - ratioRight);
	}

	this.GetPosition = function () { return new Vec2(this.spriteHead.x, this.spriteHead.y); }

	this.GetPositionEarLeft = function () { return new Vec2(
		this.spriteHead.x - sizeHead * this.direction.y, 
		this.spriteHead.y + sizeHead * this.direction.x); }

	this.GetPositionEarRight = function () { return new Vec2(
		this.spriteHead.x + (this.front ? sizeHead * this.direction.y : -sizeHead * this.direction.x), 
		this.spriteHead.y + (this.front ? -sizeHead * this.direction.x : sizeHead * this.direction.y)); }

	this.GetPositionMouth = function () { return new Vec2(
		this.spriteHead.x + (this.front ? sizeHead * this.direction.x : - this.spriteMouth.x * this.direction.x), 
		this.spriteHead.y + sizeHead * this.direction.y); }

	this.CanHearLetterFrom = function (letterPosition_)
	{
		if (this.front && distance(letterPosition_, this.GetPositionEarLeft()) <= sizeHear) {
			return 1;
		}
		if (distance(letterPosition_, this.GetPositionEarRight()) <= sizeHear) {
			return 2;
		}
		return 0;
	}

	this.HitTestLetter = function (letterPosition_)
	{
		return distance(letterPosition_, this.spriteHead) <= sizeHead * 0.9;
	}

	this.Speak = function ()
	{
		if (this.speakElapsed + this.speakDelay < timeElapsed)
		{
			this.speakElapsed = timeElapsed;
			this.spriteMouth.texture = this.front ? TextureMouthFront() : TextureMouthSide();
		}
	}
	this.SayLetter = function (letter)
	{
		SpawnLetter(letter, this.GetPositionMouth(), this.direction);
	}

	this.ListenLeft = function ()
	{
		this.listenTimeStartLeft = timeElapsed;
	}

	this.ListenRight = function ()
	{
		this.listenTimeStartRight = timeElapsed;
	}
}
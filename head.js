function Head (position_, angle_, front_)
{
	// Display Logic
	this.front = front_;
	this.position = position_;
	this.angle = angle_;
	this.direction = new Vec2(Math.cos(this.angle), Math.sin(this.angle));
	this.scaleMouth = 0.75;// + (Math.random() > 0.5 ? 0.5 : 0);
	this.scaleEar = 0.75;//0.37 + (Math.random() > 0.5 ? 0.37 : 0);

	// Head
	this.spriteHead = new PIXI.Graphics();
	this.spriteHead.x = this.position.x;
	this.spriteHead.y = this.position.y;
	this.spriteHead.beginFill(0xffffff);
	this.spriteHead.lineStyle(2, 0x000000);
	this.spriteHead.drawCircle(0, 0, sizeHead);
	this.spriteHead.endFill();    
	this.spriteHead.rotation = this.front ? this.angle - pi/2 : this.angle + pi;
	stage.addChild(this.spriteHead);

	this.textureEar = this.front ? TextureEarFront() : TextureEarSide();
	
	// Ear Left
	if (this.front)
	{
		this.spriteEarLeft = new PIXI.Sprite(this.textureEar);
		this.spriteEarLeft.anchor.x = this.spriteEarLeft.anchor.y = 0.5;
		this.spriteEarLeft.x = - sizeHead;
		//this.spriteEarLeft.y = this.position.y;// - sizeHead/2;
		this.spriteEarLeft.scale.x *= this.scaleEar;
		this.spriteEarLeft.scale.y *= this.scaleEar;
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

	this.animationDelay = animationDelay;
	this.animationElapsed = timeElapsed;

	this.Update = function ()
	{
	}

	this.GetPositionEarLeft = function () { return new Vec2(this.spriteHead.x - sizeHead * this.direction.y, this.spriteHead.y + sizeHead * this.direction.x); }
	this.GetPositionEarRight = function () { return new Vec2(this.spriteHead.x + sizeHead * this.direction.y, this.spriteHead.y - sizeHead * this.direction.x); }
	this.GetPositionMouth = function () { return new Vec2(this.spriteHead.x - this.spriteMouth.x * this.direction.x, this.spriteHead.y + this.spriteMouth.y * this.direction.y); }

	this.CanHearLetterFrom = function (letterPosition_)
	{
		return distance(letterPosition_, this.GetPositionEarRight()) <= sizeHear || (this.front && distance(letterPosition_, this.GetPositionEarLeft()) <= sizeHear);
	}

	this.HitTestLetter = function (letterPosition_)
	{
		return distance(letterPosition_, this.spriteHead) < sizeHead;
	}

	this.Speak = function ()
	{
		if (this.animationElapsed + this.animationDelay < timeElapsed)
		{
			this.animationElapsed = timeElapsed;
			this.spriteMouth.texture = this.front ? TextureMouthFront() : TextureMouthSide();
		}
	}
	this.SayLetter = function (letter)
	{
		SpawnLetter(letter, this.GetPositionMouth(), this.direction);
	}
}
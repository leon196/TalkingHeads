function Letter (character_, position_, direction_)
{
	// Character
	this.character = character_;

	// Display logic
	this.position = position_;
	this.direction = direction_;
	this.speed = 200;
	this.scale = 0.3;

	// Game Logic
	this.heads = [];
	this.repeated = 0;

	// Animation logic
	this.listening = false;
	this.listenTimeStart = 0;
	this.listenTimeDelay = 0.2;
	this.pronouncing = false;
	this.pronounceTimeStart = 0;
	this.pronounceTimeDelay = 0.2;
	this.falling = false;
	this.fallTimeStart = 0;
	this.head;

	this.spriteLetter = new PIXI.Sprite(Asset.TextureLetter(this.character));
	this.spriteLetter.anchor.x = this.spriteLetter.anchor.y = 0.5;
	this.spriteLetter.x = this.position.x;
	this.spriteLetter.y = this.position.y;
	this.spriteLetter.scale.x = this.spriteLetter.scale.y = this.scale;
	layerLetter.addChild(this.spriteLetter);

	this.Update = function (delta)
	{
		// Fall
		if (this.falling) {
			this.position.x += this.velocity.x * delta * this.speed;
			this.position.y += this.velocity.y * delta * this.speed;
			this.velocity.y += delta * gravity;
		} 
		// Listening
		else if (this.listening) {
			var ratio = (timeElapsed - this.listenTimeStart) / this.listenTimeDelay;
			ratio = Math.max(0, Math.min(1, ratio));
			this.spriteLetter.scale.x = this.spriteLetter.scale.y = this.scale * (1 - ratio);

			if (ratio >= 1)
			{
				this.pronouncing = true;
				this.listening = false;
				this.pronounceTimeStart = timeElapsed;
				this.position = this.head.GetPositionMouth();
				this.direction = this.head.direction;
			}
		}
		// Pronoucing
		else if (this.pronouncing) {

			var ratio = (timeElapsed - this.pronounceTimeStart) / this.pronounceTimeDelay;
			ratio = Math.max(0, Math.min(1, ratio));
			this.spriteLetter.scale.x = this.spriteLetter.scale.y = this.scale * ratio;

			if (ratio >= 1)
			{
				this.pronouncing = false;
				this.head.Speak();
				this.head = null;
			}
		}
		// Move
		//else {
			this.position.x += this.direction.x * delta * this.speed;
			this.position.y += this.direction.y * delta * this.speed;
		//}

		this.spriteLetter.x = this.position.x;
		this.spriteLetter.y = this.position.y;
	}

	this.IsOutOfScreen = function ()
	{
		return this.position.x < -sizeLetter || this.position.x > windowWidth + sizeLetter || this.position.y < -sizeLetter || this.position.y > windowHeight + sizeLetter;
	}

	this.Clear = function ()
	{
		this.spriteLetter.parent.removeChild(this.spriteLetter);
	}

	this.Fall = function (direction_)
	{
		this.falling = true;
		this.fallTimeStart = timeElapsed;
		this.velocity = new Utils.Vec2(
			direction_.x * (1 + Math.random() * letterCollisionStrength), 
			direction_.y * (1 + Math.random() * letterCollisionStrength));
	}

	this.StartListening = function (head)
	{
		this.listening = true;
		this.listenTimeStart = timeElapsed;
		this.head = head;
		if (this.heads.indexOf(head) == -1)
		{
			this.heads.push(head);
			++this.repeated;	
		}
	}
}
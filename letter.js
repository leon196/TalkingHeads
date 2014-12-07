function Letter (character_, position_, direction_)
{
	// Character
	this.character = character_;

	// Display logic
	this.position = position_;
	this.direction = direction_;
	this.speed = 200;

	// Animation logic
	this.falling = false;
	this.fallTimeStart = 0;

	this.spriteLetter = new PIXI.Sprite(TextureLetter(this.character));
	this.spriteLetter.anchor.x = this.spriteLetter.anchor.y = 0.5;
	this.spriteLetter.x = this.position.x;
	this.spriteLetter.y = this.position.y;
	this.spriteLetter.scale.x = this.spriteLetter.scale.y = 0.5;
	stage.addChild(this.spriteLetter);

	this.Update = function (delta)
	{

		if (this.falling) {
			
		}

		this.position.x += this.direction.x * delta * this.speed;
		this.position.y += this.direction.y * delta * this.speed;

		this.spriteLetter.x = this.position.x;
		this.spriteLetter.y = this.position.y;
	}

	this.IsOutOfScreen = function ()
	{
		return this.position.x < -sizeLetter || this.position.x > windowWidth + sizeLetter || this.position.y < -sizeLetter || this.position.y > windowHeight + sizeLetter;
	}

	this.Clear = function ()
	{
		stage.removeChild(this.spriteLetter);
	}

	this.Fall = function ()
	{
		falling = true;
		letters[i].fallTimeStart = timeElapsed;
	}
}
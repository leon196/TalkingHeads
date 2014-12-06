function Head ()
{
	this.front = true;
	this.position = RandomSpawnPositionVec3();
	
	this.spriteMouth = new PIXI.Sprite(TextureMouthFront());
	this.spriteMouth.x = this.position.x;
	this.spriteMouth.y = this.position.y;
	stage.addChild(this.spriteMouth);
	
	this.spriteEarLeft;
	this.spriteEarRight;

	this.animationDelay = animationDelay;
	this.animationElapsed = timeElapsed;

	this.Update = function ()
	{
		if (this.animationElapsed + this.animationDelay < timeElapsed)
		{
			this.animationElapsed = timeElapsed;
			this.spriteMouth.texture = TextureMouthFront();
		}
	}
}
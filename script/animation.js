
var textLetters = [];

var animationElapsed = 0;
var animationDelay = 0.2;

var winningTimeDelay = 5;

var currentClap = 0;

var letterCollisionStrength = 4;
var gravity = 9;

function Timing (delay_, onUpdate_, onComplete_)
{
	this.timeStart = -1000;
	this.timeDelay = delay_;
	this.onUpdate = onUpdate_;
	this.onComplete = onComplete_;
	this.end = false;
	
	this.Start = function ()
	{
		this.timeStart = timeElapsed;
		this.end = false;
	}

	this.GetRatioTimeline = function ()
	{
		return Math.max(0, Math.min(1, (timeElapsed - this.timeStart) / this.timeDelay));
	}

	this.Update = function ()
	{
		this.onUpdate(timeElapsed - this.timeStart, this.GetRatioTimeline());
		if (this.GetRatioTimeline() == 1 && !this.end) {
			this.end = true;
			if (typeof this.onComplete != "undefined" ) {
				this.onComplete();
			}
		}
	}
} 

// Victory animation
var animationVictory = new Timing(winningTimeDelay, 
	function(elapsed, ratio) {
		hoho.y = windowHeight - hoho.height * Math.sin((1 - ratio) * pi);
	},
	function() {
		Game.Restart();
	});

var Animation = {};

Animation.ShowUpVictory = function ()
{
	// Characters
	animationVictory.Update();

    // Thumb
    thumb.rotation = Math.cos(timeElapsed * 20) * pi / 16;

    // Clap
    if (animationElapsed + animationDelay < timeElapsed) 
    {
    	animationElapsed = timeElapsed;
    	currentClap = (currentClap + 1) % 2;
        clap.texture = textureListClap[currentClap];
    }
};

var animationText = new Timing(3,
	function(elapsed, ratio) {
		var letterCount = textLetters.length;
		var step = 1 / (letterCount * 2);
		for (var i = 0; i < letterCount; ++i)
		{
			var letter = textLetters[i];
			var r = i/letterCount;
			letter.scale.x = letter.scale.y = Math.sin(Utils.SmoothStep(i * step, 1, ratio) * pi);
		}
	});

Animation.SetupText = function (text_)
{
	textLetters = [];
	layerText.removeChildren();
	var textArray = text_.toLowerCase().split("");
	var letterCount = textArray.length;
	var w = letterCount * 64;
	var y = windowHeight / 2;
	for (var i = 0; i < letterCount; ++i)
	{
		var textureLetter = Asset.TextureLetter(textArray[i]);
		if (textureLetter != null)
		{
			var sprite = new PIXI.Sprite(textureLetter);
			sprite.anchor.x = sprite.anchor.y = 0.5;
			sprite.x = windowWidth / 2 - w / 2 + w * ((i+1) / (letterCount+1));
			sprite.y = y;
			sprite.scale.x = sprite.scale.y = 0;
			layerText.addChild(sprite);
			textLetters.push(sprite);
		}
	}
	animationText.Start();
};

Animation.ShowText = function ()
{

}

Animation.Clap = function ()
{
};
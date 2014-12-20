
// Timing
var timeScale = 0.001;
var timeStarted = new Date() * timeScale;
var timeElapsed = 0;
var timeDelta = 0;

// State
var state = 0;

var winning = false;

// Layers
var layerHead = new PIXI.DisplayObjectContainer();
var layerLetter = new PIXI.DisplayObjectContainer();
var layerOverlay = new PIXI.DisplayObjectContainer();
var layerText = new PIXI.DisplayObjectContainer();

var Game = {};

Game.Start = function ()
{
	stage.addChild(layerHead);
	stage.addChild(layerLetter);
	stage.addChild(layerOverlay);
	stage.addChild(layerText);
	
	Level.StartNewLevel();

	Animation.SetupText("welcome");
}

Game.Restart = function ()
{
	Level.Reset();
	Level.StartNewLevel();
}

Game.Update = function () 
{
	// Timing
    timeDelta = (new Date() * timeScale - timeStarted) - timeElapsed;
	timeElapsed = new Date() * timeScale - timeStarted;

	//
	Level.Update(timeDelta);

	//
	animationText.Update();

	if (winning)
	{
		Animation.ShowUpVictory();
	}

    // Render
    renderer.render(stage);
    requestAnimFrame(Game.Update);
}


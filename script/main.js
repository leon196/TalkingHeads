// Dimension
var windowWidth, windowHeight, dimensionMin;

// Grid
var gridDimension = 4;
var gridMargin, gridSize, gridAnchor, gridCellSize;

// Global Sizes
var sizeHead = 48;
var sizeLetter = 24;
var sizeHear = 32;

// Setup Pixi
var stage = new PIXI.Stage();
var renderer = PIXI.autoDetectRenderer(windowWidth, windowHeight);

// Keyboard Event
window.addEventListener('keyup', onKeyUp, true);
window.addEventListener("resize", OnResize);

function onKeyUp (event)
{
	if (event.keyCode == 82)
	{
		Game.Restart();
	}
}

function OnResize (event)
{
	var ratioX = window.innerWidth / windowWidth;
	var ratioY = window.innerHeight / windowHeight;

	Engine.Resize();
	UI.Resize();
	Level.Resize(ratioX, ratioY);
}

function CloseMessage ()
{
	window.document.getElementById("info").style.visibility = "hidden";
}

// Pixi Loader
var loader = new PIXI.AssetLoader(assets);

var Engine = {};

Engine.Resize = function  ()
{
	// Dimensions
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;
	dimensionMin = Math.min(windowWidth, windowHeight);

	// Grid
	gridMargin = dimensionMin / 16;
	gridSize = (dimensionMin - gridMargin * 2);
	gridAnchor = new Utils.Vec2((windowWidth - gridSize) / 2 + gridMargin, (windowHeight - gridSize) / 2 + gridMargin);
	gridCellSize = gridSize / gridDimension;

	// Global Sizes
	sizeHead = 48;
	sizeLetter = 24;
	sizeHear = 32;

	// Pixi Resize
	renderer.resize(windowWidth, windowHeight);
}

Engine.Start = function ()
{
	// Resize Screen
	Engine.Resize();

	// Start Everything
	Asset.onAssetsLoaded();
	UI.Setup();
	UI.Resize();
	Game.Start();

	// Add the canvas to the div element
	var div = document.getElementById("screen");
	div.appendChild(renderer.view);

	// Start Game Loop
	requestAnimFrame( Game.Update );
}

// Set callback and start loading
loader.onComplete = Engine.Start;
loader.load();
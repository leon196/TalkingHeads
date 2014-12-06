// Setup Pixi
var stage = new PIXI.Stage(0xeddfb4);
var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
var game = document.getElementById("game");
game.appendChild(renderer.view);

// Load Images
var assets = [ "assets.png", "fonts.png", "assets.json", "fonts.json" ];
var loader = new PIXI.AssetLoader(assets);
loader.onComplete = onAssetsLoaded;
loader.load();

// Game Elements

function onAssetsLoaded ()
{
	mouthList.push();
}
// Sizes
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
var marginWidth = 128;
var marginHeight = 128;

// Setup Pixi
var stage = new PIXI.Stage(0xeddfb4);
var renderer = PIXI.autoDetectRenderer(windowWidth, windowHeight);
var game = document.getElementById("game");
game.appendChild(renderer.view);

// Game Elements
var heads = [];

// Animation
var timeScale = 0.001;
var timeStarted = new Date() * timeScale;
var timeElapsed = 0;
var animationElapsed = 0;
var animationDelay = 0.1;

// Load Images
var assets = [ "assets.png", "assets.json"];//, "font.json" ];
var loader = new PIXI.AssetLoader(assets);
loader.onComplete = onAssetsLoaded;
loader.load();

// Setup Textures
var textureListMouthFront, textureListMouthSide, textureListEarFront, textureListEarSide, textureListLetter;
function onAssetsLoaded ()
{
	textureListMouthFront = LoadFrames("mouthFront", 10);

	for (var i = 0; i < 4; ++i){
		heads.push(new Head());
	}

	// Start Game Loop
	requestAnimFrame( animate );
}
function LoadFrames (tag, count)
{
	var textureList = [];
	for (var i = 0; i < count; ++i) {
		var frameName = tag + i;
		textureList.push(PIXI.Texture.fromFrame(frameName));
	}
	return textureList;
}
function TextureMouthFront () { return textureListMouthFront[Math.floor(Math.random()*textureListMouthFront.length)]; }

// Game Loop
function animate() 
{
	timeElapsed = new Date() * timeScale - timeStarted;

    requestAnimFrame( animate );

    for (var i = 0; i < heads.length; ++i) {
    	var head = heads[i];
    	head.Update();
    }

    // render the stage  
    renderer.render(stage);
}
function Vec3 (x_, y_)
{
	this.x = x_;
	this.y = y_;
}
function RandomVec3 ()
{
	return new Vec3(Math.random(), Math.random());
}
function RandomSpawnPositionVec3 ()
{
	return new Vec3(
		marginWidth + Math.random() * (windowWidth - marginWidth * 2), 
		marginHeight + Math.random() * (windowHeight - marginHeight * 2));
}
// Maths
var pi = 3.1415926535897932384626433832795;
var pi2 = 6.283185307179586476925286766559;

// Sizes
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
var marginWidth = 128;
var marginHeight = 128;
var grid = new Vec2(4, 4);
var sizeHead = 64;
var sizeLetter = 32;
var sizeHear = 32;

// Setup Pixi
var stage = new PIXI.Stage(0xeddfb4);
var renderer = PIXI.autoDetectRenderer(windowWidth, windowHeight);
var game = document.getElementById("game");
game.appendChild(renderer.view);

// Controls
var dragged = null;
var dragging = false;
var eventData = null;

// Game Elements
var speaker, listener;
var heads = [];
var letters = [];
var lettersGarbage = [];

//
var gravity = 9;

// Timing
var timeScale = 0.001;
var timeStarted = new Date() * timeScale;
var timeElapsed = 0;
var timeDelta = 0;
var letterElapsed = 0;
var letterDelay = 0.2;
var animationElapsed = 0;
var animationDelay = 0.1;

// Load Images
var assets = [ "assets.png", "assets.json", "font.png", "font.json" ];
var font = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "!", "?", "."];
var loader = new PIXI.AssetLoader(assets);
loader.onComplete = onAssetsLoaded;
loader.load();

// Setup Textures
var textureListMouthFront, textureListMouthSide, textureListEarFront, textureListEarSide, textureListLetter;
function onAssetsLoaded ()
{
	textureListLetter = LoadFont();
	textureListMouthFront = LoadFrames("mouthFront", 10);
	textureListMouthSide = LoadFrames("mouthSide", 10);
	textureListEarFront = LoadFrames("earFront", 7);
	textureListEarSide = LoadFrames("earSide", 8);

	// Setup Game
	speaker = new Head(new Vec2(windowWidth, windowHeight*0.2), pi, false);
	listener = new Head(new Vec2(0, windowHeight*0.8), pi, false);
	GenerateHeads();

	// Start Game Loop
	requestAnimFrame( animate );
}

function GenerateHeads ()
{
	var count = 4;
	var randomList = [];
	for (var i = 0; i < grid.x * grid.y; ++i) { randomList[i] = i; }
	randomList = shuffle(randomList);
	var randomList2 = [];
	for (var i = 0; i < 4; ++i) { randomList2[i] = i; }
	randomList2 = shuffle(randomList2);
	for (var i = 0; i < count; ++i) {
		var rand = randomList[i];
		var x = windowWidth * (rand % grid.x) / grid.x;
		var y = windowHeight * Math.floor(rand / grid.x) / grid.y;
		// Add Head
		heads.push(new Head(GridPositionVec2(x, y), pi2 * randomList2[i % 4] / 4, true));
	}
}

function SpawnLetter (character_, position_, direction_)
{
	var direction = new Vec2(1, 0);
	if (lettersGarbage.length > 0) {
		letters[lettersGarbage[0]] = new Letter(character_, position_, direction_);
		lettersGarbage.splice(0, 1);
	} else {
		letters.push(new Letter(character_, position_, direction_));
	}
}

// Game Loop
function animate() 
{
    timeDelta = (new Date() * timeScale - timeStarted) - timeElapsed;
	timeElapsed = new Date() * timeScale - timeStarted;

	// Update Heads
    for (var i = 0; i < heads.length; ++i) {
    	var head = heads[i];
    	head.Update(timeDelta);
    }

    // Update Speaker
    speaker.Speak();

	// Spawn Letters
	if (letterElapsed + letterDelay < timeElapsed) {
		letterElapsed = timeElapsed;
		speaker.SayLetter(RandomLetter());
	}
    // Update Letters
    for (var i = 0; i < letters.length; ++i) {
    	var letter = letters[i];
    	if (letter != null) {
    		// Update
	    	letter.Update(timeDelta);
	    	// Recycle
	    	if (letter.IsOutOfScreen()) {
	    		letter.Clear();
	    		letters[i] = null;
	    		lettersGarbage.push(i);
	    	} 
	    	// Check Collisions
	    	else if (!letter.falling && !letter.listening && !letter.pronouncing) {
				// Final listener
				if (listener.CanHearLetterFrom(letter.position)) {
					// Clear letter
		    		letter.Clear();
		    		letters[i] = null;
		    		lettersGarbage.push(i)
				}
				for (var j = 0; j < heads.length; ++j) {
					var head = heads[j];
					// Ears
					var ear = head.CanHearLetterFrom(letter.position);
					if (ear > 0) 
					{
						letters[i].StartListening(head);
						if (ear == 1) head.ListenLeft();
						else head.ListenRight();
			    		break;
					}
					// Head
					else if (head.HitTestLetter(letter.position)) {
						letters[i].Fall(direction(head.GetPosition(), letter.position));
			    		break;
					}
				}
	    	}
    	}
    }

    // Render
    renderer.render(stage);
    requestAnimFrame(animate);
}
// Controls
stage.mousedown = function(data)
{
	data.originalEvent.preventDefault();
};
stage.mouseup = function(data)
{
    dragging = false;
    eventData = null;
};
stage.mousemove = function(data)
{
    if (dragging && dragged != null)
    {
    	var mousePosition = eventData.getLocalPosition(dragged.parent);
        dragged.x = mousePosition.x;
        dragged.y = mousePosition.y;
    }
}; 

// Textures
function LoadFont ()
{
	var textureList = [];
	for (var i = 0; i < font.length; ++i) textureList.push(PIXI.Texture.fromFrame(font[i]));
	return textureList;
}
function LoadFrames (tag, count)
{
	var textureList = [];
	for (var i = 0; i < count; ++i) textureList.push(PIXI.Texture.fromFrame(tag + i));
	return textureList;
}
function TextureMouthFront () { return textureListMouthFront[Math.floor(Math.random()*textureListMouthFront.length)]; }
function TextureMouthSide () { return textureListMouthSide[Math.floor(Math.random()*textureListMouthSide.length)]; }
function TextureEarFront () { return textureListEarFront[Math.floor(Math.random()*textureListEarFront.length)]; }
function TextureEarSide () { return textureListEarSide[Math.floor(Math.random()*textureListEarSide.length)]; }

function TextureLetter (letter_) { return textureListLetter[font.indexOf(letter_)]; }
function RandomLetter () { return font[Math.floor(Math.random() * font.length)]; }

// Utils
function Vec2 (x_, y_)
{
	this.x = x_;
	this.y = y_;
}
function GridPositionVec2 (x_, y_)
{
	return new Vec2(
		marginWidth + x_ / windowWidth * (windowWidth - marginWidth * 2), 
		marginHeight + y_ / windowHeight * (windowHeight - marginHeight * 2));
}
function GridClippedPosition (x_, y_)
{
	return new Vec2(
		Math.max(marginWidth, Math.min(windowWidth - marginWidth))
		, Math.max(marginHeight, Math.min(windowWidth - marginHeight)));
}
function RandomVec2 ()
{
	return new Vec2(Math.random(), Math.random());
}
function RandomSpawnPositionVec2 ()
{
	return new Vec2(
		marginWidth + Math.random() * (windowWidth - marginWidth * 2), 
		marginHeight + Math.random() * (windowHeight - marginHeight * 2));
}
function RandomHeadAngle () { return (Math.floor(Math.random() * 4) / 4) * pi2; }

function distance(v1, v2) { return Math.sqrt((v2.x - v1.x) * (v2.x - v1.x) + (v2.y - v1.y) * (v2.y - v1.y)); }

function direction(v1, v2) {
	var dist = distance(v1, v2);
	return new Vec2((v2.x - v1.x) / dist, (v2.y - v1.y) / dist);
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

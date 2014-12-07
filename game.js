// Maths
var pi = 3.1415926535897932384626433832795;
var pi2 = 6.283185307179586476925286766559;

// Sizes
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
var marginWidth = windowWidth / 4;
var marginHeight = windowHeight / 4;
var grid = new Vec2(4, 3);
var sizeHead = 64;
var sizeLetter = 32;
var sizeHear = 32;

// Setup Pixi
var stage = new PIXI.Stage();
var renderer = PIXI.autoDetectRenderer(windowWidth, windowHeight, null, true, true);
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
var title, infos, hoho, clap, thumb, background;
var winning = false;
var winningTimeStart = -100;
var winningTimeDelay = 10;

//
var gravity = 9;
var MAX_LETTERS = 1000;
var text = " hi there ! welcome to talking heads. a game about information circulation made in forty eight hours by leon for ludum dare thirty one. rules are drag and drop heads and build a complete circuit for a reward. big love for ludum dare and thank you for playing !";
var textCurrent = 0;

// Timing
var timeScale = 0.001;
var timeStarted = new Date() * timeScale;
var timeElapsed = 0;
var timeDelta = 0;
var letterElapsed = 0;
var letterDelay = 0.2;
var animationElapsed = 0;
var animationDelay = 0.2;

// Load Images
var assets = [ "assets.png", "assets.json", "font.png", "font.json" ];
var font = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "!", "?", "."];
var loader = new PIXI.AssetLoader(assets);
loader.onComplete = onAssetsLoaded;
loader.load();

// Setup Textures
var textureListMouthFront, textureListMouthSide, textureListEarFront, textureListEarSide, textureListEyes, textureListClap, textureListLetter, textureHead;
function onAssetsLoaded ()
{
	textureListLetter = LoadFont();
	textureListMouthFront = LoadFrames("mouthFront", 10);
	textureListMouthSide = LoadFrames("mouthSide", 10);
	textureListEarFront = LoadFrames("earFront", 7);
	textureListEarSide = LoadFrames("earSide", 8);
	textureListEyes = LoadFrames("eyes", 5);
	textureListClap = LoadFrames("clap", 2);
	textureHead = PIXI.Texture.fromFrame("head");

	// Setup GUI
	title = new PIXI.Sprite(PIXI.Texture.fromFrame("title"));
	infos = new PIXI.Sprite(PIXI.Texture.fromFrame("infos"));
	hoho = new PIXI.Sprite(PIXI.Texture.fromFrame("hoho"));
	thumb = new PIXI.Sprite(PIXI.Texture.fromFrame("thumb"));
	clap = new PIXI.Sprite(textureListClap[0]);
	background = new PIXI.Sprite(PIXI.Texture.fromImage("background.jpg"));
	stage.addChild(background);
	
	// Title
	title.anchor.x = title.anchor.y = 0.5;
	title.x = windowWidth / 2;
	title.y = windowHeight / 2;
	title.scale.x = title.scale.y = 0.5;
	stage.addChild(title);

	// Infos
	infos.anchor.x = 1;
	infos.anchor.y = 0.5;
	infos.rotation = pi / 2;
	infos.scale.x = infos.scale.y = 0.5;
	infos.x = windowWidth / 2;
	infos.y = windowHeight;
	stage.addChild(infos);

	// Hoho
	hoho.anchor.x = 0.5;
	hoho.anchor.y = 0;
	hoho.scale.x = hoho.scale.y = 0.5;
	hoho.x = windowWidth / 2;
	hoho.y = windowHeight - hoho.height;
	stage.addChild(hoho);

	// Clap
	clap.anchor.x = 0.5;
	clap.x = -hoho.width / 2;
	clap.y = hoho.height;
	hoho.addChild(clap);

	// Thumb
	thumb.anchor.x = thumb.anchor.y = 0.5;
	thumb.x = hoho.width;
	thumb.y = hoho.height + thumb.height / 2;
	hoho.addChild(thumb);

	// Setup Game
	speaker = new Head(new Vec2(windowWidth, windowHeight*0.2), pi, false);
	listener = new Head(new Vec2(0, windowHeight*0.8), pi, false);
	GenerateHeads();

	// Start Game Loop
	requestAnimFrame( animate );
}

function GenerateHeads ()
{

	// Positions
	var randomList = [];
	for (var i = 0; i < grid.x * grid.y; ++i) { randomList[i] = i; }
	randomList = shuffle(randomList);

	// "Level Design"
	var directions = [1, 2, 3, 0, 1, 0, 2];

	// Add First Head
	heads.push(new Head(new Vec2(windowWidth * 0.8, windowHeight*0.2), pi2 * 1 / 4, true));

	// Add Heads
	for (var i = 0; i < directions.length; ++i) {
		var rand = randomList[i];
		var x = windowWidth * (rand % grid.x) / grid.x;
		var y = windowHeight * Math.floor(rand / grid.x) / grid.y;
		// Add Head
		heads.push(new Head(GridPositionVec2(x, y), pi2 * directions[i] / 4, true));
	}
}

function SpawnLetter (character_, position_, direction_)
{
	var direction = new Vec2(1, 0);
	if (lettersGarbage.length > 0) {
		letters[lettersGarbage[0]] = new Letter(character_, position_, direction_);
		lettersGarbage.splice(0, 1);
	} else if (letters.length < MAX_LETTERS) {
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
		var character = NextLetter();
		if (font.indexOf(character) != -1) {
			speaker.SayLetter(character);	
		}
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

		    		// Wining
		    		if (letter.repeated == heads.length) {
		    			Winning();
		    		}
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

    // Winning Animation

	// Show up
	var ratio = (timeElapsed - winningTimeStart) / winningTimeDelay;
	ratio = Math.max(0, Math.min(1, ratio));
	ratio = winning ? ratio : 1 - ratio;
	hoho.y = windowHeight * (1 - ratio) + (windowHeight - hoho.height) * ratio;

    // Clap
    if (animationElapsed + animationDelay < timeElapsed) {
    	animationElapsed = timeElapsed;
        clap.texture = TextureClap();
    }
    // Thumb
    thumb.rotation = Math.cos(timeElapsed * 20) * pi / 16;	

    // Render
    renderer.render(stage);
    requestAnimFrame(animate);
}

// 
function Winning ()
{
	if (!winning) {
		winningTimeStart = timeElapsed;
	}
	winning = true;
}
function StopWinning ()
{
	winning = false;
	winningTimeStart = timeElapsed;
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
function TextureEyes () { return textureListEyes[Math.floor(Math.random() * textureListEyes.length)]; }

var textureClapCurrent = 0;
function TextureClap () { textureClapCurrent = (textureClapCurrent + 1) % 2; return textureListClap[textureClapCurrent]; }

function NextLetter ()
{
	textCurrent = (textCurrent + 1) % text.length;
	return text[textCurrent];
}

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

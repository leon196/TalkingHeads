
// List of Talking Heads ... !
var heads = [];
var headCount = 4;
var MAX_HEADS = 12;

// List of Letter elements
var letters = [];

// Recycling Management
var lettersGarbage = [];
var MAX_LETTERS = 1000;

// Spawn Timing
var letterElapsed = 0;
var letterDelay = 0.2;

// IN and OUT
var firstSpeaker;
var finalListener;

var Level = {};

Level.CreateHead = function (position_, angle_, isFront_)
{
	var isFront;
	if ( typeof isFront_ == "undefined" ) { isFront = true; } 
	else { isFront = isFront_; }

	return new Head(position_, angle_, isFront);
};

Level.AddHead = function (position_, angle_, isFront_)
{
	var head = Level.CreateHead(position_, angle_, isFront_);
	heads.push(head);
};

Level.AddLetter = function (character_, position_, direction_)
{
	var direction = new Utils.Vec2(1, 0);
	if (lettersGarbage.length > 0) {
		letters[lettersGarbage[0]] = new Letter(character_, position_, direction_);
		lettersGarbage.splice(0, 1);
	} else if (letters.length < MAX_LETTERS) {
		letters.push(new Letter(character_, position_, direction_));
	}
};

Level.Reset = function ()
{
	winning = false;
	heads = [];
	layerHead.removeChildren();

	for (var i = 0; i < letters.length; i++) {
		var letter = letters[i];
		if (letter != null)
		{
			letter.Fall(Utils.Vec2RandomDirection());
		}
	}
};

Level.NextLevel = function ()
{
	headCount = Math.min(headCount + 2, MAX_HEADS);
	Level.StartNewLevel();
};

Level.StartNewLevel = function ()
{
	var directions = [2, 1, 2, 3];
	var firstDirection;
	var previousDirection;
	var randomGridPositionIn = Utils.Vec2Grid(Math.floor(Math.random()*gridDimension*gridDimension));
	var randomGridPositionOut = Utils.Vec2Grid(Math.floor(Math.random()*gridDimension*gridDimension));
	var position;
	
	// Ratio check for screen space
	/*if (windowWidth > windowHeight)
	{*/
		// First Speaker
		position = new Utils.Vec2(windowWidth, randomGridPositionIn.y);
		firstSpeaker = Level.CreateHead(position, Utils.GetCardinalRadian(2), false);

		// Final Listener
		position = new Utils.Vec2(0, randomGridPositionOut.y);
		finalListener = Level.CreateHead(position, Utils.GetCardinalRadian(2), false);

		//
		firstDirection = previousDirection = 2;
	/*} 
	else 
	{
		// First Speaker
		position = new Utils.Vec2(randomGridPositionIn.x, windowHeight);
		firstSpeaker = Level.CreateHead(position, Utils.GetCardinalRadian(3), false);

		// Final Listener
		position = new Utils.Vec2(randomGridPositionOut.x, 0);
		finalListener = Level.CreateHead(position, Utils.GetCardinalRadian(3), false);

		//
		firstDirection = previousDirection = 3;
	}*/

	// Level design is made by the index of cardinal point
	/*for (var i = 0; i < headCount; ++i) {
		var dir;
		if (i < 4){
			dir = i;
		} else {
			dir = ( previousDirection + (Math.random() > 0.5 ? -1 : 1) ) % 4;
		}
		previousDirection = dir;
		directions.push( dir );
	}*/

	// Some level may require specific positions (directions.length != positions.length)
	var positions = Utils.GetRandomUniqueNumbers(gridDimension * gridDimension);

	// Generate Heads
	var position, angle;
	for (var i = 0; i < directions.length; ++i) 
	{
		Level.AddHead( Utils.Vec2Grid( positions[i] ), Utils.GetCardinalRadian( directions[i] ) );
	}
};

Level.Update = function (deltaTime_)
{
	// Update Heads
    for (var i = 0; i < heads.length; ++i) {
    	var head = heads[i];
    	head.Update(deltaTime_);
    }

    // Update Speaker
    firstSpeaker.Speak();

	// Spawn Letters
	if (letterElapsed + letterDelay < timeElapsed) 
	{
		letterElapsed = timeElapsed;

		var character = Font.GetTextCharacter();
		if (font.indexOf(character) != -1) {
			Level.AddLetter(character, firstSpeaker.GetPositionMouth(), firstSpeaker.direction);
		}
	}

    // Update Letters
    for (var i = 0; i < letters.length; ++i) {
    	var letter = letters[i];
    	if (letter != null) {
    		// Update
	    	letter.Update(deltaTime_);
	    	// Recycle
	    	if (letter.IsOutOfScreen()) {
	    		letter.Clear();
	    		letters[i] = null;
	    		lettersGarbage.push(i);
	    	} 
	    	// Check Collisions
	    	else if (!letter.falling && !letter.listening && !letter.pronouncing) {
				// Final finalListener
				if (finalListener.CanHearLetterFrom(letter.position)) {
					// Clear letter
		    		letter.Clear();
		    		letters[i] = null;
		    		lettersGarbage.push(i)
		    		// Wining
		    		if (!winning && letter.repeated == heads.length) {
						animationVictory.Start();
						winning = true;
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
					else if (head.HitTestLetter(letter.position)) 
					{
						var direction = Utils.Vec2Direction(head.GetPosition(), letter.position);
						letters[i].Fall( direction );
			    		break;
					}
				}
	    	}
    	}
    }
};

Level.Resize = function (ratioX, ratioY)
{
	firstSpeaker.spriteHead.x *= ratioX;
	firstSpeaker.spriteHead.y *= ratioY;

	finalListener.spriteHead.x *= ratioX;
	finalListener.spriteHead.y *= ratioY;

	for (var i = heads.length - 1; i >= 0; --i)
	{
		var head = heads[i];
		head.spriteHead.x *= ratioX;
		head.spriteHead.y *= ratioY;
	}
};
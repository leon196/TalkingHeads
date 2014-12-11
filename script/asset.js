
// Load Images
var assets = [ "asset/assets.png", "asset/assets.json", "asset/font.png", "asset/font.json" ];

// Font
var font = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "!", "?", "."];

// Textures List
var textureListMouthFront, textureListMouthSide, textureListEarFront, textureListEarSide, textureListEyes, textureListClap, textureListLetter, textureHead;

var Asset = {};

// PIXI Loader Callback
Asset.onAssetsLoaded = function ()
{
	textureListMouthFront = Asset.LoadFrames("mouthFront", 10);
	textureListMouthSide = Asset.LoadFrames("mouthSide", 10);
	textureListEarFront = Asset.LoadFrames("earFront", 7);
	textureListEarSide = Asset.LoadFrames("earSide", 8);
	textureListEyes = Asset.LoadFrames("eyes", 5);
	textureListClap = Asset.LoadFrames("clap", 2);
	textureListLetter = Asset.LoadFont();
	textureHead = PIXI.Texture.fromFrame("head");
};

// Setup Textures From Frames
Asset.LoadFrames = function (tag, count)
{
	var textureList = [];
	for (var i = 0; i < count; ++i)
	{
		var frameName = tag + i;
		var texture = PIXI.Texture.fromFrame(frameName);
		textureList.push(texture);
	}
	return textureList;
};

// Setup Font Texture From Frames
Asset.LoadFont = function ()
{
	var textureList = [];
	for (var i = 0; i < font.length; ++i)
	{
		var frameName = font[i];
		var texture = PIXI.Texture.fromFrame(frameName);
		textureList.push(texture);
	}
	return textureList;
};

// Get Random Texture From Lists
Asset.TextureMouthFront = function () { return textureListMouthFront[ Math.floor( Math.random() * textureListMouthFront.length ) ]; };
Asset.TextureMouthSide = function () { return textureListMouthSide[ Math.floor( Math.random() * textureListMouthSide.length ) ]; };
Asset.TextureEarFront = function () { return textureListEarFront[ Math.floor( Math.random() * textureListEarFront.length ) ]; };
Asset.TextureEarSide = function () { return textureListEarSide[ Math.floor( Math.random() * textureListEarSide.length ) ]; };
Asset.TextureEyes = function () { return textureListEyes[ Math.floor( Math.random() * textureListEyes.length ) ]; };

// Get Letter Texture
Asset.TextureLetter = function (letter_) 
{ 
	var index = font.indexOf(letter_);
	if (index == -1) return null;
	return textureListLetter[index]; 
};

// Get Random Character
Asset.RandomLetter = function () { return font[ Math.floor( Math.random() * font.length ) ]; };
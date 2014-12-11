
var title, infos, hoho, clap, thumb, background;

var UI = {};

UI.Setup = function ()
{
	// Background
	background = new PIXI.Sprite(PIXI.Texture.fromImage("asset/background.jpg"));
	stage.addChild(background);
	
	// Title
	title = new PIXI.Sprite(PIXI.Texture.fromFrame("title"));
	title.anchor.x = title.anchor.y = 0.5;
	stage.addChild(title);
	
	// Informations
	infos = new PIXI.Sprite(PIXI.Texture.fromFrame("infos"));
	infos.anchor.x = 1;
	infos.anchor.y = 0.5;
	stage.addChild(infos);

	// Characters
	hoho = new PIXI.Sprite(PIXI.Texture.fromFrame("hoho"));
	hoho.anchor.x = 0.5;
	layerOverlay.addChild(hoho);

	// Thumb
	thumb = new PIXI.Sprite(PIXI.Texture.fromFrame("thumb"));
	thumb.anchor.x = thumb.anchor.y = 0.5;
	hoho.addChild(thumb);

	// Clap
	clap = new PIXI.Sprite(textureListClap[0]);
	clap.anchor.x = 0.5;
	hoho.addChild(clap);
};

UI.Resize = function ()
{
	// Title
	title.x = windowWidth / 2;
	title.y = windowHeight / 2;
	title.scale.x = title.scale.y = 0.5;

	// Infos
	infos.rotation = pi / 2;
	infos.scale.x = infos.scale.y = 0.5;
	infos.x = windowWidth / 2;
	infos.y = windowHeight;

	// Hoho
	hoho.scale.x = hoho.scale.y = 0.5;
	hoho.x = windowWidth / 2;
	hoho.y = windowHeight;// - hoho.height;

	// Clap
	clap.x = -hoho.width / 2;
	clap.y = hoho.height;

	// Thumb
	thumb.x = hoho.width;
	thumb.y = hoho.height + thumb.height / 2;
};
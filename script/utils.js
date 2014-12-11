// Maths
var pi = 3.1415926535897932384626433832795;
var pi2 = 6.283185307179586476925286766559;

var Utils = {};

Utils.Segment = function (value_, segmentCount_) { return Math.floor( value_ * segmentCount_ ) / segmentCount_ ; };

Utils.Distance = function (v1, v2) { return Math.sqrt((v2.x - v1.x) * (v2.x - v1.x) + (v2.y - v1.y) * (v2.y - v1.y)); };

Utils.Vec2 = function (x_, y_)
{
	this.x = x_;
	this.y = y_;
};

Utils.Vec2Random = function ()
{
	return new Utils.Vec2(Math.random(), Math.random());
};

Utils.Vec2RandomDirection = function ()
{
	var rand = Math.random() * pi2;
	return new Utils.Vec2(Math.cos(rand), Math.sin(rand));
};

Utils.Vec2Spawn = function ()
{
	return new Utils.Vec2(
		marginWidth + Math.random() * (windowWidth - marginWidth * 2), 
		marginHeight + Math.random() * (windowHeight - marginHeight * 2));
};

Utils.Vec2Grid = function (index_)
{
	return new Utils.Vec2(
		gridAnchor.x + (index_ % gridDimension) * gridCellSize,
		gridAnchor.y + Math.floor(index_ / gridDimension) * gridCellSize);
};

Utils.Vec2Clipped = function (x_, y_)
{
	return new Utils.Vec2(
		Math.max(marginWidth, Math.min(windowWidth - marginWidth)),
		Math.max(marginHeight, Math.min(windowWidth - marginHeight)));
};

Utils.Vec2Direction = function (v1, v2) 
{
	var dist = Utils.Distance(v1, v2);
	return new Utils.Vec2((v2.x - v1.x) / dist, (v2.y - v1.y) / dist);
};

Utils.GetRandomUniqueNumbers = function (range_)
{
	var randomList = [];
	for (var i = 0; i < range_; ++i) { randomList[i] = i; }
	return Utils.Shuffle(randomList);
};

Utils.GetCardinalRadian = function (index_)
{
	return pi2 * index_ / 4;
};

Utils.GetRandomCardinalRadian = function () 
{ 
	return Utils.Segment(Math.random(), 4) * pi2; 
};

// Stack overflow
Utils.Shuffle = function (array) 
{
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

// https://github.com/gre/smoothstep
Utils.SmoothStep = function (min, max, value) {
	var x = Math.max(0, Math.min(1, (value-min)/(max-min)));
	return x*x*(3 - 2*x);
};

// Drag and Drop

var dragging = false;
var headDragged = null; 

var eventData = null;
var originPoint = new Utils.Vec2();

var Controls = {};

Controls.MouseDown = function(data)
{
	data.originalEvent.preventDefault();
};

// Event attached on a head
Controls.DragHeadCallback = function(data)
{
    eventData = data;
    dragging = true;

    //
    headDragged = this;

    //
    var mousePosition = eventData.getLocalPosition(headDragged.parent);
    originPoint.x = mousePosition.x - headDragged.x;
    originPoint.y = mousePosition.y - headDragged.y;

    //this.parent.setChildIndex(this, this.parent.children.length - 1);
};

Controls.DropHeadCallback = function(data)
{
    dragging = false;
    eventData = null;
};

Controls.MoveHeadCallback = function(data)
{
    if (dragging && headDragged != null)
    {
    	var mousePosition = eventData.getLocalPosition(headDragged.parent);
        headDragged.x = mousePosition.x - originPoint.x;
        headDragged.y = mousePosition.y - originPoint.y;
    }
}; 
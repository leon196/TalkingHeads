
// Text
var text = " hi there ! welcome to talking heads. \
a game about information circulation made in forty \
eight hours by leon for ludum dare thirty one. \
rules are drag and drop heads and build a complete \
circuit for a reward. big love for ludum dare and \
thank you for playing !";

var textCursor = 0;

var Font = {};

// Get the next letter in the text
Font.GetTextCharacter = function ()
{
	textCursor = (textCursor + 1) % text.length;
	return text[textCursor];
}

// Text
var text = " hi there !    you are playing to talking heads    \
a game about information circulation.    \
drag and drop heads and build a complete circuit to start a new game     \
the levels are procedural and infinite      \
there is no ending      \
the game currently lack of level design elements to make a challenge progression      \
need to find out a simple idea and may be create some hand made levels      \
for now there is only one drawing reward when you go the next level     \
but i will try to provide more content not too late      \
also i dont really had time to make up a story or something     \
so the text is kind of place holder.    \
any writer feeling up to make up a story is welcome    \
it could be also a input text field so you can tell whatever you want !    \
anyway thank you for playing !     \
and big love for ludum darers     \
";

var cheers = [
"awesome",
"impressive",
"great",
"cooooool",
"aaahhhhhhhh",
"incredible",
"terrific",
"fantastic",
"hoho"
]

var cheerOrder = Utils.GetRandomUniqueNumbers(cheers.length);
var textCheerCursor = 0;

var textCursor = 0;

var Font = {};

// Get the next letter in the text
Font.GetTextCharacter = function ()
{
	textCursor = (textCursor + 1) % text.length;
	return text[textCursor];
}

Font.GetCheer = function ()
{
	textCheerCursor = (textCheerCursor + 1) % cheers.length;
	return cheers[cheerOrder[textCheerCursor]];
}
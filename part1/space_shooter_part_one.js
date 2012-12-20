/***************
 * PART ONE - Setting up the structure of the game and panning 
 * a background
 ***************/

/* NOTES TO REMEMBER
 * 1. A variable declared private (with the var syntax) cannot be referenced from a public function declared with the prototype syntax
 * 2. Drawing an image once does not keep it on the canvas (it disapears for some reason). REASON - the image is not loaded when the 
 *    call to draw it is called, so nothing is drawn.
 * 3. A vairable declared public (with the this syntax) must always be referenced with the this syntax when using it
 */
 
/* RESOURCES
 * 1. http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * 2. http://net.tutsplus.com/tutorials/javascript-ajax/prototypes-in-javascript-what-you-need-to-know/
 * 3. http://phrogz.net/js/classes/OOPinJS.html
 * 4. http://www.phpied.com/3-ways-to-define-a-javascript-class/
 */


/**
 * Initialize the Game and starts it.
 */
var game = new Game();

function init() {
	if(game.init())
		game.start();
}

/**
 * Define an object to hold all our images for the game so images
 * are only ever created once. This type of object is known as a 
 * singleton.
 */
var imageRepository = new function() {
	// Define images
	this.empty = null;
	this.background = new Image();
	
	// Set images src
	this.background.src = "imgs/bg.png";
}


/**
 * Creates the Drawable object which will be the base class for
 * all drawable objects in the game. Sets up defualt variables
 * that all child objects will inherit, as well as the defualt
 * functions. 
 */
function Drawable() {	
	this.init = function(x, y) {
		// Defualt variables
		this.x = x;
		this.y = y;
	}

	this.speed = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;
	
	// Define abstract function to be implemented in child objects
	this.draw = function() {
	};
}


/**
 * Creates the Background object which will become a child of
 * the Drawable object. The background is drawn on the "background"
 * canvas and creates the illusion of moving by panning the image.
 */
function Background() {
	this.speed = 1; // Redefine speed of the background for panning
	
	// Implement abstract function
	this.draw = function() {
		// Pan background
		this.y += this.speed;
		this.context.drawImage(imageRepository.background, this.x, this.y);
		
		// Draw another image at the top edge of the first image
		this.context.drawImage(imageRepository.background, this.x, this.y - this.canvasHeight);

		// If the image scrolled off the screen, reset
		if (this.y >= this.canvasHeight)
			this.y = 0;
	};
}
// Set Background to inherit properties from Drawable
Background.prototype = new Drawable();


/**
 * Creates the Game object which will hold all objects and data for
 * the game.
 */
function Game() {
	/*
	 * Gets canvas information and context and sets up all game
	 * objects. 
	 * Returns true if the canvas is supported and false if it
	 * is not. This is to stop the animation script from constantly
	 * running on older browsers.
	 */
	this.init = function() {
		// Get the canvas element
		this.bgCanvas = document.getElementById('background');
		
		// Test to see if canvas is supported
		if (this.bgCanvas.getContext) {
			this.bgContext = this.bgCanvas.getContext('2d');
		
			// Initialize objects to contain their context and canvas
			// information
			Background.prototype.context = this.bgContext;
			Background.prototype.canvasWidth = this.bgCanvas.width;
			Background.prototype.canvasHeight = this.bgCanvas.height;
			
			// Initialize the background object
			this.background = new Background();
			this.background.init(0,0); // Set draw point to 0,0
			return true;
		} else {
			return false;
		}
	};
	
	// Start the animation loop
	this.start = function() {
		animate();
	};
}


/**
 * The animation loop. Calls the requestAnimationFrame shim to
 * optimize the game loop and draws all game objects. This
 * function must be a gobal function and cannot be within an
 * object.
 */
function animate() {
	requestAnimFrame( animate );
	game.background.draw();
}


/**	
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop, 
 * otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();
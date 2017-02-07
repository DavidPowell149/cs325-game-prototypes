// Creates and sets up an Astroid object
// Params: The game variable, and the name of the sprite. Type is either 1,2,3 for small/medium/large asteroids
function Astroid(game, spriteName)
{
    // Dictionary for public values
    var sprite = game.add.sprite(0, 0, spriteName);     // Place it in bottom center
    sprite.inputEnabled = true; // Allow for input
    var health;   // Number of hitpoints

    var speed;     // Rate at which asteroid falls

    // Setup asteroid type
    if(spriteName === "small-astroid")          { speed = 20; health = 10; }
    else if(spriteName === "medium-astroid")    { speed = 10; health = 70; }
    else if(spriteName === "large-astroid")     { speed = 5;  health = 200; }
    else { console.log("Incorrect astroid type. Setting to large to punish you"); }


    // Function that runs every tick, specifically for astroid.
    this.updateAstroid = function()
    {

    }




    this.damage = function(healthDelta)
    {
        health = health + healthDelta;
    }

    this.getHealth = function()
    {
        return health;
    }

    this.getSprite = function()
    {
        return sprite;
    }

    // Set the sprite to a location
    this.setTo = function(x, y)
    {
        sprite.x = x;
        sprite.y = y;
    }

    // Moves the asteroid by a certain amount
    this.move = function(changeX, changeY)
    {
        sprite.x = sprite.x + changeX;
        sprite.y = sprite.y + changeY;
    }
}

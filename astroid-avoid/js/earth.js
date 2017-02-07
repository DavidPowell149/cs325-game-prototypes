// Creates and sets up an Earth object
// Params: The game variable, and the name of the sprite
function Earth(game, spriteName, size)
{
    // Dictionary for public values
    var sprite = game.add.sprite(0, 0, spriteName);     // Place it in bottom center
    //console.log(typeof sprite)

    var health = 100;   // Number of hitpoints

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
}

// Creates and sets up an Earth object
// Params: The game variable, and the name of the sprite
function Earth(game, spriteName)
{
    // Dictionary for public values
    var sprite = game.add.sprite(-50, 580, spriteName);     // Place it in bottom center

    var health = 100;   // Number of hitpoints

    var size = 100;     // Percentage of max size

    this.incrimentHealth = function(healthDelta)
    {
        health = health + healthDelta;
    }

    this.getHealth = function()
    {
        return health;
    }
}

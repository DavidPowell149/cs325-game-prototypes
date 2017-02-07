function Earth(game, spriteName)
{
    // Dictionary for public values
    var obj = {};

    obj.sprite = game.add.sprite(-50, 580, spriteName);     // Place it in bottom center

    obj.health = 100;   // Number of hitpoints

    obj.size = 100;     // Percentage of max size

    obj.incrimentHealth = function(healthDelta)
    {
        this.health = this.health + healthDelta;
    }

    return obj;
}

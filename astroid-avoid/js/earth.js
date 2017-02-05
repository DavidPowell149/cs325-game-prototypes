function Earth(game, spriteName)
{
    // Dictionary for public values
    var obj = {};

    game.add.sprite(-50, 580, spriteName);     // Place it in bottom center

    obj.health = 100;   // Number of hitpoints

    obj.size = 100;     // Percentage of max size

    return obj;
}

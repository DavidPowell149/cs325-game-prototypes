function Astroid(game, spriteName)
{
    // Dictionary for public values
    var obj = {};

    game.add.sprite(10, 10, spriteName);     // Place it in bottom center

    obj.health = 100;   // Number of hitpoints

    obj.size = 100;     // Percentage of max size

    return obj;
}

window.onload = function()
{
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/v2.6.2/resources/Project%20Templates/Basic

    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".

    "use strict";

    // Global variables
    var game = new Phaser.Game(window.innerWidth*0.9, window.innerHeight*0.9, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    var player;     // The player's avatar
    var person;
    var personGroup;    // The group for the people

    var saleBar;    // The visual bar

    // Pre loads assets for game load
    function preload()
    {
        // Load in game assets
        game.load.image( "player", 'assets/player.png' );
        game.load.image( "person", 'assets/person.png' );

    }

    // Called on game's initial creation state
    function create()
    {
        // The background
        game.stage.backgroundColor = "#E6E6E6";

        // The player
        player = game.add.sprite(game.world.centerX, game.world.centerY, "player");
        player.anchor.setTo(0.5,0.5);
        player.scale.setTo(game.world.width*0.00007, game.world.width*0.00007);

        // The person and their group
        person = game.add.sprite(game.world.centerX+20, game.world.centerY+20, "person");
        person.anchor.setTo(0.5,0.5);
        person.scale.setTo(game.world.width*0.00005, game.world.width*0.00005);
        personGroup = game.add.group();  // Group for spikes

        saleBar = new Phaser.Rectangle(20, 20, 800, 50);
    }

    // Runs every tick/iteration/moment/second
    function update()
    {

    }

};

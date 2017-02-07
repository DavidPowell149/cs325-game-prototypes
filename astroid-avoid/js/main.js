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
    var game = new Phaser.Game( 600, 760, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    var earth;  // Our home planet, which we aim to protect
    var earthHealthLabel;   // Earth's health counter, displayed in the upper-left


    // Pre loads assets for game load
    function preload()
    {
        // Load in game assets
        game.load.image( 'background', 'assets/space_background.png' );
        game.load.image( 'earth', 'assets/earth.png' );
    }

    // Called on game's initial creation state
    function create()
    {
        // The space background
        game.add.sprite(0, 0, "background");

        // Create earth object
        earth = new Earth(game, "earth");


        // Initialize health display
        var earthHealthStyle = { font: "15px Verdana-bold", fill: "#FF0000", align: "center" }; // Make a style
        //earthHealthLabel = game.add.text( 10, 5, "Health: " + earth.health, earthHealthStyle ); // Apply it
        earthHealthLabel = game.add.text(10, 5, "Health: " + earth.health, earthHealthStyle ); // Apply it
    }

    // Runs every tick/iteration/moment/second
    function update()
    {
        updateEarthHealth();     // Adjust the earth's health counter
    }





    function updateEarthHealth()
    {
        if(earth.getHealth() <= 0)
        {
            gameOver(); // The Earth has been destroyed
        }


        var earthHealthStyle = { font: "15px Verdana-bold", fill: "#FF0000", align: "center" };
        earthHealthLabel.setText("Health: " + earth.getHealth());
    }

    function gameOver()
    {
        console.log("Game Over");
        //game.destroy();
    }
};

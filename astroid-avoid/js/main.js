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

    var game = new Phaser.Game( 600, 760, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );

    var earthHealth = 100;  // Earth's hitpoints
    var earthHealthDisplay;     // The text shown on screen

    function preload()
    {
        // Load in game assets
        game.load.image( 'background', 'assets/space_background.png' );
        game.load.image( 'earth', 'assets/earth.png' );
    }

    var bouncy;

    function create()
    {
        // The space background
        game.add.sprite(0, 0, "background");
        var earth = game.add.sprite(-50, 580, "earth");     // Place it in bottom center

        // Initialize Health
        earthHealthDisplay = game.add.text( 30, 5, earthHealthDisplay, earthHealthLabelStyle );



        // // Create a sprite at the center of the screen using the 'logo' image.
        // bouncy = game.add.sprite( game.world.centerX, game.world.centerY, 'earth' );
        // // Anchor the sprite at its center, as opposed to its top-left corner.
        // // so it will be truly centered.
        // bouncy.anchor.setTo( 0.5, 0.5 );
        //
        // // Turn on the arcade physics engine for this sprite.
        // game.physics.enable( bouncy, Phaser.Physics.ARCADE );
        // // Make it bounce off of the world bounds.
        // bouncy.body.collideWorldBounds = true;
        //
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var earthHealthLabelStyle = { font: "15px Verdana-bold", fill: "#FF0000", align: "center" };
        var earthHealthLabel = game.add.text( 10, 5, "Health: ", earthHealthLabelStyle );
    }

    // Runs every tick/iteration/moment/second
    function update()
    {
        updateHealth();     // Adjust the earth's health counter
    }





    function updateHealth()
    {
        if(earthHealth <= 0)
        {
            gameOver(); // The player has died
        }

        // var style = { font: "15px Verdana", fill: "#9999ff", align: "center" };
        // var text = game.add.text( 10, 5, "Health: " + earthHealth, style );
    }

    function gameOver()
    {
        console.log("Game Over");
    }
};

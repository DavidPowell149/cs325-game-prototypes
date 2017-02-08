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
    var astroidGroup; // Asteroids
    var tempAstroid;    // An astroid
    var smallProb=1.0;  var mediumProb=0.0; var largeProb=0.0;  // Probability of getting each astroid
    var astroidSpawnTime = 200;   // The rate at which astroids spawn
    var lastAstroidSpawnTime = 0;   // Time since last astroid spawn
    var astroidType;  // The type of astroid to spawn

    // Pre loads assets for game load
    function preload()
    {
        // Load in game assets
        game.load.image( 'background', 'assets/space_background.png' );
        game.load.image( 'earth', 'assets/earth.png' );
        game.load.image( 'small-astroid', 'assets/astroid_small.png' );
        game.load.image( 'medium-astroid', 'assets/astroid_medium.png' );
        game.load.image( 'large-astroid', 'assets/astroid_large.png' );
    }

    // Called on game's initial creation state
    function create()
    {
        // The space background
        game.add.sprite(0, 0, "background");

        // Create earth object and set location
        earth = new Earth(game, "earth");
        earth.setTo(-50, 580);

        // Create a group of astroids
        astroidGroup = game.add.group();




        // Initialize health display
        var earthHealthStyle = { font: "15px Verdana-bold", fill: "#FF0000", align: "center" }; // Make a style
        //earthHealthLabel = game.add.text( 10, 5, "Health: " + earth.health, earthHealthStyle ); // Apply it
        earthHealthLabel = game.add.text(10, 5, "Health: " + earth.health, earthHealthStyle ); // Apply it
    }

    // Runs every tick/iteration/moment/second
    function update()
    {
        updateEarthHealth();     // Adjust the earth's health counter

        updateAstroid();

    }

    function updateAstroid()
    {
        astroidType = "small-astroid";
        // Check if are allowed to spawn an astroid
        if(game.time.now - lastAstroidSpawnTime > astroidSpawnTime)
        {
            lastAstroidSpawnTime = game.time.now;

            if(astroidGroup.countLiving() < 5)
            {
                // Add some astroids
                tempAstroid = new Astroid(game, astroidType);
                astroidGroup.add(tempAstroid.getSprite());
                tempAstroid.setTo(Math.random()*500 + 50, -50);
                tempAstroid.getSprite().events.onInputDown.add(astroidClick, this, tempAstroid.getSprite());

            }
        }

        // Do stuff for each astroid
        astroidGroup.forEach( function(astroid)
        {
            // Move the astroid
            astroid.y = astroid.y + 5;

            // Check for collision
            if(astroid.overlap(earth.getSprite()))
            {
                console.log("Earth is hit!");
                astroidHit(astroid);
            }

        }, this);
        //tempAstroid.move(0, 1); // Only works for one
        // if((game.time.now/1000) >= 15)
        // {
        //     smallProb = 0.6;
        //     mediumProb = ;
        // }
        // if((game.time.now/1000) >= 40)
        // {
        //
        // }
    }




    // Called when earth is hit by an astroid
    function astroidHit(astroid)
    {
        astroid.destroy();
        earth.damage(10);
    }

    // Function that is called when the astroid is clicked
    function astroidClick(astroid)
    {
        astroid.destroy();
    }

    function moveAstroid(astroid)
    {
        astroid.move(0, 1);
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
        //game.destroy();   // Overkill but I am on a time constraint. Thanks for reading my code by the way.

        game.lockRender = true; // Game is still running in the background but it looks dead
    }
};

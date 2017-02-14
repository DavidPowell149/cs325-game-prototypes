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
    var game = new Phaser.Game( 1100, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    var heart;      // The player
    var player_acceleration = 0.1;  // The rate at which players change speed
    var player_current_speed = 0.0; // The player's current speed
    var player_max_speed = 6.0;     // Max speed player can move

    var track_max_speed = 2.0;
    var track_acceleration = 0.1;


    var upKey;      // The keys to control the game
    var downKey;


    // Pre loads assets for game load
    function preload()
    {
        // Load in game assets
        game.load.image( "heart", 'assets/heart.png' );
    }

    // Called on game's initial creation state
    function create()
    {
        // The yellow color background
        game.stage.backgroundColor = "FFFFCC";

        heart = game.add.sprite(game.world.centerX/3, game.world.centerY, "heart");
        heart.anchor.setTo(0.5, 0.5);   // Sets the reference point to the center of the sprite, not the default top left corner
        heart.scale.setTo(0.3, 0.3);


        // Initialize the keys
        upKey = game.input.keyboard.addKey(Phaser.KeyCode.UP);
        downKey = game.input.keyboard.addKey(Phaser.KeyCode.DOWN);
    }

    // Runs every tick/iteration/moment/second
    function update()
    {
        if (upKey.isDown && downKey.isDown) { accelerateIdle() }   // Both are pressed. Do nothing
        else
        {
            if (upKey.isDown)       { accelerate(1); moveUp(); }
            if (downKey.isDown)     { accelerate(-1); moveDown();  }
            if (!upKey.isDown && !downKey.isDown) { accelerateIdle() }   // Nothing is being pressed
        }
    }


    function accelerate(magnitude)
    {
        if(magnitude === 1)
            player_current_speed += player_acceleration * 2.0;
        else if(magnitude === -1)
            player_current_speed -= player_acceleration * 2.0;


        if(player_current_speed > 0)
        {
            if(player_current_speed > player_max_speed)
            {
                player_current_speed = player_max_speed;
            }
        }
        else if(player_current_speed < 0)
        {
            if(player_current_speed < -player_max_speed)
            {
                player_current_speed = -player_max_speed;
            }
        }
    }

    // Slowly brings the speed back down to zero if no button is pressed
    function accelerateIdle()
    {
        // Deadzone
        if(Math.abs(player_current_speed) < 0.00001)
        {
            player_current_speed = 0;
        }

        console.log("Idle" + player_current_speed);
        if(player_current_speed > 0)
        {
            player_current_speed -= player_acceleration;    // Move towards 0
            heart.y -= player_current_speed;
        }

        else if(player_current_speed < 0)
        {
            player_current_speed += player_acceleration;    // Move towards 0
            heart.y -= player_current_speed;
        }

    }

    function moveUp()
    {
        console.log("Moving up" + player_current_speed);
        accelerate(1);
        heart.y -= player_current_speed;
    }

    function moveDown()
    {
        console.log("Moving down" + player_current_speed);
        accelerate(-1);
        heart.y -= player_current_speed;
    }
};

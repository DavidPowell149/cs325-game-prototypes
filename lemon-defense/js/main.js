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
    var game = new Phaser.Game( 980, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    var heart;      // The player
    var player_acceleration = 0.1;  // The rate at which players change speed
    var player_current_speed = 0.0; // The player's current speed
    var player_max_speed = 6.0;     // Max speed player can move

    var track_current_speed = 3.0;    // Current speed of track
    var track_max_speed = 7.0;      // Max speed track can move at
    var track_acceleration = 0.001;   // Track's acceleration rate

    var upKey;      // The keys to control the game
    var downKey;

    var borderTop; var borderBottom;
    var spikeGroup;     // A group for the spikes
    var tempSpike;      // A temp spike to add it to the group
    var bloodGroup;     // A group for the blood cells
    var tempBlood;      // A temp blood cell to add it to the group

    // Spikes and blood
    var spikeSpawnTime = 1300;
    var lastSpikeSpawnTime = 0;
    var bloodSpawnTime = 550;
    var lastBloodSpawnTime = 0;

    // Scoring
    var score = 0;
    var scoreText;

    // Pre loads assets for game load
    function preload()
    {
        // Load in game assets
        game.load.image( "heart", 'assets/heart.png' );
        game.load.image( "blood-cell", 'assets/blood_cell.png' );
        game.load.image( "border", 'assets/border.png' );
        game.load.image( "spike-bottom", 'assets/spike_bottom.png' );
        game.load.image( "spike-top", 'assets/spike_top.png' );
    }

    // Called on game's initial creation state
    function create()
    {
        // The yellow color background
        game.stage.backgroundColor = "FFFFCC";

        lemon = game.add.sprite(game.world.centerX, game.world.height-150, "lemon");

    }

    // Runs every tick/iteration/moment/second
    function update()
    {
        playerMovement()
        boundryCheck();
        updateTrack();
        updateScore();
    }





    function playerMovement()
    {
        if (upKey.isDown && downKey.isDown) { accelerateIdle() }   // Both are pressed. Do nothing
        else
        {
            if (!upKey.isDown && !downKey.isDown) { accelerateIdle() }   // Nothing is being pressed
            if(!heart.overlap(borderTop))
            {
                if (upKey.isDown) { accelerate(1); moveUp(); }
            }
            else { accelerateIdle() }
            if(!heart.overlap(borderBottom))
            {
                if (downKey.isDown) { accelerate(-1); moveDown();  }
            }
            else { accelerateIdle() }


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
        accelerate(1);
        heart.y -= player_current_speed;
    }

    function moveDown()
    {
        accelerate(-1);
        heart.y -= player_current_speed;
    }

    function boundryCheck()
    {
        if(heart.y < borderTop.height+heart.height/2) {heart.y = borderTop.height+heart.height/2;}
        if(heart.y > game.world.height - (borderBottom.height+heart.height/2)) {heart.y = game.world.height - (borderBottom.height+heart.height/2);}
    }
};

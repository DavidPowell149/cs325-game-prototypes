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

    var spikeSpawnTime = 1000;
    var lastSpikeSpawnTime = 0;


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

        heart = game.add.sprite(game.world.centerX/3, game.world.centerY, "heart");
        borderTop = game.add.sprite(0, 0, "border");
        borderBottom = game.add.sprite(0, game.world.height, "border");
        borderBottom.anchor.setTo(0, 1.0);  // Set the anchor to the bottom left
        heart.anchor.setTo(0.5, 0.5);   // Sets the reference point to the center of the sprite, not the default top left corner
        heart.scale.setTo(0.3, 0.3);    // Sets the scale of the heart sprite to 30% of its original size
        spikeGroup = game.add.group();  // Group for spikes
        bloodGroup = game.add.group();  // Group for spikes

        // Initialize the keys
        upKey = game.input.keyboard.addKey(Phaser.KeyCode.UP);
        downKey = game.input.keyboard.addKey(Phaser.KeyCode.DOWN);
    }

    // Runs every tick/iteration/moment/second
    function update()
    {
        playerMovement()
        boundryCheck();
        updateTrack();
    }


    function updateTrack()
    {
        //console.log("Speed: " + track_current_speed)
        if(track_current_speed >= track_max_speed)
            track_current_speed = track_max_speed;
        else
            track_current_speed += track_acceleration;

        if((game.time.now - lastSpikeSpawnTime) > spikeSpawnTime)
        {
            lastSpikeSpawnTime = game.time.now;

            var rand = Math.random();
            if(rand > 0.80) {spawnSpike("spike-top");}            // 15% chance of spawning a top spike
            else if(rand > 0.60) {spawnSpike("spike-bottom");}     // 15% chance of spawning a bottom spike
        }

        // Do stuff for each spike
        spikeGroup.forEach( function(currentSpike)
        {
            // Runs for each item in the group
            currentSpike.x -= track_current_speed;

        }, this);
    }

    function spawnSpike(spikeType)
    {
        console.log("Spawning spike:" + spikeType);

        tempSpike = game.add.sprite(game.world.width + 50, game.world.centerY, spikeType);
        if(spikeType === "spike-top")
        {
            tempSpike.anchor.setTo(0, 0);   // Top left
            tempSpike.y = borderTop.height - 5;
        }
        else if(spikeType === "spike-bottom")
        {
            tempSpike.anchor.setTo(0, 1.0); // Bottom left
            tempSpike.y = game.world.height - borderTop.height + 5;
        }

        spikeGroup.add(tempSpike);
    }

    function spawnBlood()
    {
        console.log("Spawning blood");

        tempBlood = game.add.sprite(game.world.width + 50, game.world.centerY, spikeType);
        if(spikeType === "spike-top")
        {
            tempSpike.anchor.setTo(0, 0);   // Top left
            tempSpike.y = borderTop.height - 5;
        }
        else if(spikeType === "spike-bottom")
        {
            tempSpike.anchor.setTo(0, 1.0); // Bottom left
            tempSpike.y = game.world.height - borderTop.height + 5;
        }

        spikeGroup.add(tempSpike);
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
            } else { accelerateIdle() }
            if(!heart.overlap(borderBottom))
            {
                if (downKey.isDown) { accelerate(-1); moveDown();  }
            } else { accelerateIdle() }


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

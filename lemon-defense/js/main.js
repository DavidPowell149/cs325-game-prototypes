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
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    var lemon;      // The player
    var laser;      // The laser
    var kitten;      // A kitten
    var laserGroup; // Group for lasers
    var kittenGroup; // Group for kittens
    var laserSpeed = 8;
    var player_acceleration = 0.15;  // The rate at which players change speed
    var player_current_speed = 0.0; // The player's current speed
    var player_max_speed = 7.0;     // Max speed player can move

    var leftKey;      // The keys to control the game
    var rightKey;
    var downKey;    // So you can't move the webpage
    var spaceKey;    // So you can't move the webpage

    // Kitten spawn time and laser fire rate
    var kittenSpawnTime = 1300;
    var lastKittenSpawnTime = 0;
    var laserFireRate = 100;
    var lastLaserSpawnTime = 0;



    // Scoring
    var score = 0;
    var scoreText;

    // Pre loads assets for game load
    function preload()
    {
        // Load in game assets
        game.load.image( "lemon", 'assets/lemon.png' );
        game.load.image( "kitten", 'assets/kitten.png' );
        game.load.image( "laser", 'assets/laser.png' );
    }

    // Called on game's initial creation state
    function create()
    {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // The yellow color background
        game.stage.backgroundColor = "FFFFCC";

        lemon = game.add.sprite(game.world.centerX, game.world.height-50, "lemon");
        lemon.scale.setTo(0.5,0.5);
        lemon.anchor.setTo(0.5,0.5);

        laserGroup = game.add.group();
        kittenGroup = game.add.group();
        laserGroup.physicsBodyType = Phaser.Physics.ARCADE;

        // Initialize the keys
        leftKey = game.input.keyboard.addKey(Phaser.KeyCode.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.KeyCode.RIGHT);
        downKey = game.input.keyboard.addKey(Phaser.KeyCode.DOWN);
        spaceKey = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    }

    // Runs every tick/iteration/moment/second
    function update()
    {
        playerMovement()
        // boundryCheck();
        moveLasers();
        moveKittens();
    }


    function moveKittens()
    {
        // Do stuff for each laser
        kittenGroup.forEach( function(currentLaser)
        {
            // Runs for each item in the group
            currentLaser.y -= laserSpeed;

            if(currentLaser.y < 50)
            {
                laserGroup.remove(currentLaser, true);  // Removes the laser from the group, and kills it
            }

        }, this);

        // Only allowed to be spawned once per press
        spaceKey.onDown.add(function(key)
        {
            lastLaserSpawnTime = game.time.now;

            laser = game.add.sprite(lemon.x, lemon.y-120, "laser");
            laser.scale.setTo(0.4,0.4);
            laserGroup.add(laser);
        }, this);
    }

    function moveLasers()
    {
        // Do stuff for each laser
        laserGroup.forEach( function(currentLaser)
        {
            // Runs for each item in the group
            currentLaser.y -= laserSpeed;

            if(currentLaser.y < 50)
            {
                laserGroup.remove(currentLaser, true);  // Removes the laser from the group, and kills it
            }

        }, this);

        // Only allowed to be spawned once per press
        spaceKey.onDown.add(function(key)
        {
            lastLaserSpawnTime = game.time.now;

            laser = game.add.sprite(lemon.x, lemon.y-120, "laser");
            laser.scale.setTo(0.4,0.4);
            laserGroup.add(laser);
        }, this);
    }




    function playerMovement()
    {
        if (leftKey.isDown && rightKey.isDown) { accelerateIdle() }   // Both are pressed. Do nothing
        else
        {
            if (!leftKey.isDown && !rightKey.isDown) { accelerateIdle() }   // Nothing is being pressed
            // if(lemon.x>100)
            {
                if (leftKey.isDown) { accelerate(1); moveLeft(); }
            }
            // else { accelerateIdle() }
            // if(lemon.x<game.world.width-100)
            {
                if (rightKey.isDown) { accelerate(-1); moveRight();  }
            }
            // else { accelerateIdle() }
        }
        // Infinite movement
        if(lemon.x < -30) { lemon.x = game.world.width }
        if(lemon.x > game.world.width+30) { lemon.x = 0 }
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
            lemon.x -= player_current_speed;
        }

        else if(player_current_speed < 0)
        {
            player_current_speed += player_acceleration;    // Move towards 0
            lemon.x -= player_current_speed;
        }
    }

    function moveLeft()
    {
        accelerate(1);
        lemon.x -= player_current_speed;
    }

    function moveRight()
    {
        accelerate(-1);
        lemon.x -= player_current_speed;
    }
};

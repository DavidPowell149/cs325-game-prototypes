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
    var laserSpeed = 500;
    var kittenSpeed = 200;
    var player_acceleration = 0.15;  // The rate at which players change speed
    var player_current_speed = 0.0; // The player's current speed
    var player_max_speed = 7.0;     // Max speed player can move


    // Kitten spawn time and laser fire rate
    var kittenSpawnTime = 1300;
    var lastKittenSpawnTime = 0;
    var laserFireRate = 200;
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

        lemon = game.add.sprite(game.world.centerX, game.world.centerY, "lemon");
        lemon.scale.setTo(0.4,0.4);
        lemon.anchor.setTo(0.4,0.4);

        laserGroup = game.add.group();
        laserGroup.enableBody = true;
        laserGroup.physicsBodyType = Phaser.Physics.ARCADE
        laserGroup.createMultiple(50, "laser");
        laserGroup.setAll("checkWorldBounds", true);
        laserGroup.setAll("outOfBoundsKill", true);

        kittenGroup = game.add.group();
        kittenGroup.enableBody = true;
        kittenGroup.physicsBodyType = Phaser.Physics.ARCADE
    }

    // Runs every tick/iteration/moment/second
    function update()
    {
        // playerMovement()
        // moveKittens();
        shootLaser();
    }


    function moveKittens()
    {
        // Spawn kitten if allowed
        if((game.time.now - lastKittenSpawnTime) > kittenSpawnTime)
        {
            lastKittenSpawnTime = game.time.now;
            kitten = game.add.sprite(Math.random()*(game.world.width-100), -75, "kitten");
            kitten.anchor.setTo(0.5);
            kitten.scale.setTo(0.4);
            kittenGroup.add(kitten);
        }


        // Do stuff for each kitten
        kittenGroup.forEach( function(currentKitten)
        {
            // Runs for each item in the group
            game.physics.arcade.moveToObject(currentKitten, lemon, kittenSpeed);


            // currentKitten.y += kittenSpeed;
            //
            // if(currentKitten.y > game.world.height-100)
            // {
            //     kittenGroup.remove(currentKitten, true);  // Removes the laser from the group, and kills it
            // }

        }, this);
    }


    function shootLaser()
    {
        if(game.input.activePointer.isDown)
        {
            if((game.time.now - lastLaserSpawnTime) > laserFireRate)
            {
                // Shooting
                lastLaserSpawnTime = game.time.now;

                // laser = game.add.sprite(lemon.x, lemon.y, "laser");



                var laser = laserGroup.getFirstDead();
                laser.scale.setTo(0.4);
                laser.anchor.setTo(0.5);
                laser.reset(lemon.x, lemon.y);
                laser.rotation = game.physics.arcade.angleToPointer(lemon);
                game.physics.arcade.moveToPointer(laser, laserSpeed);

            }
        }
    }
};

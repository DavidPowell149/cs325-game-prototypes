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
    var lemonGroup;      // The player
    var laserGroup; // Group for lasers
    var kittenGroup; // Group for kittens
    var laserSpeed = 500;
    var kittenSpeed = 200;


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

        // lemon = game.add.sprite(game.world.centerX, game.world.centerY, "lemon");
        lemonGroup = game.add.group();
        lemonGroup.enableBody = true;
        lemonGroup.physicsBodyType = Phaser.Physics.ARCADE
        lemonGroup.createMultiple(1, "lemon");

        lemon = lemonGroup.getFirstDead();
        lemon.reset(game.world.centerX, game.world.centerY);
        lemon.scale.setTo(0.4);
        lemon.anchor.setTo(0.5);

        laserGroup = game.add.group();
        laserGroup.enableBody = true;
        laserGroup.physicsBodyType = Phaser.Physics.ARCADE
        laserGroup.createMultiple(50, "laser");
        laserGroup.setAll("checkWorldBounds", true);
        laserGroup.setAll("outOfBoundsKill", true);

        kittenGroup = game.add.group();
        kittenGroup.enableBody = true;
        kittenGroup.physicsBodyType = Phaser.Physics.ARCADE
        kittenGroup.createMultiple(50, "kitten");
    }

    // Runs every tick/iteration/moment/second
    function update()
    {
        moveKittens();
        shootLaser();

        // Check collision
        game.physics.arcade.overlap(lemonGroup, kittenGroup, lemonHurt, null, this);
        game.physics.arcade.overlap(laserGroup, kittenGroup, killKitten, null, this);
    }

    function killKitten(laser, kitten)
    {
        // Both entities should be removed
        kitten.kill();
        laser.kill();

    }

    function lemonHurt(lemon, kitten)
    {
        // console.log("LEMON IS HURT");
    }

    function moveKittens()
    {
        // Spawn kitten if allowed
        if((game.time.now - lastKittenSpawnTime) > kittenSpawnTime)
        {
            lastKittenSpawnTime = game.time.now;
            var kitten = kittenGroup.getFirstDead();
            // kitten = game.add.sprite(Math.random()*(game.world.width-100), -75, "kitten");
            kitten.reset(Math.random()*(game.world.width-100), 75);
            kitten.anchor.setTo(0.5);
            kitten.scale.setTo(0.4);
        }


        // Do stuff for each kitten
        kittenGroup.forEach( function(currentKitten)
        {
            // Runs for each item in the group
            game.physics.arcade.moveToObject(currentKitten, lemon, kittenSpeed);

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

                var laser = laserGroup.getFirstDead();
                laser.scale.setTo(0.1);
                laser.anchor.setTo(0.5);
                laser.reset(lemon.x, lemon.y);
                laser.rotation = game.physics.arcade.angleToPointer(lemon);
                game.physics.arcade.moveToPointer(laser, laserSpeed);

            }
        }
    }
};

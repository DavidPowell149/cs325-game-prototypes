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
    var game = new Phaser.Game( 700, 700, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    var lemon;      // The player
    var lemonGroup;      // The player
    var laserGroup; // Group for lasers
    var kittenGroup; // Group for kittens
    var laserSpeed = 500;
    var kittenSpeed = 200;
    var gameStarted = false;

    // Kitten spawn time and laser fire rate
    var kittenSpawnTime = 1300;
    var lastKittenSpawnTime = 0;
    var laserFireRate = 200;
    var lastLaserSpawnTime = 0;


    // Scoring
    var score = 0;
    var scoreText;
    var health = 100;
    var healthText;

    // Game start
    var button_startGame;   // The start button
    var label_startGame;    // Label for starting game
    var label_instructions;

    // Audio
    var audio_water;
    var audio_hiss;
    var audio_growl;

    // Pre loads assets for game load
    function preload()
    {
        // Load in game assets
        game.load.image( "background", 'assets/background.png' );
        game.load.image( "lemon", 'assets/lemon.png' );
        game.load.image( "kitten", 'assets/kitten.png' );
        game.load.image( "laser", 'assets/laser.png' );

        game.load.audio( "water", 'assets/audio/water.wav' );
        game.load.audio( "hiss", 'assets/audio/hiss.wav' );
        game.load.audio( "growl", 'assets/audio/growl.wav' );
    }

    // Called on game's initial creation state
    function create()
    {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // The yellow color background
        var background = game.add.sprite(0, 0, "background");
        background.scale.setTo(1.4)

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

        initializeButton();
        var style = { font: "Verdana", fill: "#000000", align: "left", fontSize: "20px", wordWrap: true, wordWrapWidth: 690};
        label_instructions = game.add.text(5, 90, "The kittens are trying to kill the world's last lemon! Kittens don't like water though, so click to throw some water in the direction of a kitten. Save the last lemon!", style );

        var style = { font: "20px Verdana", fill: "#000000", align: "center" };
        scoreText = game.add.text(game.world.width-10, 5, "Score: " + score, style );
        scoreText.anchor.setTo(1.0, 0.0);

        healthText = game.add.text(20, 5, "Health: " + health, style );

        audio_water = game.add.audio("water");
        audio_hiss = game.add.audio("hiss");
        audio_growl = game.add.audio("growl");
    }

    // Runs every tick/iteration/moment/second
    function update()
    {
        difficultyIncrease();
        if(gameStarted)
        {
            moveKittens();
            shootLaser();

            // Check collision
            game.physics.arcade.overlap(lemonGroup, kittenGroup, lemonHurt, null, this);
            game.physics.arcade.overlap(laserGroup, kittenGroup, killKitten, null, this);
        }
    }

    function difficultyIncrease()
    {
        // If certain score, increase sequence length
        if(score >= 5) { kittenSpawnTime = 1000 }
        if(score >= 10) { kittenSpawnTime = 800 }
        if(score >= 15) { kittenSpawnTime = 600 }
        if(score >= 20) { kittenSpawnTime = 400 }
        if(score >= 25) { kittenSpawnTime = 300 }
        if(score >= 30) { kittenSpawnTime = 200 }
    }

    function killKitten(laser, kitten)
    {
        audio_hiss = game.add.audio("hiss");
        audio_hiss.play();
        kitten.kill();
        laser.kill();
        score += 1;
        updateGUI();
    }

    function lemonHurt(lemon, kitten)
    {
        audio_growl = game.add.audio("growl");
        audio_growl.play();
        kitten.kill();
        health -= 10;
        updateGUI();
        if(health<=0)
        {
            health = 0;
            gameOver();
        }
    }

    function moveKittens()
    {
        // Spawn kitten if allowed
        if((game.time.now - lastKittenSpawnTime) > kittenSpawnTime)
        {
            lastKittenSpawnTime = game.time.now;
            var kitten = kittenGroup.getFirstDead();
            var buffer = 30;
            var randX = getRandom(-(buffer*3), game.world.width+(buffer*3));
            var randY = getRandom(-(buffer*3), game.world.height+(buffer*3));
            while( (randX>(-buffer) && randX<(game.world.width+buffer)) && (randY>(-buffer) && randY<(game.world.height+buffer)) )
            {
                randX = getRandom(-(buffer*3), game.world.width+(buffer*3));
                randY = getRandom(-(buffer*3), game.world.height+(buffer*3));
            }
            kitten.reset(randX, randY);
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

    function startGame()
    {
        button_startGame.destroy();
        label_startGame.visible = false;
        label_instructions.destroy();
        gameStarted = true;
    }

    function initializeButton()
    {
        button_startGame = game.add.graphics(0, 0);
        button_startGame.beginFill(0xffff99);
        button_startGame.lineStyle(1, 0x000000, 1);
        button_startGame.drawRect(game.world.width/2-100, game.world.height/2-50, 200, 100);
        button_startGame.inputEnabled = true;
        button_startGame.events.onInputUp.add(startGame, this);
        var style = { font: "Verdana", fill: "black", align: "left", fontSize:"24px"};
        label_startGame = game.add.text(game.world.width/2, game.world.height/2, "Start Game", style );
        label_startGame.anchor.setTo(0.5,0.5);
    }

    function updateGUI()
    {
        scoreText.setText("Score: " + score);
        healthText.setText("Health: " + health);
    }

    function gameOver()
    {
        label_startGame.visible = true;
        label_startGame.setText("GAME OVER");
        gameStarted = false;
        lemonGroup.removeAll();
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
                laser.anchor.setTo(0.5);
                laser.reset(lemon.x, lemon.y);
                laser.rotation = game.physics.arcade.angleToPointer(lemon);
                game.physics.arcade.moveToPointer(laser, laserSpeed);
                audio_water = game.add.audio("water");
                audio_water.play();
            }
        }
    }

    function getRandom(min, max)
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};

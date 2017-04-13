var enterPressed;

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
    var game = new Phaser.Game(924, 500, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    var castleHealth = 100;
    var soldiersKilled = 0;
    var mainInput;  // The input for the game
    var gameStarted = false;    // Boolean flag for if the player has clicked start
    var playerEntering = false;    // Boolean flag for when the player can type in, vs when the card is up
    var sequenceUp = false;     // Boolean flag for when the sequence is up
    var inputBoxExists = false;     // Boolean flag for when the sequence is up
    var checkAnswer = false;     // Boolean flag for when the sequence is up
    var currentSequence;
    var firstFrameSequence;
    var sequenceDuration = 2*1000;   // How long the sequence is up for
    var userInput;  // The answer the player gives


    // Game logic
    var sequenceLength = 5;
    var sequenceText;
    var soldier;
    var soldierGroup;


    // Audio
    var audio_score;
    var audio_error;


    // GUI
    var button_startGame;   // The start button
    var label_startGame;    // Label for sum of money
    var label_health;        // Label for scoring
    var label_soldiersKilled;        // Label for scoring
    var label_instructions;
    var entryBoxOutline;   // The visual bar outline
    var entryBoxBounds = {x: 50, y: 420, width: 400, height: 30};  // Area the people should exist in
    var cardOutline;   // The visual bar outline
    var cardBoxBounds = {x: 20, y: 450, width: 400, height: 40};  // Area the people should exist in


    // Pre loads assets for game load
    function preload()
    {
        // Load in game assets
        game.load.image( 'background', 'assets/background.png' );
        game.load.audio( "score", 'assets/audio/score.mp3');
        game.load.audio( "error", 'assets/audio/error.wav');

    }

    // Called on game's initial creation state
    function create()
    {
        // The space background
        var background = game.add.sprite(0, 0, "background");
        background.scale.setTo(2,2);  // Original is 462 x 250
        game.add.plugin(PhaserInput.Plugin);    // The plugin for text
        game.stage.backgroundColor = "4d79ff";
        audio_score = game.add.audio("score");
        audio_error = game.add.audio("error");

        drawBoxes();
        initializeButton();
        generateSequence();

        // Hint text
        var style = { font: "Verdana", fill: "#000000", align: "left", fontSize: "20px", wordWrap: true, wordWrapWidth: 920};
        label_instructions = game.add.text(5, 90, "Your castle is under attack! A sequence of letters will appear at the bottom of the screen for a short time. Memorize it before it dissapears, then type it into the input box. The more letters you correctly match, the more soldiers you will kill. If a soldier makes it all the way across the screen, they damage your castle. Don't let your castle fall!", style );

        // Score text
        style = { font: "20px Verdana-bold", fill: "#000000", align: "center" }; // Make a style
        //earthHealthLabel = game.add.text( 10, 5, "Health: " + earth.health, earthHealthStyle ); // Apply it
        label_health = game.add.text(5, 5, "Castle health: " + castleHealth, style ); // Apply it
        label_soldiersKilled = game.add.text(game.world.width-5, 5, "Soldiers killed: " + soldiersKilled, style ); // Apply it
        label_soldiersKilled.anchor.setTo(1.0,0);
    }

    // Runs every tick/iteration/moment/second
    function update()
    {
        difficultyIncrease();   // Check if we should make it harder
        // The game is running
        if(gameStarted)
        {
            if(!playerEntering)    // The card is up, player must memorize
            {
                // Haven't displayed the sequence yet
                if(!sequenceUp)
                {
                    currentSequence = generateSequence();
                    showSequence(currentSequence);
                    firstFrameSequence = game.time.now;     // set when the sequence popped
                }
                if((game.time.now - firstFrameSequence) > sequenceDuration)   // It's been up for long enough
                {
                    sequenceText.destroy()  // Remove the sequence
                    sequenceUp = false;     // Change the state
                    playerEntering = true;  // It's time for the player to enter their answer
                }
            }
            else // The card is down and the player is entering.
            {
                if(!inputBoxExists)
                {
                    inputBoxExists = true;
                    generateNewInputBox();
                }
            }
        }
    }

    function difficultyIncrease()
    {
        // If certain score, increase sequence length
        if(soldiersKilled >= 10) { sequenceLength=6 }
        else if(soldiersKilled >= 20) { sequenceLength=7 }
        else if(soldiersKilled >= 30) { sequenceLength=8 }
        else if(soldiersKilled >= 40) { sequenceLength=9 }
        else if(soldiersKilled >= 50) { sequenceLength=10 }

        // If certain score, decrease time up
        if(soldiersKilled >= 20) { sequenceDuration = 3500 }  // Half a second
        else if(soldiersKilled >= 40) { sequenceDuration = 3000 }  // Half a second
    }

    function initializeButton()
    {
        button_startGame = game.add.graphics(0, 0);
        button_startGame.beginFill(0xffff99);
        button_startGame.lineStyle(1, 0x000000, 1);
        button_startGame.drawRect(game.world.width/2-100, game.world.height/2-25, 200, 50);
        button_startGame.inputEnabled = true;
        button_startGame.events.onInputUp.add(startGame, this);
        var style = { font: "Verdana", fill: "black", align: "left", fontSize:"24px"};
        label_startGame = game.add.text(game.world.width/2, game.world.height/2, "Start Game", style );
        label_startGame.anchor.setTo(0.5,0.5);
    }

    function drawBoxes()
    {
        cardOutline = game.add.graphics(0,0);
        cardOutline.beginFill(0x0039e6);
        cardOutline.lineStyle(1, 0x000000, 1);
        cardOutline.drawRect(cardBoxBounds.x, cardBoxBounds.y, cardBoxBounds.width, cardBoxBounds.height);
    }

    function showSequence(sequence)
    {
        var style = { font: "Verdana", fill: "#FFFFFF", align: "left", fontSize: "30px"};
        sequenceText = game.add.text(cardBoxBounds.x+cardBoxBounds.width/2, cardBoxBounds.y+cardBoxBounds.height/2, sequence, style);
        sequenceText.anchor.setTo(0.5,0.5);
        sequenceUp = true;
    }


    function generateSequence()
    {
        var sequence = "";
        var i = 0;
        for(i; i<sequenceLength; i++)
        {
            var ascii = Math.floor(Math.random()*26);
            var char = String.fromCharCode(97 + ascii);
            sequence += char;
        }
        return sequence;
    }


    function removeHint()
    {
        label_instructions.destroy();
    }

    function startGame()
    {
        button_startGame.destroy();
        label_startGame.destroy();

        gameStarted = true;
    }


    enterPressed = function()
    {
        // Grab value
        userInput = mainInput.value;
        console.log("Hit enter: " + userInput);

        // Delete it and make a new one, because I can't seem to get consecutive inputs to work otherwise.
        mainInput.endFocus();
        mainInput.destroy();
        inputBoxExists = false; // We just destroyed it. Change the state
        playerEntering = false; // Player is no longer entering anything

        checking();      // Time to check the answer
    }


    function checking()
    {
        var i=0;
        var scoreThisRound = 0;
        for(i; i<userInput.length; i++)
        {
            if(currentSequence[i] === userInput[i])
            {
                scoreThisRound++;
                audio_score.play();
            }
        }
        if(scoreThisRound === 0)  // They got no more points
        {
            audio_error.play();
        }
        killSoldiers(scoreThisRound);
        spawnSoldiers(currentSequence.length-scoreThisRound);
        label_health.setText("Castle health: " + castleHealth );
        label_soldiersKilled.setText("Soldiers killed: " + soldiersKilled );
        label_soldiersKilled.x = game.world.width-5;
    }

    function spawnSoldiers(numToSpawn)
    {
        // SPAWN NUMBER OF SOLDIERS
    }

    function killSoldiers(numKilled)
    {
        soldiersKilled += numKilled;
        // KILL THEM
    }


    function generateNewInputBox()
    {
        mainInput = game.add.inputField(game.world.width/2+50, game.world.height-50, {
            font: '30px Arial',
            fill: 'black',
            fillAlpha: "1",
            fontWeight: 'bold',
            width: entryBoxBounds.width-15,
            padding: 4,
            placeHolder: "Click to focus"
        });
        mainInput.startFocus();
        mainInput.focusOutOnEnter = false;
    }

};

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
    var game = new Phaser.Game(900, 700, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    var mainInput;  // The input for the game
    var gameStarted = false;    // Boolean flag for if the player has clicked start
    var playerEntering = false;    // Boolean flag for when the player can type in, vs when the card is up


    // Game logic
    var sequenceLength = 10;

    // GUI
    var button_startGame;   // The start button
    var label_startGame;    // Label for sum of money
    var hintText;
    var entryBoxOutline;   // The visual bar outline
    var entryBoxBounds = {x: 50, y: 600, width: 800, height: 50};  // Area the people should exist in
    var cardOutline;   // The visual bar outline
    var cardBoxBounds = {x: 50, y: 200, width: 800, height: 200};  // Area the people should exist in


    // Pre loads assets for game load
    function preload()
    {
        // Load in game assets
        // game.load.image( "heart", 'assets/heart.png' );

    }

    // Called on game's initial creation state
    function create()
    {
        game.add.plugin(PhaserInput.Plugin);    // The plugin for text
        game.stage.backgroundColor = "CC0000";




        drawBoxes();
        initializeButton();
        generateSequence();

        // Hint text
        var style = { font: "Verdana", fill: "#000000", align: "left", fontSize: "20px"};
        hintText = game.add.text(5, 5, "Instructions:\n\nWhen the letters pop up, try to memorize them as quickly as you can. \nType the sequence as accurately as possible to get points.\nClick on hint to remove it.", style );
        hintText.inputEnabled = true;
        hintText.events.onInputUp.add(removeHint, this);
    }

    // Runs every tick/iteration/moment/second
    function update()
    {
        // The game is running
        if(gameStarted)
        {
            // The card is up, player must memorize
            if(!playerEntering)
            {

            }
            // The card is down and the player is entering.
            else
            {

            }
        }
    }

    function initializeButton()
    {
        button_startGame = game.add.graphics(0, 0);
        button_startGame.beginFill(0xffff99);
        button_startGame.lineStyle(1, 0x000000, 1);
        button_startGame.drawRect(cardBoxBounds.x+(cardBoxBounds.width/2)-100, cardBoxBounds.y+50, 200, 100);
        button_startGame.inputEnabled = true;
        button_startGame.events.onInputUp.add(startGame, this);
        var style = { font: "Verdana", fill: "black", align: "left", fontSize:"24px"};
        label_startGame = game.add.text(450, 304, "Start Game", style );
        label_startGame.anchor.setTo(0.5,0.5);
    }

    function drawBoxes()
    {
        // entryBoxOutline = game.add.graphics(0,0);
        // entryBoxOutline.lineStyle(1, 0x000000, 1);
        // entryBoxOutline.drawRect(entryBoxBounds.x, entryBoxBounds.y, entryBoxBounds.width, entryBoxBounds.height);
        cardOutline = game.add.graphics(0,0);
        cardOutline.beginFill(0x0066FF);
        cardOutline.lineStyle(1, 0x000000, 1);
        cardOutline.drawRect(cardBoxBounds.x, cardBoxBounds.y, cardBoxBounds.width, cardBoxBounds.height);
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
        hintText.destroy();
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
        var userInput = mainInput.value;
        console.log("Hit enter: " + userInput);

        // Delete it and make a new one, because I can't seem to get consecutive inputs to work otherwise.
        mainInput.endFocus();
        mainInput.destroy();
        generateNewInputBox();
    }

    function generateNewInputBox()
    {
        mainInput = game.add.inputField(entryBoxBounds.x, entryBoxBounds.y, {
            font: '40px Arial',
            fill: 'black',
            fillAlpha: "1",
            fontWeight: 'bold',
            width: entryBoxBounds.width-15,
            padding: 10,
            placeHolder: "Click here to type. Press enter to submit."
        });
        mainInput.startFocus();
        mainInput.focusOutOnEnter = false;
    }

};

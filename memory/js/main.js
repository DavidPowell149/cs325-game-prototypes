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
    var startButton;

    // GUI
    var button_startGame;   // The start button
    var entryBoxOutline;   // The visual bar outline
    var entryBoxBounds = {x: 50, y: 600, width: 800, height: 50};  // Area the people should exist in
    var cardOutline;   // The visual bar outline
    var cardBoxBounds = {x: 50, y: 200, width: 800, height: 200};  // Area the people should exist in


    // Pre loads assets for game load
    function preload()
    {
        // Load in game assets
        // game.load.image( "heart", 'assets/heart.png' );

        // Draw
        entryBoxOutline = game.add.graphics(0,0);
        entryBoxOutline.lineStyle(1, 0x000000, 1);
        entryBoxOutline.drawRect(entryBoxBounds.x, entryBoxBounds.y, entryBoxBounds.width, entryBoxBounds.height);
        cardOutline = game.add.graphics(0,0);
        cardOutline.beginFill(0x0066FF);
        cardOutline.lineStyle(1, 0x000000, 1);
        cardOutline.drawRect(cardBoxBounds.x, cardBoxBounds.y, cardBoxBounds.width, cardBoxBounds.height);
    }

    // Called on game's initial creation state
    function create()
    {
        game.add.plugin(PhaserInput.Plugin);    // The plugin for text
        game.stage.backgroundColor = "CC0000";

        startButton = this.add.button(cardBoxBounds.x, cardBoxBounds.y, 'playButton', this.startGame, this, 'over', 'out', 'down');

        mainInput = game.add.inputField(entryBoxBounds.x, entryBoxBounds.y, {
            font: '40px Arial',
            fill: 'black',
            fillAlpha: "1",
            fontWeight: 'bold',
            width: entryBoxBounds.width,
            padding: 10,
            placeHolder: "Click here to type. Press enter to submit."
        });
        mainInput.focusOutOnEnter = false;
        // mainInput.setText("tst");
        // enterKey = game.input.keyboard.addKey(Phaser.KeyCode.ENTER);
        // enterKey.onDown.add(enterPressed, this);


    }

    // Runs every tick/iteration/moment/second
    function update()
    {
        if(!gameStarted)
        {

        }
        else
        {

        }
    }


    enterPressed = function()
    {
        // Grab value
        var userInput = mainInput.value;
        console.log("Hit enter: " + userInput);

        // Delete it and make a new one, because I can't seem to get consecutive inputs to work otherwise.
        mainInput.endFocus();
        mainInput.destroy();
        mainInput = game.add.inputField(entryBoxBounds.x, entryBoxBounds.y, {
            font: '40px Arial',
            fill: 'black',
            fillAlpha: "1",
            fontWeight: 'bold',
            width: entryBoxBounds.width,
            padding: 10,
            placeHolder: ""
        });
        mainInput.startFocus();
    }

};

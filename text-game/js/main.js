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
    var game = new Phaser.Game( 800, 700, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    var mainInput;  // The input for the game


    // Pre loads assets for game load
    function preload()
    {
        // Load in game assets
        //game.load.image( "heart", 'assets/heart.png' );

    }

    // Called on game's initial creation state
    function create()
    {
        game.add.plugin(PhaserInput.Plugin);


        var mainInput = game.add.inputField(0, game.world.height - 50, {
            font: '18px Arial',
            fill: 'white',
            fillAlpha: "0",
            fontWeight: 'bold',
            width: game.world.width,
            padding: 8,
            placeHolder: ">"
        });
        mainInput.focusOutOnEnter = false;
        // mainInput.setText("tst");

    }

    // Runs every tick/iteration/moment/second
    function update()
    {

    }


    function hitEnter()
    {
        console.log("Hit enter");
    }

};

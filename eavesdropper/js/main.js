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
    var game = new Phaser.Game(window.innerWidth*0.9, window.innerHeight*0.9, Phaser.AUTO, 'game', { preload: preload, create: create, update: update} );

    // Entities
    var player;     // The player's avatar
    var person;
    var personGroup;    // The group for the people

    // GUI
    var label_currentMoneySum;    // Label for sum of money
    var label_moneyRate;          // Label for money earning rate
    var saleBarOutline;     // The visual bar outline
    var saleBarFill;        // The visual bar filler



    // Game logic
    var currentMoneySum=0;    // Money the player currently has in their "pocket"
    var moneyRate=0;          // Rate at which player earns cash
    var bonusAmount = 500;
    var bonusMax = 1000;

    // Pre loads assets for game load
    function preload()
    {
        // Load in game assets
        game.load.image( "player", 'assets/player.png' );
        game.load.image( "person", 'assets/person.png' );

    }

    // Called on game's initial creation state
    function create()
    {
        // The background
        game.stage.backgroundColor = "#E6E6E6";

        // The player
        player = game.add.sprite(game.world.centerX, game.world.centerY, "player");
        player.anchor.setTo(0.5,0.5);
        player.scale.setTo(game.world.width*0.00007, game.world.width*0.00007);

        // The person and their group
        person = game.add.sprite(game.world.centerX+20, game.world.centerY+20, "person");
        person.anchor.setTo(0.5,0.5);
        person.scale.setTo(game.world.width*0.00005, game.world.width*0.00005);
        personGroup = game.add.group();  // Group for spikes


        //
        // GUI initiliaiztion
        //
        // The left bar for the sale bonus bar
        saleBarOutline = game.add.graphics(0,0);
        saleBarOutline.lineStyle(1, 0x000000, 1);
        saleBarOutline.drawRect(0, 0, game.world.width*0.03, game.world.height-1);
        // Initialize labels
        var size_currentMoneySum = Math.min(game.world.width, game.world.height)*0.05;
        var size_moneyRate = Math.min(game.world.width, game.world.height)*0.025;
        var style = { font: "Verdana", fill: "#000000", align: "left", fontSize: String(size_currentMoneySum)+"px"};
        label_currentMoneySum = game.add.text(game.world.width*0.04, game.world.height*0.01, "$" + Math.floor(currentMoneySum), style );
        style = { font: "Verdana", fill: "#000000", align: "left", fontSize: String(size_moneyRate)+"px" };
        label_moneyRate = game.add.text(game.world.width*0.04, game.world.height*0.08, "at $" + Math.floor(moneyRate) + " per sec", style );


    }

    // Runs every tick/iteration/moment/second
    function update()
    {
        drawSaleBar();
        updateLabels();
        currentMoneySum += moneyRate;
        moneyRate += 0.01;
    }


    function updateLabels()
    {
        label_currentMoneySum.setText("$" + Math.floor(currentMoneySum));
        if(moneyRate < 100) { label_moneyRate.setText("at $" + moneyRate.toFixed(2) + " per sec");}
        else { label_moneyRate.setText("at $" + Math.floor(moneyRate) + " per sec");}
    }


    function drawSaleBar()
    {
        saleBarFill = game.add.graphics(0,0);
        saleBarFill.beginFill(0x008214);
        saleBarFill.lineStyle(1, 0x008214, 1);
        saleBarFill.drawRect(1, (game.world.height-1)-(game.world.height*(bonusAmount/bonusMax)), game.world.width*0.03-2, (game.world.height*(bonusAmount/bonusMax)));
    }

};

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
    var tempPerson;
    var personGroup;    // The group for the people
    var peopleBounds;

    // GUI
    var label_currentMoneySum;    // Label for sum of money
    var label_moneyRate;          // Label for money earning rate
    var saleBarOutline;     // The visual bar outline
    var saleBarFill;        // The visual bar filler

    var button_eavesdropAmount; // The first button option
    var button_moneyRate;       // The second button option
    var button_sellBonus;       // Selling the bonus bar
    var label_eavesdropButton;    // Label for sum of money
    var label_rateButton;          // Label for money earning rate
    var label_sellButton;          // Label for money earning rate


    // Game logic
    var currentMoneySum=0;    // Money the player currently has in their "pocket"
    var moneyRate=0;          // Rate at which player earns cash
    var bonusAmount = 1;
    var bonusMax = 10;
    var moneyUpdateTime = 1000;     // Update every second
    var lasyMoneyUpdate = 0;
    var peopleUpdateTime = 7000;     // Update every 7 seconds
    var lastPeopleUpdate = 0;


    // Upgrade data
    var upgrade_eavesdropPrices =   [100, 500, 2000, 5000, 10000];
    var upgrade_eavesdropValues =   [10, 50, 250, 500, 1000];
    var upgrade_ratePrices =        [10, 100, 200, 1000, 5000];
    var upgrade_rateValues =        [1, 2, 5, 10, 20];


    // Pre loads assets for game load
    function preload()
    {
        // Load in game assets
        game.load.image( "player", 'assets/player.png' );
        game.load.image( "person", 'assets/person.png' );
        game.load.image( "person_red", 'assets/person_red.png' );
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

        initializePeople();

        initializeGUI();

        initializeButtons();
    }

    // Runs every tick/iteration/moment/second
    function update()
    {
        updatePeople();
        updateBonusBar();
        updateLabels();
        updateButtons();
        calculateMoney();
    }

    function initializePeople()
    {
        // The crowd
        personGroup = game.add.group();  // Group for spikes
        peopleBounds = {x: game.world.width*0.20, y:game.world.height*0.20, width: game.world.width*0.60, height: game.world.height*0.60};  // Area the people should exist in
        var peopleGridWidth = 11;
        var peopleGridHeight = 11;
        var peopleTileWidth = peopleBounds.width/peopleGridWidth;
        var peopleTileHeight = peopleBounds.height/peopleGridHeight;
        var c;
        for(c=0; c<peopleGridHeight; c++)
        {
            var r;
            for(r=0; r<peopleGridWidth; r++)
            {
                var baseX = peopleBounds.x + (peopleTileWidth*r) + peopleTileWidth/2;
                var baseY = peopleBounds.y + (peopleTileHeight*c) + peopleTileHeight/2;
                var x = baseX + Math.random()*peopleTileWidth-(peopleTileWidth/2) ;
                var y = baseY + Math.random()*peopleTileHeight-(peopleTileHeight/2);

                tempPerson = game.add.sprite(x, y, "person");
                tempPerson.anchor.setTo(0.5,0.5);
                var personSize = Math.min(peopleTileWidth,peopleTileHeight)*0.0014;
                tempPerson.scale.setTo(personSize, personSize);
                personGroup.add(tempPerson);
            }
        }
    }

    function initializeGUI()
    {
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

    function initializeButtons()
    {
        // Buttons
        button_eavesdropAmount = game.add.graphics(0,0);
        button_eavesdropAmount.beginFill(0x404040);
        button_eavesdropAmount.lineStyle(1, 0x000000, 1);
        button_eavesdropAmount.drawRect(game.world.width*0.85-1, game.world.height*0.10, game.world.width*0.15, game.world.height*0.1);
        button_eavesdropAmount.inputEnabled = true;
        button_eavesdropAmount.events.onInputUp.add(boughtEavesdrop, this);
        button_moneyRate = game.add.graphics(0,0);
        button_moneyRate.beginFill(0x404040);
        button_moneyRate.lineStyle(1, 0x000000, 1);
        button_moneyRate.drawRect(game.world.width*0.85-1, game.world.height*0.21, game.world.width*0.15, game.world.height*0.1);
        button_eavesdropAmount.inputEnabled = true;
        button_eavesdropAmount.events.onInputUp.add(boughtRate, this);
        button_sellBonus = game.add.graphics(0,0);
        button_sellBonus.beginFill(0x404040);
        button_sellBonus.lineStyle(1, 0x000000, 1);
        button_sellBonus.drawRect(game.world.width*0.85-1, game.world.height*0.32, game.world.width*0.15, game.world.height*0.1);
        button_eavesdropAmount.inputEnabled = true;
        button_eavesdropAmount.events.onInputUp.add(soldBonus, this);
    }


    // Calculates the money the player has earned this update cycle
    function calculateMoney()
    {
        // Spawn spikes if allowed
        if((game.time.now - lasyMoneyUpdate) > moneyUpdateTime)
        {
            lasyMoneyUpdate = game.time.now;
            currentMoneySum += moneyRate;
        }

    }


    // Updates the people and their state
    function updatePeople()
    {
        if((game.time.now - lastPeopleUpdate) > peopleUpdateTime)
        {
            lastPeopleUpdate = game.time.now;

            // Do stuff for each person
            personGroup.forEach( function(person)
            {
                // This code runs for each item in the group

                var conversationChance = Math.random();
                if(conversationChance >= 0.99)
                {
                    person.inputEnabled = true;
                    person.loadTexture("person_red");
                }


            }, this);

        }

        // Do stuff for each person
        personGroup.forEach( function(person)
        {
            // This code runs for each item in the group
            // Check if clicked
            person.events.onInputUp.add(personClicked, this, person);
        }, this);





    }

    // Update the text labels to represent the actual values
    function updateLabels()
    {
        label_currentMoneySum.setText("$" + Math.floor(currentMoneySum));
        if(moneyRate < 100) { label_moneyRate.setText("at $" + moneyRate.toFixed(2) + " per sec");}
        else { label_moneyRate.setText("at $" + Math.floor(moneyRate) + " per sec");}
    }


    // Update the bonus bar to represent the right values
    function updateBonusBar()
    {
        saleBarFill = game.add.graphics(0,0);
        saleBarFill.beginFill(0x008214);
        saleBarFill.lineStyle(1, 0x008214, 1);
        saleBarFill.drawRect(1, (game.world.height-1)-(game.world.height*(bonusAmount/bonusMax)), game.world.width*0.03-2, (game.world.height*(bonusAmount/bonusMax)));
    }

    // Adjusts button state and appearance
    function updateButtons()
    {
        
    }

    // Runs when a person is legally clicked
    function personClicked(person)
    {
        person.loadTexture("person");
        if(bonusAmount<10) { bonusAmount += 1; }    // Update bar
    }

    function boughtEavesdrop()
    {
        console.log("Bought eavesdrop");
    }

    function boughtRate()
    {
        console.log("Bought rate increase");
    }

    function soldBonus()
    {
        console.log("Sold Bonus");
    }

};

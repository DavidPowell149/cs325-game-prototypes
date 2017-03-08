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

    // Audio
    var audio_crowd;
    var audio_coin;
    var audio_upgrade;
    var audio_gather;

    // GUI
    var label_currentMoneySum;    // Label for sum of money
    var label_moneyRate;          // Label for money earning rate
    var saleBarOutline;     // The visual bar outline
    var saleBarFill;        // The visual bar filler
    var pavement;
    var pavementBounds;

    var button_eavesdropAmount; // The first button option
    var button_moneyRate;       // The second button option
    var button_sellBonus;       // Selling the bonus bar
    var label_eavesdropHeader;    // Label for sum of money
    var label_eavesdropDetail;
    var label_rateHeader;          // Label for money earning rate
    var label_rateDetail;
    var label_sellHeader;          // Label for money earning rate
    var label_sellDetail;

    var hintText;       // The instructions

    // Game logic
    var currentMoneySum=0;    // Money the player currently has in their "pocket"
    var bonusAmount = 0;
    var bonusMax = 10;
    var personSpeed=4;
    var moneyUpdateTime = 1000;     // Update every second
    var lasyMoneyUpdate = 0;
    var peopleUpdateTime = 300;     // Update every second
    var lastPeopleUpdate = 0;
    var peopleCreateTime = 50;
    var lastPeopleCreate = 0;


    // Upgrade data
    var upgrade_eavesdropPrices =       [50, 200, 500, 1000, 5000, 10000, 20000, 50000];
    var upgrade_eavesdropValues =   [10, 25, 50, 100, 200, 400, 600, 800, 1000];
    var upgrade_ratePrices =        [10, 100, 200, 1000, 5000, 10000, 15000, 25000];
    var upgrade_rateValues =        [0, 1, 2, 5, 10, 20, 30, 40, 50];


    // Pre loads assets for game load
    function preload()
    {
        // Load in game assets
        game.load.image( "player", 'assets/player.png' );
        game.load.image( "person", 'assets/person.png' );
        game.load.image( "person_red", 'assets/person_red.png' );
        game.load.image( "pavement", 'assets/pavement.jpg' );
        // Audio
        game.load.audio( "crowd", 'assets/audio/crowd.wav');
        game.load.audio( "coin", 'assets/audio/coin.mp3');
        game.load.audio( "upgrade", 'assets/audio/upgrade.wav');
        game.load.audio( "gather", 'assets/audio/gather.wav');

    }

    // Called on game's initial creation state
    function create()
    {
        // The background
        game.stage.backgroundColor = "#E6E6E6";

        // The pavement
        pavementBounds = {x: 0, y:game.world.height*0.20, width: game.world.width, height: game.world.height*0.60};  // Area the people should exist in
        pavement = game.add.tileSprite(pavementBounds.x, pavementBounds.y, pavementBounds.width, pavementBounds.height, "pavement");

        // The player
        player = game.add.sprite(game.world.centerX, game.world.centerY, "player");
        player.anchor.setTo(0.5,0.5);
        player.scale.setTo(game.world.width*0.00007, game.world.width*0.00007);

        audio_crowd = game.add.audio('crowd');
        audio_crowd.loop = true;
        audio_crowd.volume = 0.8;
        audio_crowd.play();
        audio_coin = game.add.audio('coin');
        audio_upgrade = game.add.audio('upgrade');
        audio_upgrade.volume= 0.3;
        audio_gather = game.add.audio('gather');

        // Initialize people
        personGroup = game.add.group();  // Group for spikes

        initializeButtons();
        initializeGUI();
    }

    // Runs every tick/iteration/moment/second
    function update()
    {
        updatePeople();
        updateLabels();
        updateButtons();
        calculateMoney();
        generatePeople();
    }

    function generatePeople()
    {
        if((game.time.now - lastPeopleCreate) > peopleCreateTime)
        {
            lastPeopleCreate = game.time.now;

            tempPerson = game.add.sprite(0, Math.random()*(pavementBounds.height*0.9)+(pavementBounds.y+pavementBounds.height*0.05), "person");
            tempPerson.anchor.setTo(0.5,0.5);
            var personSize = Math.min(game.world.width*0.00008, game.world.height*0.00008)
            tempPerson.scale.setTo(personSize, personSize);
            tempPerson.inputEnabled = true;
            personGroup.add(tempPerson);
        }
    }


    function initializeGUI()
    {
        //
        // GUI initiliaiztion
        //
        saleBarFill = game.add.graphics(0,0);

        // Initialize money labels
        var size_currentMoneySum = Math.min(game.world.width, game.world.height)*0.05;
        var size_moneyRate = Math.min(game.world.width, game.world.height)*0.025;
        var style = { font: "Verdana", fill: "#000000", align: "left", fontSize: String(size_currentMoneySum)+"px"};
        label_currentMoneySum = game.add.text(game.world.width*0.04, game.world.height*0.01, "$" + Math.floor(currentMoneySum), style );
        style = { font: "Verdana", fill: "#000000", align: "left", fontSize: String(size_moneyRate)+"px" };
        label_moneyRate = game.add.text(game.world.width*0.04, game.world.height*0.08, "at $" + Math.floor(upgrade_rateValues[0]) + " per sec", style );

        // Initialize button labels
        var size_buttonHeader = Math.min(game.world.width, game.world.height)*0.023;
        var size_buttonDetail = Math.min(game.world.width, game.world.height)*0.030;
        var style = { font: "Verdana", fill: "#F2F2F2", align: "left", fontSize: String(size_buttonHeader)+"px", wordWrap: true, wordWrapWidth: button_eavesdropAmount.width};
        label_eavesdropHeader = game.add.text(button_eavesdropAmount.x+game.world.width*0.01, button_eavesdropAmount.y+game.world.height*0.01, "Increase conversation profit", style );
        label_rateHeader =      game.add.text(button_moneyRate.x+game.world.width*0.01, button_moneyRate.y+game.world.height*0.01, "Increase $ per sec", style );
        label_sellHeader =      game.add.text(button_sellBonus.x+game.world.width*0.01, button_sellBonus.y+game.world.height*0.01, "Sell conversation", style );
        style = { font: "Verdana", fill: "#F2F2F2", align: "left", fontSize: String(size_buttonDetail)+"px", wordWrap: true, wordWrapWidth: button_eavesdropAmount.width*3/4};
        label_eavesdropDetail = game.add.text(button_eavesdropAmount.x+button_eavesdropAmount.width*0.05, button_eavesdropAmount.y+button_eavesdropAmount.height-button_eavesdropAmount.height*0.4, "$" + upgrade_eavesdropPrices[0], style );
        label_rateDetail      = game.add.text(button_moneyRate.x+button_moneyRate.width*0.05, button_moneyRate.y+button_moneyRate.height-button_moneyRate.height*0.4, "$" + upgrade_ratePrices[0], style );
        label_sellDetail      = game.add.text(button_sellBonus.x+button_sellBonus.width*0.05, button_sellBonus.y+button_sellBonus.height-button_sellBonus.height*0.4, "+ $" + upgrade_eavesdropValues[0], style );


        // Hint
        style = { font: "Verdana", fill: "#000000", align: "left", fontSize: String(Math.min(game.world.width, game.world.height)*0.02)+"px", wordWrap: true, wordWrapWidth: game.world.width*0.50};
        hintText = game.add.text(game.world.width*0.50, game.world.height*0.02, "1. Click on red people to eavesdrop on bits of a conversation.\n2. Sell a full conversation for bonus cash.\n\nClick to hide instructions.", style );
        hintText.inputEnabled = true;
        hintText.events.onInputUp.add(removeHint, this);
    }

    function initializeButtons()
    {
        // Buttons
        button_eavesdropAmount = game.add.graphics(game.world.width*0.20, game.world.height-(game.world.height*0.15)-2);
        button_eavesdropAmount.beginFill(0xD9D9D9);
        button_eavesdropAmount.lineStyle(1, 0x000000, 1);
        button_eavesdropAmount.drawRect(0,0, game.world.width*0.17, game.world.height*0.15);
        button_eavesdropAmount.inputEnabled = false;
        button_eavesdropAmount.events.onInputUp.add(boughtEavesdrop, this);
        button_moneyRate = game.add.graphics(game.world.centerX-(game.world.width*0.17)/2, game.world.height-(game.world.height*0.15)-2);
        button_moneyRate.beginFill(0xD9D9D9);
        button_moneyRate.lineStyle(1, 0x000000, 1);
        button_moneyRate.drawRect(0,0, game.world.width*0.17, game.world.height*0.15);
        button_moneyRate.inputEnabled = false;
        button_moneyRate.events.onInputUp.add(boughtRate, this);
        button_sellBonus = game.add.graphics(game.world.width*0.63, game.world.height-(game.world.height*0.15)-2);
        button_sellBonus.beginFill(0xD9D9D9);
        button_sellBonus.lineStyle(1, 0x000000, 1);
        button_sellBonus.drawRect(0,0, game.world.width*0.17, game.world.height*0.15);
        button_sellBonus.inputEnabled = false;
        button_sellBonus.events.onInputUp.add(soldBonus, this);
    }


    // Calculates the money the player has earned this update cycle
    function calculateMoney()
    {
        if((game.time.now - lasyMoneyUpdate) > moneyUpdateTime)
        {
            lasyMoneyUpdate = game.time.now;
            currentMoneySum += upgrade_rateValues[0];
        }
    }


    // Updates the people and their state
    function updatePeople()
    {
        // Move pavement as well
        pavement.tilePosition.x += personSpeed/2;

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
                    person.loadTexture("person_red");
                }

            }, this);
        }

        // Do stuff for each person
        personGroup.forEach( function(person)
        {
            // This code runs for each item in the group
            // Move to the right
            person.x = person.x+personSpeed;

            // Check if clicked
            person.events.onInputUp.add(personClicked, this, person);

            // Check if person goes off screen
            if(person.x > game.world.width+game.world.width*0.05)
            {
                person.destroy();
            }

        }, this);

    }

    // Update the text labels to represent the actual values
    function updateLabels()
    {
        label_currentMoneySum.setText("$" + Math.floor(currentMoneySum));
        if(upgrade_rateValues[0] < 100) { label_moneyRate.setText("at $" + upgrade_rateValues[0].toFixed(2) + " per sec");}
        else { label_moneyRate.setText("at $" + Math.floor(upgrade_rateValues[0]) + " per sec");}
    }


    // Update the bonus bar to represent the right values
    function updateBonusBar()
    {
        saleBarFill.clear();    // Clear it so we can redraw
        saleBarFill.beginFill(0x008214);
        saleBarFill.lineStyle(1, 0x008214, 1);
        saleBarFill.drawRect(1, (game.world.height-1)-(game.world.height*(bonusAmount/bonusMax)), game.world.width*0.03-2, (game.world.height*(bonusAmount/bonusMax)));
    }

    // Adjusts button state and appearance
    function updateButtons()
    {
        // Update button detail labels
        label_eavesdropDetail.setText("$" + upgrade_eavesdropPrices[0]);
        label_rateDetail.setText("$" + upgrade_ratePrices[0]);
        label_sellDetail.setText("+ $" + upgrade_eavesdropValues[0]);

        // Eavesdrop upgrade
        if(currentMoneySum >= upgrade_eavesdropPrices[0])   // Enough money
        {
            button_eavesdropAmount.clear();
            button_eavesdropAmount.beginFill(0x404040);
            button_eavesdropAmount.lineStyle(1, 0x000000, 1);
            button_eavesdropAmount.drawRect(0,0, game.world.width*0.17, game.world.height*0.15);
            label_eavesdropDetail.addColor("#FFFFFF", 0);    // Color header text
            label_eavesdropDetail.addColor("#FFFFFF", 0);    // Color detail text
            button_eavesdropAmount.inputEnabled = true;       // Give clickability
        }
        else
        {
            button_eavesdropAmount.clear();
            button_eavesdropAmount.beginFill(0xD9D9D9);
            button_eavesdropAmount.lineStyle(1, 0x000000, 1);
            button_eavesdropAmount.drawRect(0,0, game.world.width*0.17, game.world.height*0.15);
            label_eavesdropDetail.addColor("#F2F2F2", 0);    // Color header text
            label_eavesdropDetail.addColor("#F2F2F2", 0);    // Color detail text
            button_eavesdropAmount.inputEnabled = false;      // Remove clickability
        }

        // Money rate upgrade
        if(currentMoneySum >= upgrade_ratePrices[0])
        {
            button_moneyRate.clear();
            button_moneyRate.beginFill(0x404040);
            button_moneyRate.lineStyle(1, 0x000000, 1);
            button_moneyRate.drawRect(0,0, game.world.width*0.17, game.world.height*0.15);
            label_rateHeader.addColor("#FFFFFF", 0);    // Color header text
            label_rateHeader.addColor("#FFFFFF", 0);    // Color detail text
            button_moneyRate.inputEnabled = true;       // Give clickability
        }
        else
        {
            button_moneyRate.clear();
            button_moneyRate.beginFill(0xD9D9D9);
            button_moneyRate.lineStyle(1, 0x000000, 1);
            button_moneyRate.drawRect(0,0, game.world.width*0.17, game.world.height*0.15);
            label_rateHeader.addColor("#F2F2F2", 0);    // Color header text
            label_rateDetail.addColor("#F2F2F2", 0);    // Color detail text
            button_moneyRate.inputEnabled = false;      // Remove clickability
        }

        if(bonusAmount == bonusMax)
        {
            button_sellBonus.clear();
            button_sellBonus.beginFill(0x404040);
            button_sellBonus.lineStyle(1, 0x000000, 1);
            button_sellBonus.drawRect(0,0, game.world.width*0.17, game.world.height*0.15);
            label_sellHeader.addColor("#FFFFFF", 0);    // Color header text
            label_sellDetail.addColor("#FFFFFF", 0);    // Color detail text
            button_sellBonus.inputEnabled = true;       // Give clickability
        }
        else
        {
            button_sellBonus.clear();
            button_sellBonus.beginFill(0xD9D9D9);
            button_sellBonus.lineStyle(1, 0x000000, 1);
            button_sellBonus.drawRect(0,0, game.world.width*0.17, game.world.height*0.15);
            label_sellHeader.addColor("#F2F2F2", 0);    // Color header text
            label_sellDetail.addColor("#F2F2F2", 0);    // Color detail text
            button_sellBonus.inputEnabled = false;      // Remove clickability
        }

        // Check if upgrade path is done. If it is, kill the button
        if(upgrade_eavesdropPrices.length == 0)
        {
            button_eavesdropAmount.clear();
            label_eavesdropHeader.destroy();
            label_eavesdropDetail.destroy();
        }
        if(upgrade_ratePrices.length == 0)
        {
            button_moneyRate.clear();
            label_rateHeader.destroy();
            label_rateDetail.destroy();
        }
    }

    // Runs when a person is legally clicked
    function personClicked(person)
    {
        if(person.texture.baseTexture.source.name === "person_red")
        {
            console.log("Red");
            person.loadTexture("person");
            if(bonusAmount<10) { bonusAmount += 1; }    // Update bar
            audio_gather.play();
            updateBonusBar();
        }
        else
        {
            console.log("Blue");
        }

    }

    function boughtEavesdrop()
    {
        console.log("Bought eavesdrop");
        currentMoneySum -= upgrade_eavesdropPrices[0];
        upgrade_eavesdropValues.shift();     // Shift so the rate is a new rate
        upgrade_eavesdropPrices.shift();     // Shift so the price is now more
        audio_upgrade.play();
    }

    function boughtRate()
    {
        console.log("Bought rate increase");
        currentMoneySum -= upgrade_ratePrices[0];
        upgrade_rateValues.shift();     // Shift so the rate is a new rate
        upgrade_ratePrices.shift();     // Shift so the price is now more
        audio_upgrade.play();
    }

    function soldBonus()
    {
        console.log("Sold conversation");
        bonusAmount = 0;    // Reset bonus amount
        currentMoneySum += upgrade_eavesdropValues[0];  // Grab value from current eavesdrop value
        saleBarFill.clear();// Redraw
        audio_coin.play();
    }


    function removeHint()
    {
        hintText.destroy();
    }
};

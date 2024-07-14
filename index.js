// Variable to stores data if game is in motion
var game = false;

// Difficulty modes variables
var difficultyModeEasy = false;
var difficultyModeMedium = false;
var difficultyModeHard = false;

// Starting level value
var level = 1;

//An array for draws button sequence
var buttonDrawsSequence = [];

//Counts user clicks
var userGuess = 0;

//Counter for remaining clicks
var remainingClicks;

//Timer storing variable, and variable to store timeInterval ID to clear the timer
var levelTimeLimit;
var clearTimer;

//Counter for remaining hints
var hintCount = 3;

//Sets new time level limit
function setNewTimeLimit(a, b, c, d, e, f, g, h){

        //Sets time limit base on game level
        if(level >= 40 ){

            //Time beetween level 40 and infinity
            levelTimeLimit = h;

        } else if(level >= 30) {

            //Time beetween level 30 - 39
            levelTimeLimit = g;

        } else if(level >= 25) {

            //Time beetween level 25 - 29
            levelTimeLimit = f;
            
        } else if(level >= 20) {

            //Time beetween level 20 - 24
            levelTimeLimit = e;
            
        } else if(level >= 15) {

            //Time beetween level 15 - 19
            levelTimeLimit = d;
            
        } else if(level >= 10) {

            //Time beetween level 10 - 14
            levelTimeLimit = c;
            
        }  else if(level >= 5) {

            //Time beetween level 5 - 9
            levelTimeLimit = b;
            
        } else {
            //Default time limit
            levelTimeLimit = a;
        }
}

// Resets the game state to it's starting values after a loss or a win.
// Resets userGuess, buttonDrawsSequence, and buttons click handlers.
// Sets level if win to level+1, if loos to level 1
function resetGameState(l){

    level = l;
    userGuess = 0;
    buttonDrawsSequence = [];

    //Checks level mode difficulty and set proper timer
    if(difficultyModeEasy){

        //Default time, 5 level, 10 level, 15 level, 20 level, 25 level, 30 level and beyond 30 level
        setNewTimeLimit(60, 80, 100, 120, 140, 160, 180, 200);
            
    } else if(difficultyModeMedium){

        //Default time, 5 level, 10 level, 15 level, 20 level, 25 level, 30 level and beyond 30 level
        setNewTimeLimit(30, 40, 50, 60, 70, 80, 90, 100);

    } else if(difficultyModeHard){

        //Default time, 5 level, 10 level, 15 level, 20 level, 25 level, 30 level and beyond 30 level
        setNewTimeLimit(10, 15, 20, 25, 30, 35, 40, 60);
        
    }

    //Stops current timer
    clearInterval(clearTimer);
    $("#timer").text("");

    hintCount = 3;
    $("#hint").text("Hints: " + hintCount);
    $("#hint").toggle();
    
    $(".btn").off();

    $("#pause-game").toggle();
    $("#pause-game").off();

    $("#remaining-clicks").toggle();
}

//Shows user game over screen
function gameOver(){

    // Changes game variable to false to activete spacebar
    game = false;

    //Resets game to level 1
    resetGameState(1);

    //Plays wrong sound
    playSound("wrong");

    //Shows red background animation by adding class game over to body 
    //And after 100miliseconds removes it
    $("body").addClass("game-over");

    setTimeout(function(){
        $("body").removeClass("game-over");
    }, 100);
    
    //Updates level title
    $("#level-title").html("Game Over!<br> Press Spacebar to Restart");

}

// Counts time from current levelTimeLimit to 0
function timer(){

    //Gets current time level limit
    var timer = levelTimeLimit;

    //Starts timer
    var timerID = setInterval(function() {

        timer--;

        //If time is up 
        if(timer <= 0) {

            //Clears interval function and display game over screen
            clearInterval(timerID);
            gameOver();

        } else {

            //Updates timer with current time
            $("#timer").text(timer);

        }

    }, 1000);

    //Stores setInrerval variable to off if game is paused
    clearTimer = timerID;

}

//Adds click method to let user respond
function verifyUserResponse(){

        //Updates timer text and start's timer
        $("#timer").text("Start");
        timer();

        $(".btn").on("click", function(){

            //Checks class of button that was cliked and compare it to actual buttonDrawsSequence position
            if(this.classList[1] === buttonDrawsSequence[userGuess]){
    
                //Animates clicked button by user
                buttonAnimation(buttonDrawsSequence[userGuess]);

                //Plays sound of clicked button
                playSound(this.classList[1]);

                //Decrements remaining clicks and updates show number
                remainingClicks--;
                $("#remaining-clicks").text(remainingClicks);
    
                //Increments user guess
                userGuess++;
                
                //Checks if user win level
                if(userGuess === buttonDrawsSequence.length){

                    //Displays next level button
                    $("#next-level-btn").text("Next Level");
                    $("#next-level-btn").fadeToggle();

                    //Resets game state and update level
                    resetGameState(level+1);

                    //Updates timer text
                    $("#timer").text("Level Up!");

                    //If next level button click loads new game level
                    $("#next-level-btn").on("click", function(){

                        //Loads level setting
                        loadLevelSettings();

                        //Offsets and hides next level button
                        $("#next-level-btn").off();
                        $("#next-level-btn").fadeToggle();

                    });
                } 
    
            } else {

                //Resets game to level 1
                gameOver();
    
            }
        });

}

//Shows a hint what button should be clicked
function showHint(){

    if(hintCount === 0){

        //Update hint text
        $("#hint").text("No more hints!")

    } else {

        //Decrements hint usage
        hintCount--;

        //Update hints text
        $("#hint").text("Hints: " + hintCount);

        //Shows user current wchich button to click and played sound for this button
        buttonAnimation(buttonDrawsSequence[userGuess]);
        playSound(buttonDrawsSequence[userGuess]);

    }
    
}

// Resumes the paused game
function resumeGame(){

    //Shows pause button
    pauseGame();
    $("#pause-game").toggle();

    //Resumes timer
    timer();

    //Resumes hints
    $("#hint").toggle();

    //Resumes user response
    verifyUserResponse();
}

// Pauses current game
function pauseGame(){

    //Adds event listener to pause game button
    $("#pause-game").on("click", function(){
        console.log('pause');

        //Hides pause button and disable handler
        $("#pause-game").toggle();
        $("#pause-game").off();

        // Freezes time
        levelTimeLimit = $("#timer").text();
        clearInterval(clearTimer); 

        // Shows paused time
        $("#timer").text(levelTimeLimit);

        // Freezes hints
        $("#hint").toggle();

        // Freezes button clicks
        $(".btn").off();

        // Shows game resume button
        $("#resume-game").fadeToggle();

        // Hides resume button and resumes the game 
        $("#resume-game").on("click", function(){
            
            $("#resume-game").off();
            $("#resume-game").fadeToggle();

            resumeGame();

        });
    });
}

//Plays sound of clicked button and game-over
function playSound(sound) {

    var audio = new Audio("./sounds/" + sound + ".mp3");
    audio.play();

}

//Animate button by adding and removing after 3s pressed class
function buttonAnimation(button){

    var animationSpeed = 300;

    //Checks which difficulty mode is on
    if(difficultyModeHard){

        animationSpeed = 50;

    } else if (difficultyModeMedium){

        animationSpeed = 150;

    } else {

        animationSpeed = 300;

    }
    
    //Adds pressed class
    $("#" + button).addClass("pressed");

    //Removes pressed class after animationSpeed
    setTimeout(function(){

        $("#" + button).removeClass("pressed");

    }, animationSpeed);
}

//Adds the given button name to the buttonDrawsSequence array and calls the buttonAnimation function to display the button with an animation effect.
//Calls playSound function to play the sound
function pushAndAnimateAndPlaySound(button){

    //Adds new button name to buttonDrawsSequence array
    buttonDrawsSequence.push(button);

    //Animates drawn button and plays button sound 
    buttonAnimation(button);
    playSound(button);
}

//Generates a random number between 0 and 3
function randomNumber(){

    return Math.floor(Math.random()*4);

}

// Randomly draws the buttons and adds them to the buttonDrawsSequence array
// Displays the newly drawn button on the screen for the user to see
function drawAndShowNewButtonSequence(){

    var animationSpeed = 1000;

    //Checks which difficulty mode is on
    if(difficultyModeHard){

        animationSpeed = 200;

    } else if (difficultyModeMedium){

        animationSpeed = 500;

    } else {

        animationSpeed = 1000;

    }

    //Loop to draw new button sequence
    for(var i = 1; i <= level; i++){        
        
        //Sets a delay between button draws, ensuring the buttons are shown one at a time.
        setTimeout(function(){

            //Calls a function to generate a random number and stores result in variable
            var rNumber = randomNumber();

            //Checks the random number and assign the corresponding button name to the array.
            if(rNumber === 0){

                //Adds 'green' to the button sequence array and animate it and play sound
                pushAndAnimateAndPlaySound("green");

            } else if(rNumber === 1){

                //Adds 'red' to the button sequence array and animate it and play sound of draw button
                pushAndAnimateAndPlaySound("red");

            }  else if(rNumber === 2){
                    
                //Adds 'yellow' to the button sequence array and animate it and play sound of draw button
                pushAndAnimateAndPlaySound("yellow");

            } else {

                //Adds 'blue' to the button sequence array and animate it and play sound of draw button
                pushAndAnimateAndPlaySound("blue");

            }

            //Prevents user from clicking while drawAndShowNewButtonSequence is on the run
            if(buttonDrawsSequence.length === level){

                //Delays user response by 600milisecond after end of button draws
                setTimeout(function(){

                    //Shows hint button, pause button, remainning clicks 
                    // and updates remaining hints and remaining clicks counter
                    $("#hint").text("Hints: " + hintCount);
                    $("#hint").toggle();
                    $("#pause-game").toggle();

                    remainingClicks = buttonDrawsSequence.length;
                    $("#remaining-clicks").text(remainingClicks);
                    $("#remaining-clicks").toggle();

                    //Calling function to checks user answer
                    verifyUserResponse();

                }, 600);
                
            }

        }, animationSpeed * i);
      
    }
}

//Loads new level settings
function loadLevelSettings(){

    //Hides rules 
    $("#rules").hide();

    //Displays the current level number in the level-title element.
    $("#level-title").text("Level " + level);

    //Loads pause function
    pauseGame();

    //Changes hint and timer text
    $("#timer").text("- - -");

    //Draws new button sequence * level and display it on screen
    drawAndShowNewButtonSequence();

}

//Handler for hints button
$("#hint").on("click", function(){
        showHint();
})

//Loads game screen
function showGameScreen(){

    //Hides rules section
    $("#rules").hide();

    //Shows game screen elements
    $("#level-title").fadeToggle();
    $(".container").fadeToggle();

    //Handles user spacebar key press to start the game
    $(document).on("keydown", function(e){

    // Starts the game if game variable is false to prevents game start if game is already in motion.
    // And starts only if spacebar was pressed
    if(!game && e.keyCode === 32){

        // Changes game variable to true, to assure that game is in motion.
        game = true;

        loadLevelSettings();
    }
});
}

//If page is loaded add event listener to difficulty button mode
$(document).ready(function(){

    $(".difficulty-btn").on("click", function(){

        //Gets ID of clicked button
        var setMode = $(this).attr('id');
        
        //Checks ID and set proper difficulty game mode
        if(setMode === "easy"){

            difficultyModeEasy = true;
            
            //Sets mode time limit
            levelTimeLimit = 60;
            
        } else if(setMode === "medium"){

            difficultyModeMedium= true;

            //Sets mode time limit
            levelTimeLimit = 30;

        } else if(setMode === "hard"){

            difficultyModeHard = true;

            //Sets mode time limit
            levelTimeLimit = 10;

        }

        //Offsets difficulty button
        $(".difficulty-btn").off();

        //Loads screen game
        showGameScreen();
    })
});
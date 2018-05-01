(function() {
    
    // Define variables
    let name = ""; // Player's name
    let icon = ""; // The player's icon
    let currentTurn = "O";
    let autoPlay = false; // If true, this is 1-player mode and computer will play as player 2
    let over = false;
    
    /******** START SCREEN ********/
    // Change icon
    $(document).on("click", ".choose-icon", (e) => {
        $(e.target).addClass("selected");
        $(e.target).siblings().removeClass("selected");
    });
    
    // On click of start game button
    $(document).on("click", ".start-game", (e) => {
        // Get name
        name = $("#player_name").val() || "Player 1";
        // Get icon
        icon = $(".choose-icon.selected").text();
        // Which game mode?
        if ($(e.target).attr("id") === "1p")
            autoPlay = true;
        else
            autoPlay = false;
        newGame();
    });
    
    /******** STARTS NEW GAME ********/
    const newGame = () => {
        over = false;
        buildBoard();
        // Add names to board
        if (icon === "O") {
            $("#player1").append("<span>" + name + "</span>");
            $("#player2").append("<span>Player 2</span>");
        } else {
            $("#player2").append("<span>" + name + "</span>");
            $("#player1").append("<span>Player 2</span>");
        }
        // Whose turn?
        if (currentTurn === "O")
            $("#player1").addClass("active");
        else
            $("#player2").addClass("active");
        // Is it robot's turn?
        if (autoPlay && currentTurn != icon)
            makeMove();
        // Hover effect
        $(document).on("mouseover", ".box:not(.box-filled)", (e) => {
            // Only allowed if computer is not making move
            if (!autoPlay || icon === currentTurn)
                $(e.target).css("background-image", "url(img/" + currentTurn.toLowerCase() + ".svg)");
        }).on("mouseleave", ".box:not(.box-filled)", (e) => {
            $(e.target).css("background-image", "");
        });
        // Make move
        $(document).on("click", ".box", (e) => {
            // Check to make sure we can put something here
            if (!$(e.target).hasClass("box-filled") && !over) {
                // Only allowed if computer is not making move
                if (!autoPlay || icon === currentTurn) {
                    if (currentTurn === "X") {
                        $(e.target).addClass("box-filled").addClass("box-filled-2");
                    } else {
                        $(e.target).addClass("box-filled").addClass("box-filled-1");
                    }
                    moveMade();
                }
            }
        });
    };
    
    /******** LETS COMPUTER MAKE A MOVE ********/
    const makeMove = () => {
        
        // Get random delay
        let delay = Math.random() * 2000 + 800;
        
        // Make move after delay
        setTimeout(() => {
            
            // Let's start by placing a tile somewhere empty randomly (will make smart later)
            let done = false;
            let randomIndex = 0;
            while (!done) {
                randomIndex = Math.floor(Math.random() * 9);
                if (!$($(".box")[randomIndex]).hasClass("box-filled")) {
                    // Place tile here
                    if (currentTurn === "X")
                        $($(".box")[randomIndex]).addClass("box-filled").addClass("box-filled-2");
                    else
                        $($(".box")[randomIndex]).addClass("box-filled").addClass("box-filled-1");
                    done = true;
                }
            }

            moveMade();
            
        }, delay);
        
    }
    
    /******** AFTER MOVE HAS BEEN MADE ********/
    const moveMade = () => {
        
        // Has someone won?
        let status = checkStatus();
        
        if (status) {
            overState(status);
            return;
        }
        
        // Change turn
        if (currentTurn === "X") {
            currentTurn = "O";
            $("#player2").removeClass("active");
            $("#player1").addClass("active");
        } else {
            currentTurn = "X";
            $("#player1").removeClass("active");
            $("#player2").addClass("active");
        }
        
        // Robot's turn?
        if (autoPlay && currentTurn != icon)
            makeMove();
        
    };
    
    /******** CHECK FOR WINNER ********/
    const checkStatus = () => {
        
        // Get all boxes in form of array
        let boxes = [];
        $(".box").each((index, element) => {
            if ($(element).hasClass("box-filled-1")) {
                boxes.push("O");
            } else if ($(element).hasClass("box-filled-2")) {
                boxes.push("X");
            } else {
                boxes.push(null);
            }
        });
        
        // Check for horizontal win
        for (let i = 0; i < 3; i++) {
            if (boxes[i * 3] === boxes[i * 3 + 1] && boxes[i * 3 + 1] === boxes[i * 3 + 2] && boxes[i * 3] != null) {
                return boxes[i * 3];
            }
        }
        
        // Check for vertical win
        for (let i = 0; i < 3; i++) {
            if (boxes[i] === boxes[3 + i] && boxes[3 + i] === boxes[6 + i] && boxes[i] != null) {
                return boxes[i];
            }
        }
        
        // Diagonal win
        if (boxes[0] === boxes[4] && boxes[4] === boxes[8]) {
            return boxes[0];
        } 
        if (boxes[2] === boxes[4] && boxes[4] === boxes[6]) {
            return boxes[2];
        }
        
        // Tie?
        let noNull = true;
        for (let i = 0; i < 9; i++) {
            if (!boxes[i])
                noNull = false;
        }
        if (noNull)
            // Tie
            return "T";
        
    };
    
    /******** GAME OVER! ********/
    const overState = status => {
        
        let message = "";
        let winClass = "";
        if (status === "T")
            message = "It's a Tie!";
        else if (icon === status)
            message = name + " wins!";
        else
            message = "Player 2 wins!";
        
        if (status === "T")
            winClass = "screen-win-tie";
        else if (status === "X")
            winClass = "screen-win-two";
        else
            winClass = "screen-win-one";
        
        over = true;
        
        // Wait a little while and then go to game over screen
        setTimeout(buildOverScreen, 2500, message, winClass);
        
        
    };
    
    const buildOverScreen = (message, winClass) => {
        
        // Build game over screen
        $("body").html('<div class="screen screen-win ' + winClass + '" id="finish"><header><h1>Tic Tac Toe</h1><p class="message">' + message + '</p><a href="#" class="button new-game" id="1p">New 1-Player Game</a><a href="#" class="button new-game" id="2p">New 2-Player Game</a></header></div>');
        
    };
    
    // On click of new game
    $(document).on("click", ".new-game", (e) => {
        if ($(e.target).attr("id") === "1p")
            autoPlay = true;
        else
            autoPlay = false;
        newGame();
    });

    /******** BUILD BOARD ********/
    // Inserts the board HTML
    const buildBoard = () => {
        $("body").html('<div class="board" id="board"><header><h1>Tic Tac Toe</h1><ul><li class="players player1" id="player1"><svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-200.000000, -60.000000)" fill="#000000"><g transform="translate(200.000000, 60.000000)"><path d="M21 36.6L21 36.6C29.6 36.6 36.6 29.6 36.6 21 36.6 12.4 29.6 5.4 21 5.4 12.4 5.4 5.4 12.4 5.4 21 5.4 29.6 12.4 36.6 21 36.6L21 36.6ZM21 42L21 42C9.4 42 0 32.6 0 21 0 9.4 9.4 0 21 0 32.6 0 42 9.4 42 21 42 32.6 32.6 42 21 42L21 42Z"/></g></g></g></svg></li><li class="players player2" id="player2"><svg xmlns="http://www.w3.org/2000/svg" width="42" height="43" viewBox="0 0 42 43" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-718.000000, -60.000000)" fill="#000000"><g transform="translate(739.500000, 81.500000) rotate(-45.000000) translate(-739.500000, -81.500000) translate(712.000000, 54.000000)"><path d="M30 30.1L30 52.5C30 53.6 29.1 54.5 28 54.5L25.5 54.5C24.4 54.5 23.5 53.6 23.5 52.5L23.5 30.1 2 30.1C0.9 30.1 0 29.2 0 28.1L0 25.6C0 24.5 0.9 23.6 2 23.6L23.5 23.6 23.5 2.1C23.5 1 24.4 0.1 25.5 0.1L28 0.1C29.1 0.1 30 1 30 2.1L30 23.6 52.4 23.6C53.5 23.6 54.4 24.5 54.4 25.6L54.4 28.1C54.4 29.2 53.5 30.1 52.4 30.1L30 30.1Z"/></g></g></g></svg></li></ul></header><ul class="boxes"><li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li></ul></div>');
    };
    
    
}());
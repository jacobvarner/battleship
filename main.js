var playing = false;
var playerFleet, opponentFleet, playerBoard, opponentBoard, playerShipsLeft = 5, opponentShipsLeft = 5, turns = 0;
var playerGuesses = [];
var opponentGuesses = [];

var acceptedValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

function Ship(name, size, hits=0) {
    this.name = name;
    this.size = size;
    this.coordinates = [];
    this.hits = hits;
}

$(document).ready(function(){
    $("#new-game").click(function() {
        if (playing === true) {
            if (confirm("Are you sure you wish to quit and start a new game?")) {
                newGame();
            } else {
                return false;
            }
        } else {
            newGame();
        }
    });

    $("#orientation-toggle").click(function () {
        console.log("Orientation toggle clicked!");
        $("#orientation-indicator").toggleClass("vertical");
    });
});

function newGame() {
    console.log("Starting a new game!");
    playing = true;
    playerFleet = createFleet();
    opponentFleet = createFleet();
    playerBoard = createBoard();
    opponentBoard = createBoard();
    console.log("New game has been started.");

    $("#output-text").text("Your opponent is placing their ships. Hang tight.");
    placeOpponentShips();
}

function createFleet() {
    var carrier = new Ship("Carrier", 5);
    var battleship = new Ship("Battleship", 4);
    var cruiser = new Ship("Cruiser", 3);
    var submarine = new Ship("Submarine", 3);
    var destroyer = new Ship("Destroyer", 2);

    var fleet = [carrier, battleship, cruiser, submarine, destroyer];
    return fleet;
}

function createBoard() {
    /*
    *
    * Boards are represented by 2D arrays.
    * 0 = nothing
    * 1 = ship
    * 2 = miss
    * 3 = hit
    *
    */
    var board = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    return board;
}

function placeOpponentShips() {
    var ship, orientation, x, y, shipLength;
    for (ship = 0; ship < 5; ship++) {
        shipLength = opponentFleet[ship].size;

        // Computer picks a random orientation and a random starting point for each ship until it fits on the board.
        do {
            orientation = Math.round(Math.random()); // 0 = horizontal, 1 = vertical
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
        } while (placementCheck(opponentBoard, opponentFleet, ship, shipLength, orientation, x, y) === false);  
    }
    placePlayerShips();
}

function placementCheck(board, fleet, shipNumber, shipLength, orientation, x, y) {
    var count = 0;
    var startX = x;
    var startY = y;
    var ship = shipNumber;
    var coordinates = [];
    while (count < shipLength) {
        if (y > 9 || x > 9) {
            return false;
        }
        if (board[y][x] === 0) {
            coordinates.push([x,y]);
            if (orientation === 0) {
                x++;
            } else {
                y++;
            }
            count++;
        } else {
            return false;
        }
    }
    var pair;
    for (pair in coordinates) {
        board[coordinates[pair][1]][coordinates[pair][0]] = 1;
    }
    fleet[ship].coordinates = coordinates;
    return true;
}

function placePlayerShips() {
    var ship = 0, orientation, x, y, shipLength;

    $("#output-text").text("Your opponent has placed their ships. It is now your turn to place your ships.");
    $("#ship-placement-container").css("display", "block");

    $("#placement-button").click(function(){
        shipLength = playerFleet[ship].size;
        if ($("#orientation-indicator").hasClass("vertical")) {
            orientation = 1;
        } else {
            orientation = 0;
        }
        var inputValue = $("#placement-location").val();
        if (checkInputValue(inputValue) === false) {
            alert("You must enter a valid Letter-Number pair with a letter before K and a positive number less than 10.\n\nEx. 'A3', 'C9', 'H5', etc.");
        } else {
            y = parseInt(inputValue[1]);
            x = acceptedValues.indexOf(inputValue[0].toUpperCase());
        }

        if (placementCheck(playerBoard, playerFleet, ship, shipLength, orientation, x, y) === true) {
            var pair;
            var coordinates = playerFleet[ship].coordinates;
            for (pair in coordinates) {
                $("#p-" + acceptedValues[coordinates[pair][1]] + "" + coordinates[pair][0]).addClass("ship-space");
            }
            ship++;
            if (ship > 4) {
                $("#output-text").html("Great! All of your ships are in position and you are ready for battle.<br/><br/>You go first.");
                $("#ship-placement-container").css("display", "none");
                $("#firing-container").css("display", "block");
                playerTurn();
            }
            $("#ship-label > span").attr("id", "place-" + playerFleet[ship].name).text(playerFleet[ship].name);
        } else {
            alert("That ship doesn't fit there. Please enter another location where the ship will fit.");
        }
    });
}

function checkInputValue(value) {
    if (value.length != 2) {
        return false;
    }
    var test = parseInt(value[1]);
    if (test == NaN) {
       return false;
    }
    var test2 = value[0];
    if (acceptedValues.indexOf(test2.toUpperCase()) == -1) {
        return false;
    }
    return true;
}

function opponentTurn() {
    var x, y;
    
    x = Math.floor(Math.random() * 10);
    y = Math.floor(Math.random() * 10);

    var target = [x, y];
    var result = false;

    if (locationInArray(opponentGuesses, target) != -1) {
        opponentTurn();
    } else {
        for (var i = 0; i < 5; i++) {
            var array = playerFleet[i].coordinates;
            var location = locationInArray(array, target);
            if (location === -1) {
                continue;
            } else {
                result = true;
                break;
            }
        }

        if (result === false) {
            $("#output-text").html("Whew, that was close! They missed.");
            playerBoard[y][x] = 2;
            $("#p-" + acceptedValues[y] + x + " > span").addClass("miss");
            opponentGuesses.push(target);
        } else {
            $("#output-text").html("Yikes! You've been hit.<br/><br/>They hit your " + playerFleet[i].name + ".");
            playerBoard[y][x] = 3;
            $("#p-" + acceptedValues[y] + x + " > span").addClass("hit");
            $("#p" + playerFleet[i].name + " span:not(.hit):first").addClass("hit");
            playerFleet[i].hits++;
            if (playerFleet[i].hits === playerFleet[i].size) {
                $("#output-text").html("Yikes! You've been hit.<br/><br/>They sunk your " + playerFleet[i].name + "!");
                playerShipsLeft--;
                $("#player-ships-remaining").text("Ships remaining: " + playerShipsLeft);
                if (playerShipsLeft === 0) {
                    // 0 = player wins, 1 = opponent wins
                    gameOver(1)
                }
            }
            playerGuesses.push(target);
        }
        turns++;
        $("#fire-button").prop("disabled", false);
        playerTurn();
    }
}

function playerTurn() {
    $("#fire-button").removeClass("disabled");
    var x, y, pause;
    $("#fire-button").unbind().click(function() {
        var inputValue = $("#fire-location").val();
        if (checkInputValue(inputValue) === false) {
            alert("You must enter a valid Letter-Number pair with a letter before K and a positive number less than 10.\n\nEx. 'A3', 'C9', 'H5', etc.");
        } else {
            y = parseInt(inputValue[1]);
            x = acceptedValues.indexOf(inputValue[0].toUpperCase());
        }
        
        var target = [x,y];
        var result = false;

        if (locationInArray(playerGuesses, target) != -1) {
            alert("You've already guessed that location. Please pick another valid location and fire again.");
        } else {
            for (var i = 0; i < 5; i++) {
                var array = opponentFleet[i].coordinates;
                var location = locationInArray(array, target);
                if (location === -1) {
                    continue;
                } else {
                    result = true;
                    break;
                }
            }

            if (result === false) {
                $("#output-text").html("Unfortunately, that's a miss.");
                opponentBoard[y][x] = 2;
                $("#o-" + acceptedValues[y] + x + " > span").addClass("miss");
                playerGuesses.push(target);
            } else {
                $("#output-text").html("Boom! That's a hit.<br/><br/>You hit their " + opponentFleet[i].name + ".");
                opponentBoard[y][x] = 3;
                $("#o-" + acceptedValues[y] + x + " > span").addClass("hit");
                $("#o" + opponentFleet[i].name + " span:not(.hit):first").addClass("hit");
                opponentFleet[i].hits++;
                if (opponentFleet[i].hits === opponentFleet[i].size) {
                    $("#output-text").html("Boom! That's a hit.<br/><br/>You sunk their " + opponentFleet[i].name + "!");
                    opponentShipsLeft--;
                    $("#opponent-ships-remaining").text("Ships remaining: " + opponentShipsLeft);
                    if (opponentShipsLeft === 0) {
                        // 0 = player wins, 1 = opponent wins
                        gameOver(0)
                    }
                }
                playerGuesses.push(target);
            }
            turns++;
            $("#fire-button").prop("disabled", true);
            $("#fire-button").addClass("disabled");
            pause = setTimeout(opponentTurn, 3000);
        }
    });
}

function locationInArray(container, target) {
    var container = container.map(JSON.stringify);
    var target = JSON.stringify(target);
    for (var i = 0; i < container.length; i++) {
        if (container[i] == target) {
            return i;
        }
    }
    return -1;
}

function gameOver(winner) {
    $("#firing-container").css("display","none");
}
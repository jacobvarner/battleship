var playing = false;
var playerFleet, opponentFleet, playerBoard, opponentBoard;

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
    console.log("New game has been strated.");

    $("#output-text").text("Your opponent is placing their ships. Hang tight.");
    
    placeOpponentShips();

    $("#output-text").text("Your opponent has placed their ships. It is now your turn to place your ships.");
    $("#ship-placement-container").css("display", "block");
    placePlayerShips();

    playBattleship();
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

function playBattleship() {

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

    return true;
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

}

function playerTurn() {
    
}
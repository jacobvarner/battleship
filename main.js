var playing = false;
var playerFleet, opponentFleet, playerBoard, opponentBoard;

/*
*
* Boards are represented by 2D arrays.
* 0 = nothing
* 1 = ship
* 2 = miss
* 3 = hit
*
*/

var defaultBoard = [
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
});

function newGame() {
    console.log("Starting a new game!");
    playing = true;
    playerFleet = createFleet();
    opponentFleet = createFleet();
    playerBoard = defaultBoard;
    opponentBoard = defaultBoard;
    console.log("New game has been strated.");

    $("#output-text").text("Your opponent is placing their ships. Hang tight.");
    placeOpponentShips();

    $("#output-text").text("Your opponent has placed their ships. It is now your turn to place your ships.");
    $("#ship-placement-container").css("display", "block");
    placePlayerShips();

    playBattleship();
}

function createFleet() {
    var carrier = new Ship("carrier", 5);
    var battleship = new Ship("battleship", 4);
    var cruiser = new Ship("cruiser", 3);
    var submarine = new Ship("submarine", 3);
    var destroyer = new Ship("destroyer", 2);

    var playerFleet = [carrier, battleship, cruiser, submarine, destroyer];
    return playerFleet;
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
    opponentFleet[ship].coordinates = coordinates;
    return true;
}

function placePlayerShips() {
    
}

function opponentTurn() {

}

function playerTurn() {
    
}
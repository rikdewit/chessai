var board = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')




socket = io(window.location.host);

socket.on("connect", () => {
    console.log("connected")

});


socket.on("move", (move) => {
    console.log("bot", move);
    game.move(move);
    updateStatus();
    updateBoard();
})




var config = {
    pieceTheme: 'img/chesspieces/wikipedia/{piece}.png',
    position: 'start',
    snapSpeed: 0, //CAUTION: board updates after snapping is done, will cause trouble when response move comes before snapEnd
    draggable: true,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
}






function onDragStart(source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false

    // only pick up pieces for the side to move
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false
    }
}

function onDrop(source, target) {
    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })

    // illegal move
    if (move === null) {
        return 'snapback'
    } else {
        console.log("player", move.san)
        socket.emit('move', move);
    }

    updateStatus();
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
    console.log("snapend")
    updateBoard();
}



function updateStatus() {
    var status = ''

    var moveColor = 'White'
    if (game.turn() === 'b') {
        moveColor = 'Black'
    }

    // checkmate?
    if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.'
    }

    // draw?
    else if (game.in_draw()) {
        status = 'Game over, drawn position'
    }

    // game still on
    else {
        status = moveColor + ' to move'

        // check?
        if (game.in_check()) {
            status += ', ' + moveColor + ' is in check'
        }
    }

    $status.html(status)
    $fen.html(game.fen())
    $pgn.html(game.pgn())
}

function updateBoard() {
    board.position(game.fen());
}


board = Chessboard('myBoard', config)

updateStatus();


window.addEventListener("resize", () => board.resize())

let resetButton = document.querySelector(".resetButton")
let sideButton = document.querySelector(".sideButton")

resetButton.addEventListener("click", (event) => {
    let side = board.orientation();
    socket.emit("reset", side);
    game.reset();
    updateBoard();
    updateStatus();
})

sideButton.addEventListener("click", (event) => {
    game.reset();

    let side = board.orientation("flip");
    socket.emit("changeSide", side);

    updateBoard();
    updateStatus();
});
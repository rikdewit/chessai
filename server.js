
const { io } = require('./server_setup');
const { Chess } = require('chess.js')



io.sockets.on('connection', (socket) => {
    console.log('We have a new client: ' + socket.id);

    const game = new Chess();
    socket.on("move", (move) => {

        game.move(move);
        updateStatus(game);


        const moves = game.moves()
        const response = moves[Math.floor(Math.random() * moves.length)]

        socket.emit("move", response);
        game.move(response);
        updateStatus(game);

    });

    socket.on("reset", (side) => {
        game.reset();
        updateStatus(game);
        if (side == "black") {
            const moves = game.moves()
            const response = moves[Math.floor(Math.random() * moves.length)]
            setTimeout(() => {
                socket.emit("move", response);
                game.move(response);
                updateStatus(game);
            }, 1000)
        }


    });

    socket.on("changeSide", (side) => {
        game.reset();
        updateStatus(game);
        if (side == "black") {
            const moves = game.moves()
            const response = moves[Math.floor(Math.random() * moves.length)]
            setTimeout(() => {
                socket.emit("move", response);
                game.move(response);
                updateStatus(game);
            }, 1000)
        }


    });

});

function updateStatus(game) {
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
    console.log(game.pgn());
    console.log(status);

}



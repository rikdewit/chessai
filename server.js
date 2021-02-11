  
const {io} = require('./server_setup');
const { Chess } = require('chess.js')
const game = new Chess()


io.sockets.on('connection',(socket)=> {
        console.log('We have a new client: ' + socket.id);
        socket.emit('test', "hello world!")
        socket.on("hello", (data)=> console.log(data));

    });






// while (!game.game_over()) {
//     const moves = game.moves()
//     const move = moves[Math.floor(Math.random() * moves.length)]
//     game.move(move)
// }
// console.log(game.pgn())

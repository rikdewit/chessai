function onDragStart (source, piece, position, orientation) {
    console.log('Drag started:')
    console.log('Source: ' + source)
    console.log('Piece: ' + piece)
    console.log('Position: ' + Chessboard.objToFen(position))
    console.log('Orientation: ' + orientation)
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  }

  function onChange (oldPos, newPos) {
    console.log('Position changed:')
    console.log('Old position: ' + Chessboard.objToFen(oldPos))
    console.log('New position: ' + Chessboard.objToFen(newPos))
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  }

var config = {
    pieceTheme: 'img/chesspieces/wikipedia/{piece}.png',
    position: 'start',
    draggable: 'true',
    onDragStart: onDragStart,
    onChange: onChange,
    sparePieces: false
  }
var board = Chessboard('myBoard', config)

$('#setRuyLopezBtn').on('click', function () {
    board.position('r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R')
  })
  
  $('#setStartBtn').on('click', board.start)
  
  $('#setRookCheckmateBtn').on('click', function () {
    board.position({
      a4: 'bK',
      c4: 'wK',
      a7: 'wR'
    })
  })
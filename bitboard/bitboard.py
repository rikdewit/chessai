import chess
import numpy as np

# TODO fix empty number placement bitboard_to_fen()

board = chess.Board()


start_position = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
position = "rnb1k1nr/pppp1ppp/8/3Pp3/3bP3/2N2N2/PPP2qPP/R1BQKB1R w - - 0 1"
# Uppercase: white
# Lowercase: black
piece_dict = {"P": 0, "N": 1, "B": 2, "R": 3, "Q": 4, "K": 5,
              "p": 6, "n": 7, "b": 8, "r": 9, "q": 10, "k": 11}

castling_dict = {"K": 0, "Q": 1, "k": 2, "q": 3}


def fen_to_bitboard(fen_input):
    try:
        chess.Board(fen_input)
    except:
        raise Exception("This is not a valid fen")

    fen_parts = fen_input.split(" ")
    pieces = fen_parts[0].replace("/", "")
    to_move = fen_parts[1]
    castling_rights = fen_parts[2]

    bitboard = []

    for character in pieces:
        try:
            number = int(character)
            for i in range(number*12):
                bitboard.append(0)
        except:
            index = piece_dict[character]
            for i in range(index):
                bitboard.append(0)
            bitboard.append(1)

            for i in range(12-index-1):
                bitboard.append(0)

    if to_move == "w":
        bitboard.append(1)
    else:
        bitboard.append(0)

    castling = [0, 0, 0, 0]
    for c in castling_rights:
        if(c != "-"):
            castling[castling_dict[c]] = 1

    for bit in castling:
        bitboard.append(bit)

    return bitboard


def bitboard_to_fen(bitboard):
    # Uppercase: white
    # Lowercase: black
    reverse_piece_dict = reverse_dict(piece_dict)
    reverse_castling_dict = reverse_dict(castling_dict)
    fen = ""
    piece = ""

    # pieces
    for y in range(8):
        count = 0
        last_empty = False
        for x in range(8):
            empty = True
            for p in range(12):
                bit = bitboard[y*12*8+x*12+p]
                if(bit == 1):
                    empty = False
                    piece = reverse_piece_dict[p]
                    
            if empty:
                count += 1
            if (last_empty and (not empty)) or x == 7:
                if(count > 0):
                    fen += str(count)
                    count = 0
            last_empty = empty

            if(not empty):
                fen += piece


        if(y < 7):
            fen += "/"

    fen += " "
    after_pieces = 12*8*8
    # to move
    if(after_pieces+1):
        fen += "w"
    else:
        fen += "b"

    fen += " "

    # castling rights
    castling = bitboard[after_pieces+1:after_pieces+6]

    for i, c in enumerate(castling):
        if(c):
            fen += reverse_castling_dict[i]
    if not (1 in castling):
        fen += "-"

    fen += " - 0 1"  # default of no en passent or move clock

    return fen


def reverse_dict(dict_input):
    return dict((v, k) for k, v in dict_input.items())


print(position)
bitboard_position = fen_to_bitboard(position)

print(bitboard_to_fen(bitboard_position))

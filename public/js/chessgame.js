// const socket = io();

// const chess = new Chess();
// const boardelement = document.querySelector(".chessboard");
// let draggedpiece = null;
// let sourceSquare = null;
// let playerRole = null;

// const renderBoard = () => {
//   const board = chess.board();
//   boardelement.innerHTML = "";

//   board.forEach((row, rowindex) => {
//     row.forEach((square, squareindex) => {
//       const squareelement = document.createElement("div");
//       squareelement.classList.add(
//         "square",
//         (rowindex + squareindex) % 2 === 0 ? "light" : "dark"
//       );
//       squareelement.dataset.row = rowindex;
//       squareelement.dataset.col = squareindex;

//       if (square) {
//         const pieceElement = document.createElement("div");
//         pieceElement.classList.add("piece", square.color === "w" ? "white" : "black");
//         pieceElement.innerText = getPieceUnicode(square);
//         pieceElement.draggable = playerRole === square.color;

//         pieceElement.addEventListener("dragstart", (e) => {
//           if (pieceElement.draggable) {
//             draggedpiece = square;
//             sourceSquare = { row: rowindex, col: squareindex };
//             e.dataTransfer.setData("text/plain", "");
//           }
//         });

//         pieceElement.addEventListener("dragend", (e) => {
//           draggedpiece = null;
//           sourceSquare = null;
//         });

//         squareelement.appendChild(pieceElement);
//       }

//       squareelement.addEventListener("dragover", function (e) {
//         e.preventDefault();
//       });
//       squareelement.addEventListener("drop", function (e) {
//         e.preventDefault();
//         if (draggedpiece) {
//           const targetSquare = {
//             row: parseInt(squareelement.dataset.row),
//             col: parseInt(squareelement.dataset.col),
//           };

//           handleMove(sourceSquare, targetSquare);
//         }
//       });
//       boardelement.appendChild(squareelement);
//     });
//   });
// };

// const handleMove = (source, target) => {
//   const move = {
//     from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
//     to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
//     promotion: "q", // Always promote to queen
//   };

//   const moveResult = chess.move(move);

//   if (moveResult) {
//     // If the move is valid, emit it to the server
//     socket.emit("move", move);
//     renderBoard();
//   }
// };


// const getPieceUnicode = (piece) => {
//   const unicodePieces = {
//     p: "♙",  // White Pawn
//     r: "♖",  // White Rook
//     n: "♘",  // White Knight
//     b: "♗",  // White Bishop
//     q: "♕",  // White Queen
//     k: "♔",  // White King
//     P: "♟",  // Black Pawn
//     R: "♜",  // Black Rook
//     N: "♞",  // Black Knight
//     B: "♝",  // Black Bishop
//     Q: "♛",  // Black Queen
//     K: "♚"   // Black King
//   };
//   return unicodePieces[piece.type] || "";
// };
// socket.on("playerRole",function(role){
//   playerRole = role;
//   renderBoard();
// })
// socket.on("spectatorRole",function(role){
//   spectatorRole = null;
//   renderBoard();
// })
// socket.on("boardstate",function(fen){
//   chess.load(fen);
//   renderBoard();
// })
// socket.on("move",function(move){
//   chess.move(move);
//   renderBoard();
// })

// renderBoard();


//     &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&   client side code


const socket = io();

const chess = new Chess();
const boardelement = document.querySelector(".chessboard");
let draggedpiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () => {
  const board = chess.board();
  boardelement.innerHTML = "";

  board.forEach((row, rowindex) => {
    row.forEach((square, squareindex) => {
      const squareelement = document.createElement("div");
      squareelement.classList.add(
        "square",
        (rowindex + squareindex) % 2 === 0 ? "light" : "dark"
      );
      squareelement.dataset.row = rowindex;
      squareelement.dataset.col = squareindex;

      if (square) {
        const pieceElement = document.createElement("div");
        pieceElement.classList.add("piece", square.color === "w" ? "white" : "black");
        pieceElement.innerText = getPieceUnicode(square);
        pieceElement.draggable = playerRole === square.color;

        pieceElement.addEventListener("dragstart", (e) => {
          if (pieceElement.draggable) {
            console.log("Drag started for piece:", square);
            draggedpiece = square;
            sourceSquare = { row: rowindex, col: squareindex };
            e.dataTransfer.setData("text/plain", "");
          }
        });

        pieceElement.addEventListener("dragend", (e) => {
          console.log("Drag ended");
          draggedpiece = null;
          sourceSquare = null;
        });

        squareelement.appendChild(pieceElement);
      }

      squareelement.addEventListener("dragover", function (e) {
        e.preventDefault();
      });
      squareelement.addEventListener("drop", function (e) {
        e.preventDefault();
        if (draggedpiece) {
          console.log("Piece dropped on:", squareelement.dataset.row, squareelement.dataset.col);
          const targetSquare = {
            row: parseInt(squareelement.dataset.row),
            col: parseInt(squareelement.dataset.col),
          };

          handleMove(sourceSquare, targetSquare);
        }
      });
      boardelement.appendChild(squareelement);
    });
  });

  if(playerRole==="b"){
  boardelement.classList.add("flipped")
  }else{
    boardelement.classList.remove("flipped")
  }
};

const handleMove = (source, target) => {
  const move = {
    from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
    to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
    promotion: "q", // Always promote to queen
  };

  const moveResult = chess.move(move);

  if (moveResult) {
    // If the move is valid, emit it to the server
    socket.emit("move", move);
    renderBoard();
  }
};

const getPieceUnicode = (piece) => {
  const unicodePieces = {
    p: "♙",  // White Pawn
    r: "♖",  // White Rook
    n: "♘",  // White Knight
    b: "♗",  // White Bishop
    q: "♕",  // White Queen
    k: "♔",  // White King
    P: "♟",  // Black Pawn
    R: "♜",  // Black Rook
    N: "♞",  // Black Knight
    B: "♝",  // Black Bishop
    Q: "♛",  // Black Queen
    K: "♚"   // Black King
  };
  return unicodePieces[piece.type] || "";
};

socket.on("playerRole", function (role) {
  playerRole = role;
  renderBoard();
});

socket.on("spectatorRole", function () {
  playerRole = null;
  renderBoard();
});

socket.on("updateBoard", function (fen) {
  console.log("Received board state:", fen);
  chess.load(fen);
  renderBoard();
});

socket.on("Invalid move", function (move) {
  console.log("Invalid move attempted:", move);
  // Optionally, show an alert or message to the user about the invalid move
});

renderBoard();

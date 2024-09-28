// const express = require("express")
// const socket = require("socket.io")
// const http = require("http")
// const {Chess} = require("chess.js")
// const path = require("path")
// const e = require("express")

// const app = express();

// const server = http.createServer(app);

// const io = socket(server);

// const chess = new Chess()

// let players =  {};
// let currentPlayer = "W";

// app.set("view engine", "ejs");
// app.use(express.static(path.join(__dirname,"public")));

// app.get("/", (req, res) => {
//   res.render("index", {
//     // players: players,
//     // currentPlayer: currentPlayer
//   })
// })

// io.on("connection",function(uniqueSocket){
//     console.log("A user connected: ", uniqueSocket.id);

//     if(!players.white){
//         players.white = uniqueSocket.id;
//         uniqueSocket.emit("playerRole","white");
//     }
//     else if(!players.black){
//         players.black = uniqueSocket.id;
//         uniqueSocket.emit("playerRole","black");
//     }
//     else{
//         uniqueSocket.emit("spectatorRole");
//     }

//     uniqueSocket.on("disconnect", function(){
//         if(uniqueSocket.id===players.white){
//             delete players.white;
//         }
//         else if(uniqueSocket.id===players.black){
//             delete players.black;
//         }
//     })

//     uniqueSocket.on("move", (move)=>{
//          try {
//             if(chess.turn()==="W" && uniqueSocket.id != players.white)return;
//             if(chess.turn()==="B" && uniqueSocket.id != players.black) return;

//             const result = chess.move(move);
//             if(result){
//                 currentPlayer = chess.turn()
//                 io.emit("move",move)
//                 io.emit("updateBoard", chess.fen());
//             }else{
//              console.log("Invalid move", move);
//              uniqueSocket.emit("Invalid move",move);
//             }
//          } catch (error) {
//             console.log(error)
//             uniqueSocket.emit("Invalid move",move);
//          }
//     })

//     uniqueSocket.on("resign", function(){
//         io.emit("gameOver", currentPlayer === "W"? "Black resigns" : "White resigns");
//     })

//     uniqueSocket.on("reset", function(){
//         chess.reset();
//         io.emit("updateBoard", chess.ascii());
//         currentPlayer = "W";
//     })
// })

// server.listen(3000,function () {
//     console.log('Server is running on port 3000');
// });


// ***************************************server side code

const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();

const server = http.createServer(app);

const io = socket(server);

const chess = new Chess();

let players = {};
let currentPlayer = "w";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

io.on("connection", function (uniqueSocket) {
  console.log("A user connected: ", uniqueSocket.id);

  if (!players.white) {
    players.white = uniqueSocket.id;
    uniqueSocket.emit("playerRole", "w");
  } else if (!players.black) {
    players.black = uniqueSocket.id;
    uniqueSocket.emit("playerRole", "b");
  } else {
    uniqueSocket.emit("spectatorRole");
  }

  uniqueSocket.on("disconnect", function () {
    if (uniqueSocket.id === players.white) {
      delete players.white;
    } else if (uniqueSocket.id === players.black) {
      delete players.black;
    }
  });

  uniqueSocket.on("move", (move) => {
    try {
        // Ensure it's the correct player's turn
        if (chess.turn() === "w" && uniqueSocket.id !== players.white) return;
        if (chess.turn() === "b" && uniqueSocket.id !== players.black) return;

        const result = chess.move(move);
        if (result) {
            // Emit the updated board state
            io.emit("updateBoard", chess.fen());

            // Check for game-over conditions
            if (chess.isGameOver()) {
                if (chess.isCheckmate()) {
                    const winner = currentPlayer === "w" ? "Black wins!" : "White wins!";
                    io.emit("gameOver", winner);
                } else if (chess.isStalemate()) {
                    io.emit("gameOver", "It's a draw!");
                } else {
                    io.emit("gameOver", "Game Over!"); // Generic game over message for other conditions
                }
            }
            currentPlayer = chess.turn(); // Update current player
        } else {
            console.log("Invalid move", move);
            uniqueSocket.emit("Invalid move", move);
        }
    } catch (error) {
        console.log(error);
        uniqueSocket.emit("Invalid move", move);
    }
});




  uniqueSocket.on("resign", function () {
    io.emit(
      "gameOver",
      currentPlayer === "w" ? "Black resigns" : "White resigns"
    );
  });

  uniqueSocket.on("reset", function () {
    chess.reset();
    io.emit("updateBoard", chess.fen());
    currentPlayer = "w";
  });
});

server.listen(3000, function () {
  console.log("Server is running on port 3000");
});

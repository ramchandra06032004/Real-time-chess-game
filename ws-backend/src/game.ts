import { WebSocket } from "ws";
import { Chess } from 'chess.js'
import { GAME_OVER,INIT_GAME,MOVE } from "./messageType";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    public board: Chess
    private startTime: Date;
    private moveCount = 0;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white",
                player: player1,
            }
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black",
                player: player2,
            }
        }));
    }

    makeMove(socket: WebSocket, move: {
        from: string;
        to: string;
    }) {
        
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            console.log("Invalid move by player 1");
            return;
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            console.log("Invalid move by player 2");
            return;
        }

        try {
            console.log("pass move to board");
            
            this.board.move(move);
        } catch(e) {
            console.log(e);
            return;
        }
        
        if (this.board.isGameOver()) {
            // Send the game over message to both players
            this.player1.emit(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }))
            this.player2.emit(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }))
            return;
        }

        
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
       
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        
        this.moveCount++;
    }
}
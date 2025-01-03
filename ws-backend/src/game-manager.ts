import { WebSocket } from "ws";
import { Game } from "./game";
import { INIT_GAME, MOVE } from "./messageType";
import axios from "axios";

export class GameManager {
    private games: Game[];
    private pendingUser: { socket: WebSocket, userId: string } | null;
    private users: WebSocket[];

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket: WebSocket) {
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket);
        // Stop the Game here as the user has left
    }

    private addHandler(socket: WebSocket) {
        socket.on("message", async (data) => {
            const message = JSON.parse(data.toString());

            if (message.type === INIT_GAME) {
                const userId = message.payload.userId;

                if (this.pendingUser) {
                    // Start a game
                    const game = new Game(this.pendingUser.socket, socket);
                    this.games.push(game);

                    // Send API request to save both user IDs into the database
                    const player1Id = this.pendingUser.userId;
                    const player2Id = userId;

                    try {
                        await axios.post('http://localhost:3000/api/savegame', {
                            player1: player1Id,
                            player2: player2Id,
                            
                        });
                    } catch (error) {
                        console.error('Error saving game:', error);
                    }

                    this.pendingUser = null;
                } else {
                    this.pendingUser = { socket, userId };
                }
            }

            if (message.type === MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, message.payload.move);
                }
            }
        });
    }
}
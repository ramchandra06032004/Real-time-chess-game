import { WebSocketServer } from 'ws';
import { GameManager } from './game-manager';
const wss = new WebSocketServer({ port: process.env.PORT ? Number(process.env.PORT) : 8080 });
const gameManager = new GameManager();
wss.on('connection', function connection(ws) {
    gameManager.addUser(ws);
    ws.on("disconnect", () => gameManager.removeUser(ws))
});
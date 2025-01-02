"use client";
import { useEffect, useState } from "react";
import { Chess } from 'chess.js'
// import { Chess } from "../../node_modules/chess.js/dist/types/chess";
import { Button } from "@/components/button/button";
import { ChessBoard } from "@/components/chessboard/chessboard";
import { useSockets } from "@/hooks/useSocket";
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over"
const Game = () => {
    
    const socket = useSockets();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [started, setStarted] = useState(false);

    useEffect(()=>{
        if (!socket) {
            return;
        }
        socket.onmessage = (event:any) => { 
            const message = JSON.parse(event.data);
            console.log(message);
            switch (message.type) {
                case INIT_GAME:
                    //setChess(new Chess());
                    setBoard(chess.board());
                    setStarted(true);
                    console.log("Game initialized");
                    break;
                case MOVE:
                    const move = message.payload;
                    chess.move(move);
                    setBoard(chess.board());
                    console.log("Move Made");
                    break;
                case GAME_OVER:
                    console.log("Game over");
                    break;
            }
        }
    }, [socket]);


    if(!socket) return <div>Connecting ...........</div>
    return <div className="justify-center flex">
        <div className="pt-8 max-w-screen-lg w-full">
            <div className="grid grid-cols-6 gap-4 w-full">
                <div className="col-span-4 w-full w-full flex justify-center">
                    <ChessBoard chess={chess} setBoard={setBoard} socket= {socket} board={board} />
                </div>
                <div className="col-span-2 bg-slate-700 w-full flex justify-center">
                    <div className="pt-8 ">
                        {!started && <Button onClick={()=>{
                            socket.send(JSON.stringify({
                                type:INIT_GAME,
                            }))
                        }}> Play</Button>}
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Game;
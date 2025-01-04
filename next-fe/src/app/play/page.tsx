"use client";
import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Button } from "@/components/ui/button";
import { ChessBoard } from "@/components/chessboard/chessboard";
import { useSockets } from "@/hooks/useSocket";
import { useSession } from "next-auth/react";
import MoveSound from "../../../public/move.wav"

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

const Game = () => {
  const moveAudio = new Audio(MoveSound);
  const { data: session } = useSession();
  const socket = useSockets();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [color,setColor] = useState("");
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event: any) => {
      const message = JSON.parse(event.data);
      console.log(message);
      setColor(message.payload.color);
      switch (message.type) {
        case INIT_GAME:
          setBoard(chess.board());
          setStarted(true);
          setWaiting(false);
          console.log("Game initialized");
          break;
          case MOVE:
          moveAudio.play();
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          console.log("Move Made");

          break;
        case GAME_OVER:
          console.log("Game over");
          break;
      }
    };
  }, [socket]);

  if (!socket) return <div>Connecting ...........</div>;

  return (
    <div className="justify-center flex">
      <div className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-6 gap-4 w-full">
          <div className="col-span-4 w-full flex justify-center">
            <ChessBoard
              chess={chess}
              setBoard={setBoard}
              socket={socket}
              board={board}
            />
          </div>
          <div className="col-span-2 items-center w-full flex justify-center">
            <div className="pt-8">
              {!started && !waiting ? (
                <Button
                  onClick={() => {
                    if (session) {
                      const userId = session.user._id;
                      socket.send(
                        JSON.stringify({
                          type: INIT_GAME,
                          payload: { userId },
                        })
                      );
                      setWaiting(true);
                    }
                  }}
                  className="h-14 w-28 text-2xl"
                >
                  Play
                </Button>
              ) : started ? (
                <>
                  <div>your color is this {color}</div>
                </>
              ) : (
                <>
                  <div>Waiting for opponent</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;

import { Chess, Square } from "chess.js"
import { useState } from "react";
import { Color, PieceSymbol } from "../../../node_modules/chess.js/dist/types/chess";
import { MOVE } from "@/app/play/page";

export const ChessBoard = ({ chess, board, socket, setBoard }: {
    chess:any;
    setBoard:any
    board : ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    }| null)[][];
    socket: WebSocket
} ) => {
    const [from, setFrom] = useState<null | Square>(null);
    return <div className="text-white-200 p-12 bg-[#1282a2] rounded-lg">
        {board.map((row, i) =>{
            return <div key={i} className="flex">
                {row.map((square, j)=>{
                    const squareRepresentation = String.fromCharCode(97 + (j % 8 )) + "" + (8-i) as Square;

                    return <div onClick={()=>{
                        if (!from) {
                            setFrom(squareRepresentation);
                        } else {
                            const responce=socket.send(JSON.stringify({
                                type:MOVE,
                                payload: {
                                    move: {
                                        from,
                                        to: squareRepresentation
                                    }
                                }                            
                            }))
                           //sendTo(squareRepresentation);
                            setFrom(null);
                            console.log({
                                from, 
                                to: squareRepresentation
                            });
                        }
                    }} key={j} className={`w-16 h-16 ${(i+j)%2 ===0 ? `bg-[#034078]` : `bg-[#fefcfb]` }`}> 
                        <div className="w-full justify-center flex h-full">
                            <div className="h-full justify-center flex flex-col">
                                {/* {square ? square.type:""} */}
                                {/* {square ? <img className="w-4" src={`/${square?.color ==="b" ? "b".square?.type : "w".square?.type }.png`} />} */}

                                {/* { square ? <img className="w-4" src={`/b${square?.type}.png`} /> : "" } */}
                                 { square ? <img src={`/${square?.color ==="b" ? `b${square?.type}` : `w${square?.type}` }.png`} /> : null }
                            </div>
                        </div>
                    </div>
                })} 

            </div>
        })}
    </div>
}

/*
{ board:{
    square: square;
    type: PieceSymbol;
    color: Color;
} | null)[][]
}
*/
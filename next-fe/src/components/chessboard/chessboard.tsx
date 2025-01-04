"use client";
import { Chess, Square } from "chess.js";
import { useState } from "react";
import { Color, PieceSymbol } from "../../../node_modules/chess.js/dist/types/chess";
import { MOVE } from "@/app/play/page";
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import moveSound from '../../../public/move.wav';

const ItemTypes = {
    PIECE: 'piece',
};

const Draggable = ({ piece, position }: { piece: any, position: Square }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: position,
    });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="h-full justify-center flex flex-col">
            {piece ? <img src={`/${piece.color === "b" ? `b${piece.type}` : `w${piece.type}`}.png`} /> : null}
        </div>
    );
};

const Droppable = ({ children, position, movePiece }: { children: any, position: Square, movePiece: (from: Square, to: Square) => void }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: position,
    });

    const style = {
        backgroundColor: isOver ? 'rgba(0, 255, 0, 0.5)' : undefined,
    };

    return (
        <div ref={setNodeRef} style={style} className="w-16 h-16">
            {children}
        </div>
    );
};

export const ChessBoard = ({ chess, board, socket, setBoard }: {
    chess: any;
    setBoard: any;
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    socket: WebSocket;
}) => {
    const [from, setFrom] = useState<null | Square>(null);

    const playMoveSound = () => {
        const audio = new Audio(moveSound);
        audio.play().catch(error => console.error("Error playing sound:", error));
    };

    const movePiece = (from: Square, to: Square) => {
        playMoveSound();
        socket.send(JSON.stringify({
            type: MOVE,
            payload: {
                move: {
                    from,
                    to,
                },
            },
        }));
        setFrom(null);
        console.log({ from, to });
    };

    return (
        <DndContext onDragEnd={({ active, over }) => {
            if (active && over) {
                movePiece(active.id as Square, over.id as Square);
            }
        }}>
            <div className="text-white-200 p-12 bg-[#1282a2] rounded-lg">
                {board.map((row, i) => {
                    return (
                        <div key={i} className="flex">
                            {row.map((square, j) => {
                                const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;
                                const isDarkSquare = (i + j) % 2 === 0;

                                return (
                                    <Droppable key={j} position={squareRepresentation} movePiece={movePiece}>
                                        <div className={`w-16 h-16 ${isDarkSquare ? `bg-[#034078]` : `bg-[#fefcfb]`}`}>
                                            <div className="w-full justify-center flex h-full">
                                                <Draggable piece={square} position={squareRepresentation} />
                                            </div>
                                        </div>
                                    </Droppable>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </DndContext>
    );
};
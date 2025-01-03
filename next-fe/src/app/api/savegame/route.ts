import dbConnection from "@/dbConnection/dbConnection";
import Game from "@/models/gameModel";
import { NextResponse } from "next/server";

export async function POST(request:Request) {
    dbConnection();
    try {
            const { player1, player2 } = await request.json();
            
            const newGame = new Game({
                player1,
                player2
            });
            await newGame.save();
         return NextResponse.json({
            success: true,
            message: 'Game saved successfully',
            data: newGame,
         },{
            status: 200
         })
            
        } catch (error) {
            console.error('Error saving game:', error);
            return NextResponse.json({ success: false, message: 'Error saving game' }, { status: 500 });
        }
}
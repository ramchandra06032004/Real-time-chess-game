//take from to and move number and save the move
import dbConnection from "@/dbConnection/dbConnection";
import Game from "@/models/gameModel";
import Move from "@/models/moveModel";
import { NextResponse } from "next/server";

export async function POST(request:Request) {
    dbConnection();
    try {
        
        const {from, to, moveNumber,gameId} = await request.json();
        const move=new Move({
            from,
            to,
            moveNumber,
        })
        await move.save();
        const currGame=await Game.findById(gameId);
        if(!currGame){
            return NextResponse.json({
                message:"Game not found"
            },{
                status:404
            })
        }
        await currGame.moves.push(move._id);
        await currGame.save();
        
        return NextResponse.json({
            message:"Move saved successfully"

        },{
            status:201
        })
    } catch (error) {
        return NextResponse.json({
            message:"Move not saved error in saving move"
        },{
            status:500
        })
    }
}
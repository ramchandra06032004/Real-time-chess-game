//take from to and move number and save the move
import dbConnection from "@/dbConnection/dbConnection";
import Move from "@/models/moveModel";
import { NextResponse } from "next/server";

export async function POST(request:Request) {
    dbConnection();
    try {
        const {from, to, moveNumber} = await request.json();
        const move=new Move({
            from,
            to,
            moveNumber
        })
        await move.save();
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
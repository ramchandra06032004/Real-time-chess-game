import dbConnection from "../dbConnection/dbConnection.js";
import Move from "../Models/moveModel.js"
import Game from '../Models/gameModel.js'
export const putMoveInDB = async (move) => {
    try {
        dbConnection();
        const newMove = new Move({
            from: move.from,
            to: move.to,
            moveNumber: move.moveNumber
        });
        const gameId=move.gameId
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
        const savedMove = await newMove.save();
        console.log("Move saved successfully:", savedMove);
    } catch (error) {
        console.log("Error in putMoveInDB:", error);
        return error;
    }
}
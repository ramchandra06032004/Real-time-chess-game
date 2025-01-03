import mongoose, { Schema } from "mongoose";

const gameModel=new mongoose.Schema({
    player1:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    player2:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    StartTime:{
        type:Date,
        default:Date.now
    },
    Result:{
        type:String,
        default:"",
        enum:["","draw","player1","player2"]
    },
    moves:{
        type:[Schema.Types.ObjectId],
        ref:"Move",
    }

})


const Game=(mongoose.models.Game||mongoose.model("Game",gameModel))

export default Game;
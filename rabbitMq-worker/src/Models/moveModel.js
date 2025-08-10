import mongoose from "mongoose";

const moveSchema=new mongoose.Schema({
    from:{
        type:String,
        required:true
    },
    to:{
        type:String,
        required:true
    },
    moveNumber:{
        type:Number,
        required:true
    }
})

const Move=mongoose.models.Move||mongoose.model("Move",moveSchema);
export default Move;
import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server"

let AllreadyConnected=0
const dbConnection=async()=>{
    try {
        if(AllreadyConnected){
            console.log("Database already connected")
            return
        }
        //console.log("Connecting to database...",process.env.MONGO_URI);
        const responce=await mongoose.connect(process.env.MONGO_URI!)
        
        console.log("Database connected")
        AllreadyConnected=responce.connections[0].readyState
    } catch (error) {
        console.log("Database connection failed")
        console.log(error)
        return NextResponse.json({
            message:"Database connection failed"
        },{
            status:500
        })
    }
}

export default dbConnection
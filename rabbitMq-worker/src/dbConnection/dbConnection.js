import mongoose from "mongoose"

let AllreadyConnected=0
const dbConnection=async()=>{
    try {
        if(AllreadyConnected){
            console.log("Database already connected")
            return
        }
        const URI = process.env.MONGO_URI;
        console.log("Connecting to database...", URI);
        const responce = await mongoose.connect(URI);
        console.log("Database connected");
        AllreadyConnected = responce.connections[0].readyState;
    } catch (error) {
        console.log("Database connection failed");
        console.log(error);
        return error;
    }
}

export default dbConnection
import amqp from "amqplib";
import { putMoveInDB } from "./Helper/putMoveInDB.js";
export const consumer = async () => {
  try {
      
    const queue= process.env.QUEUE || "Moves-Queue";
    
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, "direct", { durable: true });
    channel.consume(queue, async (move) => {
      if (move != null) {
        const error=await putMoveInDB(JSON.parse(move.content));
        if(error){
            console.log("Error saving move to DB:", error);
        }else{
            console.log("Move processed and saved to DB:");
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

import amqp from "amqplib";
const queue = process.env.QUEUE || "Moves-Queue";
import { Move } from "./types";
export const sendMoveToRabbitMQ = async (move:Move) => {
    try {
    console.log("Sending move to message broker");
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchangeKey = "send_move_key";
    const exchange = "moveExchange";
    await channel.assertExchange(exchange, "direct", { durable: true });
    
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue,exchange, exchangeKey);
    channel.publish(exchange, exchangeKey, Buffer.from(JSON.stringify(move)));
    console.log("move send succesfully");
  } catch (error) {
    console.log(error);
  }
};



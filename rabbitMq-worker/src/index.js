console.log("Starting RabbitMQ consumer...");
import { consumer } from "./consumer.js";
import dotenv from 'dotenv';
dotenv.config();
consumer();
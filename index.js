import Express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import userRouter from "./routes.js";


const app = Express();
app.use(cors());
app.use(Express.json());
dotenv.config();
const PORT = 5000;

const mongo=process.env.MONGO_URL;

async function connectToMongo() {
     const client=new MongoClient(mongo);
 await client.connect();
 console.log("Connected to MongoDB");
 return client;
}

export const client=await connectToMongo();

app.use("/api/auth",userRouter)
app.use("/api",userRouter)


app.listen(PORT,()=>{console.log(`server started on port ${PORT}`)});
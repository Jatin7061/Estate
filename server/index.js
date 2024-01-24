import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
const app = express();
dotenv.config({path: './config.env'});

const port = process.env.Port;
const Database = process.env.Mongo;

mongoose.connect(Database).then(()=>{
    console.log("Database is connected")
}).catch((er)=>{
     console.log(er)
})


app.listen((port),(request,response)=>{
console.log(`App is listening at ${port}`)
})
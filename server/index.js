import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userrouter from './routers/userrouter.js'
import adminrouter from './routers/adminrouter.js'
const app = express();

dotenv.config({path: './config.env'});

const port = process.env.Port;
const Database = process.env.Mongo;

app.use(express.json());

mongoose.connect(Database).then(()=>{
    console.log("Database is connected")
}).catch((er)=>{
     console.log(er)
})


app.listen((port),()=>{
console.log(`App is listening at ${port}`)
})

//Both are same
app.use(userrouter);
app.use(adminrouter);

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })

})

// app.use('/server/user',userrouter);
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userrouter from './routers/userrouter.js'
import adminrouter from './routers/adminrouter.js'
import listingrouter from './routers/listingrouter.js'

const app = express();

dotenv.config({path: './config.env'});

const port = process.env.Port;
const Database = process.env.Mongo;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: '*'
}));


mongoose.connect(Database).then(()=>{
    console.log("Database is connected")
}).catch((er)=>{
     console.log(er)
})


app.listen((port),()=>{
console.log(`App is listening at ${port}`)
})

//Both are same
app.use('/api/user',userrouter);
app.use('/api/auth', adminrouter);
app.use('/api/listing',listingrouter)
// app.use(userrouter);
// app.use(adminrouter);

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
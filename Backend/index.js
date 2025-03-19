import dotenv from 'dotenv'
import express from 'express';
import dbConnection from './db/db.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { authenticateToken } from './middlewares/auth.js';

import consumerRouter from './routes/consumer.route.js';
import providerRouter from './routes/provider.route.js';
import foodRouter from './routes/food.routes.js'
import bookingRouter from './routes/booking.route.js'
import uploadRouter from './routes/upload.route.js'

const app = express();
dotenv.config()


app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))



app.use('/consumer', consumerRouter)
app.use('/provider', providerRouter)
app.use('/foodDetails', foodRouter);
app.use('/booking', bookingRouter);
app.use('/upload', uploadRouter)


dbConnection()
.then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log(`Server running on port ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.error("Failed to start the server:", err);
});



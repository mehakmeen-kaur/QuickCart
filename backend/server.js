import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import itemrouter from './routes/productRoute.js';
import authMiddleware from './middleware/auth.js';
import cartRouter from './routes/cartRoute.js';
import orderrouter from './routes/orderRoute.js';

const app=express();
const port=process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

//MIDDLEWARE
app.use(cors({
    origin:(origin,callback)=>{
        const allowedOrigins=['http://localhost:5173','http://localhost:5174'];
        if(!origin || allowedOrigins.includes(origin)){
            callback(null,true);
        }
        else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials:true,
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
connectDB();

//ROUTES
app.use('/api/users',userRouter);
app.use('/api/cart',authMiddleware,cartRouter);

app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.use('/api/items',itemrouter);
app.use('/api/orders',orderrouter);

app.get('/',(req,res)=>{
    res.send('API WORKING')
})

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
}); 
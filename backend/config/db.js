import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://mehakmeenkaur_db_user:rushbakset123@cluster0.5dxwicg.mongodb.net/RushBasket')
    .then(()=> console.log("DB CONNECTED"))
}
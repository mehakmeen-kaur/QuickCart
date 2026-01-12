import { CartItem } from "../models/cartModel.js";
import createError from "http-errors";

//GET FUNCTION 
export const getCart=async(req,res,next)=>{
    try{
        const items=await CartItem.find({user:req.user._id}).populate({
            path:'product',
            model:'Product'
        });
        const formatted=items.map(ci=>({
            _id:ci._id.toString(),
            product:ci.product,
            quantity:ci.quantity
        }))
        res.json(formatted)
    }
    catch(err){
        next(err);
    }
}

//POST METHOD TO ADD TO CART ITEMS
export const addToCart=async(req,res,next)=>{
    try{
        const {productId,itemId,quantity}=req.body;
        const pid=productId || itemId;

        if(!pid || typeof quantity!=='number')
        {
            throw createError(400,'Product identifier and quantity are required');
        }
        let cartItem=await CartItem.findOne({user:req.user._id,product:pid});
        if(cartItem){
            cartItem.quantity=Math.max(1,cartItem.quantity+quantity)
            if(cartItem.quantity<1){
                await cartItem.deleteOne();
                return res.status(200).json({
                    message:"Item Removed",
                    _id:cartItem._id.toString()
                })
            }
            await cartItem.save();
            await cartItem.populate('product');
            return res.status(200).json({
                _id:cartItem._id.toString(),
                product:cartItem.product,
                quantity:cartItem.quantity
            });
        }
        cartItem=await CartItem.create({
            user:req.user._id,
            product:pid,   
            quantity 
        })
        await cartItem.populate('product');
        res.status(201).json({
            _id:cartItem._id.toString(),
            product:cartItem.product,
            quantity:cartItem.quantity
        })
    }
    catch(err){
        next(err);
    }
}

//PUT METHOD TO UPDATE CART ITEMS
export const updateCartItem=async(req,res,next)=>{
    try{
        const {quantity}=req.body;
        const cartItem=await CartItem.findOne({_id:req.params.id,user:req.user._id});
        if(!cartItem){
            throw createError(404,'Cart item not found');
        }
        cartItem.quantity=Math.max(1,quantity);
        await cartItem.save();
        await cartItem.populate('product');
        res.json({
            _id:cartItem._id.toString(),
            product:cartItem.product,
            quantity:cartItem.quantity
        })
    }
    catch(err)
    {
        next(err);
    }
}

//DELETE METHOD TO DELETE CART ITEM
export const deleteCartItem=async(req,res,next)=>{
    try{
        const cartItem=await CartItem.findOne({_id:req.params.id,user:req.user._id});
        if(!cartItem){
            throw createError(404,'Cart item not found');
        }
        await cartItem.deleteOne();
        res.json({message:'Item deleted',_id:req.params.id});
    }
    catch(err){
        next(err);
    }
}

//CLEAR CART METHOD
export const clearCart=async(req,res,next)=>{
    try{
        await CartItem.deleteMany({user:req.user._id});
        res.json({message:"Cart Cleared"});
    }
    catch(err){ 
        next(err);
    }
}
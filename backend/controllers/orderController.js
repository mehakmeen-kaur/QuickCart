import Stripe from 'stripe';
import Order from '../models/orderModel.js';
import {v4 as uuidv4} from 'uuid';
const stripe=Stripe(process.env.STRIPE_SECRET_KEY)

//CREATE A NEW ORDER
//CREATE A NEW ORDER
export const createOrder=async(req,res)=>{
    try{
        console.log('1. Starting createOrder');
        const {customer,items,paymentMethod,notes,deliveryDate}=req.body;
        
        console.log('2. Validating items');
        if(!Array.isArray(items) || items.length===0){
            return res.status(400).json({
                message:'Invalid or empty items array'
            })
        }
        
        console.log('3. Normalizing payment method');
        const normalizedPM=paymentMethod==='COD' ? 'Cash on Delivery' : 'Online Payment';
        
        console.log('4. Mapping order items');
        const orderItems=items.map(i=>({
            id:i.id,
            name:i.name,
            price:Number(i.price),
            quantity:Number(i.quantity),
            imageUrl:i.imageUrl
        }));
        
        console.log('5. Generating order ID');
        const orderId=`ORD-${uuidv4()}`;
        let newOrder;
        
        if(normalizedPM==='Online Payment'){
            console.log('6. Creating Stripe session');
            const session=await stripe.checkout.sessions.create({
                payment_method_types:['card'],
                mode:'payment',
                line_items:orderItems.map(o=>({
                    price_data:{
                        currency:'inr',
                        product_data:{name:o.name},
                        unit_amount:Math.round(o.price*100)
                    },
                    quantity:o.quantity
                })),
                customer_email:customer.email,
                success_url:`${process.env.FRONTEND_URL}/myorders/verify?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url:`${process.env.FRONTEND_URL}/checkout?payment_status=cancel`,
                metadata:{orderId}
            });
            
            console.log('7. Creating order object for online payment');
            newOrder=new Order({
                orderId,
                user: req.user._id,
                customer,
                items: orderItems,
                shipping: 0,
                paymentMethod: normalizedPM,
                paymentStatus: 'Unpaid',
                sessionId: session.id,
                paymentIntentId: session.payment_intent,
                notes,
                deliveryDate
            });
            
            console.log('8. Saving order to database');
            await newOrder.save();
            console.log('9. Order saved successfully');
            return res.status(201).json({order:newOrder,checkoutUrl:session.url});
        }

        //FOR COD
        console.log('10. Creating order object for COD');
        newOrder=new Order({
            orderId,
            user: req.user._id,
            customer,
            items: orderItems,
            shipping: 0,
            paymentMethod: normalizedPM,
            paymentStatus: 'Paid',
            notes,  
            deliveryDate
        });
        
        console.log('11. Saving COD order to database');
        await newOrder.save();
        console.log('12. COD order saved successfully');
        res.status(201).json({order:newOrder,checkoutUrl:null}); 
    }
    catch(err){
        console.error('CreatedOrder Error:', err);
        console.error('Error stack:', err.stack);
        res.status(500).json({message:'Server Error', error:err.message});
    }
}

//CONFIRM STRIPE PAYMENT
export const confirmPayemt=async(req,res)=>{
    try{
        const {session_id}=req.query;
        if(!session_id)
            return res.status(400).json({message:'Session ID is required'});
        const session=await Stripe.checkout.sessions.retrieve(session_id);
        if(session.payment_status!=='paid')
        {
            return res.status(400).json({message:'Payment not completed'});
        }

        const order=await Order.findOneAndUpdate(
            {sessionId:session_id},
            {paymentStatus:'Paid'},
            {new:true}
        );
        if(!order) return res.status(404).json({message:'Order not found'})
            res.json(order)
    }
    catch(err){
        console.error('ConfirmPayment Error:', err)
        res.status(500).json({message:'Server Error', error:err.message});
    }
}

//GET ALL ORDERS
export const getOrders=async(req,res)=>{
    try{
        const orders=await Order.find({})
        .sort({createdAt:-1})
        .lean()
        res.json(orders);
    }
    catch(err){
        console.error('GetOrders Error:', err)
        // next(err);
        res.status(500).json({message:'Server Error', error:err.message});
    }
}

//GET ORDERS BY ID
export const getOrderById=async(req,res)=>{
    try{
        const order=await Order.findById(req.params.id).lean();
        if(!order)
        {
            return res.status(404).json({message:'Order not found'});
        }
        res.json(order)
    }
    catch(err){
        console.error('GetOrdersById Error:', err)
        //next(err);
        res.status(500).json({message:'Server Error', error:err.message});
    }
}

//UPDATE ORDERS BY ID
export const upadateOrder=async(req,res)=>{
    try{
        const allowed=['status','paymentStatus','deliveryDate','notes'];
        const updateData={};
        allowed.forEach(field=>{
            if(req.body[field]!==undefined){
                updateData[field]=req.body[field];
            }
        });
        const updated=await Order.findByIdAndUpdate(
            req.params.id,
            updateData,
            {new:true, runValidators:true}
        ).lean();
        if(!updated){
            return res.status(404).json({message:'Order not found'});
        }
        res.json(updated);
    }
    catch(err){
        console.error('UpdateOrders Error:', err)
        res.status(500).json({message:'Server Error', error:err.message});
    }
}

//DELETE METHOD TO DELETE ORDERS
export const deleteOrder=async(req,res)=>{
    try{
        const deleted=await Order.findByIdAndDelete(req.params.id).lean();
        if(!deleted){
            return res.status(404).json({message:'Order not found'});
        }
        res.json({message:'Order deleted successfully'});
    }
    catch(err){
        console.error('DeletedOrders Error:', err)
        res.status(500).json({message:'Server Error', error:err.message});
    }
}
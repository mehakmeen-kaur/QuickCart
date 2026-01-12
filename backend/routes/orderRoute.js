import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { confirmPayemt, createOrder, deleteOrder, getOrderById, getOrders, upadateOrder } from '../controllers/orderController.js';

const orderrouter=express.Router();

//PROTECTED ROUTES
orderrouter.post('/',authMiddleware,createOrder);
orderrouter.get('/confirm',authMiddleware,confirmPayemt);

//PUBLIC ROUTES
orderrouter.get('/',getOrders);
orderrouter.get('/:id',getOrderById);
orderrouter.put('/:id',upadateOrder);
orderrouter.delete('/:id',deleteOrder);

export default orderrouter;
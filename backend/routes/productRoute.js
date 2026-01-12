import express from "express";
import multer from "multer";
import { createProduct, deleteProduct, getProducts } from "../controllers/productController.js";

const itemrouter=express.Router();

//MULTER SETUP
const storage=multer.diskStorage({
    destination:(_req,_file,cb)=>cb(null,'./uploads/'),
    filename:(_req,_file,cb)=>cb(null,`${Date.now()}-${_file.originalname}`)
})
const upload =multer({storage});

//ROUTES
itemrouter.get('/',getProducts);
itemrouter.post('/',upload.single('image'),createProduct);
itemrouter.delete('/:id',deleteProduct);

export default itemrouter;
import { Router } from "express";
const router = Router();
import { ObjectId } from "mongodb";
import { getUserById } from "../data/users.js";
import {getAllProducts,getProductById, removeFromCart} from '../data/products.js'

router.route('/').get(async (req, res) => {
    let auth = false;
    let allProducts;
    if (req.session.user) {
        auth = true;
    }
    try {
        if (!req.session.user){
            return res.redirect("/login")
        }
        let allProducts = await getAllProducts()
        let user = await getUserById(req.session.user.id)
        allProducts.forEach(product => {
            product.reviews.forEach(review =>{
                if(review.text){
                    review.text = "" 
                }
                review.time = ""
                review.user = "" 
            })
            product.reviews = JSON.stringify(product.reviews)
        });
        return res.render("cart", {
            title: "Your Cart",
            auth: auth,
            cart: user.cart,
            isEmpty: user.cart.length==0,
            products: allProducts
            //id: req.session.user.id
          });
        
    } catch (error) {
        throw error
    }
    
  });
router.route('/delete/:pos').get(async (req,res) => {
    let auth = false;
    if (req.session.user) {
        auth = true;
    }
    let pos = req.params.pos
    try {
        if (!req.session.user){
            return res.redirect("/login")
        }
        await removeFromCart(req.session.user.id,parseInt(pos))

        return res.redirect("/cart")
        
    } catch (error) {
        throw error
    }
})


export default router;

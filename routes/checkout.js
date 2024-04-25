import { Router } from "express";
const router = Router();
import { ObjectId } from "mongodb";
import { getUserById } from "../data/users.js";
import {getAllProducts,clearCart} from '../data/products.js'
import { getCardsByUserID } from "../data/cards.js";
router.route('/').get(async (req, res) => {
    let auth = false;
    if (req.session.user) {
        auth = true;
    }
    try {
        if (!req.session.user){
            return res.redirect("/login")
        }
        let allProducts = await getAllProducts()
        let user = await getUserById(req.session.user.id)
        let cards = await getCardsByUserID(req.session.user.id)
        cards = cards.map((card)=>{
            return {id: card._id, last4Digits: card.last4Digits}
        })
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
        if (user.cart.length==0) return res.redirect("/")
        return res.render("checkout", {
            title: "Checkout",
            auth: auth,
            cart: user.cart,
            cards: cards,
            isEmpty: user.cart.length==0,
            id: req.session.user.id
          });
        
    } catch (error) {
        throw error
    }
    
  }).post(async(req,res)=>{
    let auth = false;
    if (req.session.user) {
        auth = true;
    }
    try {
        if (!req.session.user){
            return res.redirect("/login")
        }
        let allProducts = await getAllProducts()
        let user = await getUserById(req.session.user.id)
        let deleteCart = await clearCart(req.session.user.id)
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
        if (user.cart.length==0) return res.redirect("/")
        return res.render("completeOrder", {
            title: "completeOrder",
            auth: auth,
            cart: user.cart
          });
        
    } catch (error) {
        throw error
    }
  });


export default router;

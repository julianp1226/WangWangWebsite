import { Router } from "express";
const router = Router();
import { ObjectId } from "mongodb";
import { getUserById } from "../data/users.js";
import {getAllProducts,getProductById} from '../data/products.js'

router.route('/').get(async (req, res) => {
    let auth = false;
    let allProducts;
    if (req.session.user) {
        auth = true;
    }
    return res.render("cart", {
        title: "Your Cart",
        auth: auth,
        //id: req.session.user.id
      });
  });



export default router;

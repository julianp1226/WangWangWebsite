import { Router } from "express";
const router = Router();
import { ObjectId } from "mongodb";
import {createProduct,getAllProducts,getProductById} from '../data/products.js'

router.route('/').get(async (req, res) => {
    let auth = false;
    let allProducts;
    try {
        allProducts = await getAllProducts()
    } catch (e) {
        return res.status(500).render("error", { error: e, status: 500 });
    }
    if (req.session.user) {
        auth = true;
    }
    return res.render("mall", {
        title: "Shop",
        auth: auth,
        products: allProducts
        //id: req.session.user.id
      });
  });

export default router;

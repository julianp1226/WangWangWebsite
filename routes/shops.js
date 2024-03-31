import { Router } from "express";
const router = Router();
import { ObjectId } from "mongodb";
import {createProduct,getAllProducts,getProductById} from '../data/products.js'

router.route('/').get(async (req, res) => {
    let auth = false;
    let allProducts;
    try {
        allProducts = await getAllProducts()
        allProducts.map((x)=>x["rating"] = 5)
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
//TODO
router.route('/:id').get(async (req, res) => {
let auth = false;
let product;
let allProducts
try {
    product = await getProductById(req.params.id)
    product['rating'] = 5
    allProducts = await getAllProducts()
    allProducts.map((x)=>x["rating"] = 5)
    //Increase product list size for now (for proof of concept)
    allProducts = allProducts.concat(allProducts)
    allProducts = allProducts.concat(allProducts)
    allProducts = allProducts.concat(allProducts)
} catch (e) {
    return res.status(500).render("error", { error: e, status: 500 });
}
if (req.session.user) {
    auth = true;
}
return res.render("mallProduct", {
    title: product.name,
    auth: auth,
    product: product,
    products: allProducts.slice(0,6)
    //id: req.session.user.id
    });
});
router.route('/viewall/:type').get(async (req, res) => {
    let auth = false;
    let allProducts;
    let titleWord
    try {
        switch (req.params.type) {
            //To be used to retrieve different products (i.e best selling list, recommended list, etc), for now retrieve all products
            case "best":
                allProducts = await getAllProducts()
                allProducts.map((x)=>x["rating"] = 5)
                //Increase product list size for now (for proof of concept)
                allProducts = allProducts.concat(allProducts)
                allProducts = allProducts.concat(allProducts)
                allProducts = allProducts.concat(allProducts)
                titleWord = "Best Selling Products"
                break;
            case "recommended":
                allProducts = await getAllProducts()
                allProducts.map((x)=>x["rating"] = 5)
                //Increase product list size for now (for proof of concept)
                allProducts = allProducts.concat(allProducts)
                allProducts = allProducts.concat(allProducts)
                allProducts = allProducts.concat(allProducts)
                titleWord = "Recommended Products"
                break;
            case "trending":
                allProducts = await getAllProducts()
                allProducts.map((x)=>x["rating"] = 5)
                //Increase product list size for now (for proof of concept)
                allProducts = allProducts.concat(allProducts)
                allProducts = allProducts.concat(allProducts)
                allProducts = allProducts.concat(allProducts)
                titleWord = "Trending Products"
                break;
            case "recent":
                allProducts = await getAllProducts()
                allProducts.map((x)=>x["rating"] = 5)
                //Increase product list size for now (for proof of concept)
                allProducts = allProducts.concat(allProducts)
                allProducts = allProducts.concat(allProducts)
                allProducts = allProducts.concat(allProducts)
                titleWord = "Recently Viewed Products"
                break;
            default:
                throw new Error("Invalid Category")
        }
        
    } catch (e) {
        return res.status(500).render("error", { error: e, status: 500 });
    }
    if (req.session.user) {
        auth = true;
    }
    return res.render("mallFull", {
        title: "View ".concat(titleWord),
        auth: auth,
        products: allProducts,
        titleWord: titleWord
        //id: req.session.user.id
        });
    });

export default router;

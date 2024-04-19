import { Router } from "express";
const router = Router();
import { ObjectId } from "mongodb";
import {addReview, createProduct,getAllProducts,getProductById} from '../data/products.js'
import xss from 'xss';
import { validStr, validNumber, validId } from "../validation.js";
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
    allProducts.forEach(product => {
        product.reviews.forEach(review =>{
            review.text = ""
        })
        product.reviews = JSON.stringify(product.reviews)
    });
    return res.render("mall", {
        title: "Shop",
        auth: auth,
        products: allProducts
        //id: req.session.user.id
      });
  });

router.route('/:id').get(async (req, res) => {
let auth = false;
let product;
let allProducts
try {
    product = await getProductById(req.params.id)
    product.reviews.forEach(review => {
        review.time = review.time.toDateString()
    })
    product.reviews = product.reviews.reverse()
    product.revstr = product.reviews.map(review =>{
        return {stars:review.stars}
    })
    product.revstr = JSON.stringify(product.revstr)
    allProducts = await getAllProducts()
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

router.route('/viewall/similarto/:id').get(async (req, res) => {
    let auth = false;
let product;
let allProducts
try {
    product = await getProductById(req.params.id)
    allProducts = await getAllProducts()
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
return res.render("mallFull", {
    title: "Similar To ".concat(product.name),
    auth: auth,
    products: allProducts,
    titleWord: "Similar To ".concat(product.name)
    //id: req.session.user.id
    });
});
router.route('/review/:id').post(async (req, res) => {
    let stars = xss(req.body.rating);
    let text = xss(req.body.reviewText);
    let user = req.session.user
    let productId = req.params.id
    let starnum;
    if(!user){
        return res.redirect("/"+productId)
    }
    if (!stars){
        throw new Error("No stars amount provided")
    }
    try {
        starnum = parseInt(stars)
        starnum = validNumber(starnum,"Stars")
        user = validId(user.id, "Product Id")
        productId = validId(productId,"Product Id")
    } catch (error) {
        throw new Error(error)
    }
    if (starnum < 1 || starnum > 5){
        throw new Error("Invalid star amount provided")
    }
    if (text){
        try{
            text = validStr(text,"Review Text")
        }catch (error){
            throw new Error(error)
        }
    } else {
        text = ""
    }

    try {
        await addReview(productId,starnum,text,user)
    } catch (error) {
        throw new Error(error)
    }
    
    return res.redirect("/shop/"+productId)
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
                //Increase product list size for now (for proof of concept)
                allProducts = allProducts.concat(allProducts)
                allProducts = allProducts.concat(allProducts)
                allProducts = allProducts.concat(allProducts)
                titleWord = "Best Selling Products"
                break;
            case "recommended":
                allProducts = await getAllProducts()
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
                //Increase product list size for now (for proof of concept)
                allProducts = allProducts.concat(allProducts)
                allProducts = allProducts.concat(allProducts)
                allProducts = allProducts.concat(allProducts)
                titleWord = "Recommended Products"
                break;
            case "trending":
                allProducts = await getAllProducts()
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
                //Increase product list size for now (for proof of concept)
                allProducts = allProducts.concat(allProducts)
                allProducts = allProducts.concat(allProducts)
                allProducts = allProducts.concat(allProducts)
                titleWord = "Trending Products"
                break;
            case "recent":
                allProducts = await getAllProducts()
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

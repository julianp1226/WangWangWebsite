//man i dont know js

import { products, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

import {
  validId,
  validStr,
  validUsername,
  validNumber,
  validState,
  validZip,
  validTime,
  validTimeInRange,
  validEmail,
  validExpLevel,
  validImageUrl,
  checkPassword
} from "../validation.js";
import { getUserById } from "./users.js";

const createProduct = async (
  name,
  description,
  image,
  images,
  quantity,
  actualPrice,
  discountedPrice,
  categoryId,
  vendorId,
  couponId,
  status,
) => {
  if (
    !name || !description || !actualPrice || !discountedPrice || !categoryId || !quantity || !couponId || !vendorId
  ) {
    throw "Error: Some necessary inputs not provided";
  };
  if (!image) {
    image = "/public/images/No_Image_Available.jpg";
  } else {
    image = validImageUrl(image);
  };
  if (!status) {
    status = "active";
  } else {
    status = validStr(status, "Status");
    if (status !== 'active' && status !== 'inactive'){
      throw "Invalid status value";
    }
  };
  if (!images){
    images = [];
  } else {
    try {
      images = images.map(a => validImageUrl(a));
    } catch (e) {
      throw e;
    }
  };
  try {
    name = validStr(name, "Name");
    description = validStr(description, "Description");
    actualPrice = validNumber(actualPrice, "Actual Price");
    discountedPrice = validNumber(actualPrice, "Actual Price");
    couponId = validStr(couponId, "Coupon ID");
    categoryId = validStr(categoryId, "Category ID");
    vendorId = validStr(couponId, "Coupon ID");
    quantity = validNumber(quantity, "Quantity");
  } catch (e) {
    throw e;
  };
  const productsCollection = await products();
  let addP = {
    name: name,
    description: description,
    actualPrice: actualPrice,
    discountedPrice: discountedPrice,
    couponId: couponId,
    categoryId: categoryId,
    vendorId: vendorId,
    quantity: quantity,
    image: image,
    status: status,
    images: images,
    reviews: []
  };
  const insertInfo = await productsCollection.insertOne(addP);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add product to DB";
  const newId = insertInfo.insertedId.toString();
  return newId;
}

const getAllProducts = async () => {
  let allProducts;
  try {
    const productsCollection = await products();
    allProducts = await productsCollection.find({}).toArray();
  } 
  catch (e) {
    throw e;
  }
  return allProducts;
};
const getProductById = async (id) => {
  try {
    id = validId(id, "productId");
  } catch (e) {
    throw "Error (data/product.js :: getProductById(id)):" + e;
  }

  const productCollection = await products();
  const product = await productCollection.findOne({ _id: new ObjectId(id) });

  if (product === null)
    throw "Error (data/products.js :: getProductById(id)): No user found";

  product._id = product._id.toString();
  return product;
}

const deleteProductById = async (id) => {
  try {
    id = validId(id, "productId");
  } catch (e) {
    throw "Error (data/product.js :: getProductById(id)):" + e;
  }

  const productCollection = await products();
  const removalInfo = await productCollection.findOneAndDelete({ _id: new ObjectId(id) });
  if(!removalInfo) throw "Could not delete product from DB"
  return "Product deleted!"
}
const addToCart = async (userId,productId,quantity) => {
  let user;
  let product;
  
  try{
    if(!userId || !productId || !quantity){
      throw "Error: Necessary inputs not provided"
    }
    userId = validId(userId, "User ID")
    productId = validId(productId, "Product ID")
    quantity = validNumber(quantity, "Quantity")
    user = await getUserById(userId);
    product = await getProductById(productId);
    const usersCollection = await users()
    if(!user.cart){

      user.cart = [{product:product,quantity:quantity, pos:1}]
    }else{
      user.cart = [...user.cart,{product:product,quantity:quantity, pos:user.cart.length}]
    }
    delete user._id
    const updateInfo = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: user },
      { returnDocument: "after" }
    );
    if (updateInfo.lastErrorObject.n === 0) throw "Error: Update failed";
    let finalUser = await updateInfo.value;
    finalUser._id = finalUser._id.toString();
    return finalUser;
  }catch(e){
    throw e
  }
}
const removeFromCart = async (userId,pos) => {
  let user;
  console.log(userId,pos)
  
  try {
    if(userId == undefined || pos == undefined){
      throw "Error: Necessary inputs not provided"
    }
    userId = validId(userId, "User ID")
    pos = validNumber(pos, "Position")
    user = await getUserById(userId)
    const usersCollection = await users()
    if(pos > user.cart.length){
      throw "Position not within range"
    }
    console.log(userId,pos)
    user.cart.splice(pos,1)
    for(let i = 0; i < user.cart.length; i++){
      user.cart.pos = i + 1
    }
    delete user._id
    const updateInfo = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: user },
      { returnDocument: "after" }
    );
    if (updateInfo.lastErrorObject.n === 0) throw "Error: Update failed";
    let finalUser = await updateInfo.value;
    finalUser._id = finalUser._id.toString();
    return finalUser;

  } catch (error) {
    throw error
  }
}
const addReview = async (productId, stars, text, userId) => {
  let user;
  let product;
  
  
  try {
    if(!productId || !stars || !userId){
      throw "Error: Necessary inputs not provided"
    }
    productId = validId(productId,"Product ID");
    stars = validNumber(stars, "Star Rating");
    if(text){
      text = validStr(text, "Review Text");
    }else{
      text = ""
    }
    userId = validId(userId,"User ID")
    user = await getUserById(userId);
    product = await getProductById(productId);
    product.reviews.push(
      {
        user: user.firstName,
        stars: stars,
        text: text,
        time: new Date()
      }
    )
    await updateProduct(productId,product.name,product.description, product.image, product.images, product.quantity,product.actualPrice,product.discountedPrice,product.categoryId,product.vendorId,product.couponId,product.status,product.reviews);
    return "Product Updated!"
  } catch (error) {
    throw error
  }

}
const updateProduct = async (
  productId,
  name,
  description,
  image,
  images,
  quantity,
  actualPrice,
  discountedPrice,
  categoryId,
  vendorId,
  couponId,
  status,
  reviews
) => {
  if (
    !productId || !name || !description || !actualPrice || !discountedPrice || !categoryId || !quantity || !couponId || !vendorId || !reviews
  ) {
    throw "Error: Some necessary inputs not provided";
  };
  if (!image) {
    image = "/public/images/No_Image_Available.jpg";
  } else {
    image = validImageUrl(image);
  };
  if (!status) {
    status = "active";
  } else {
    status = validStr(status, "Status");
    if (status !== 'active' && status !== 'inactive'){
      throw "Invalid status value";
    }
  };
  if (!images){
    images = [];
  } else {
    try {
      images = images.map(a => validImageUrl(a));
    } catch (e) {
      throw e;
    }
  };
  try {
    productId = validId(productId, "Product Id")
    name = validStr(name, "Name");
    description = validStr(description, "Description");
    actualPrice = validNumber(actualPrice, "Actual Price");
    discountedPrice = validNumber(actualPrice, "Actual Price");
    couponId = validStr(couponId, "Coupon ID");
    categoryId = validStr(categoryId, "Category ID");
    vendorId = validStr(couponId, "Coupon ID");
    quantity = validNumber(quantity, "Quantity");
  } catch (e) {
    throw e;
  };
  const productsCollection = await products();
  const updateInfo = await productsCollection.findOneAndUpdate({_id: new ObjectId(productId)}, {$set: 
    {name: name,
    description: description,
    actualPrice: actualPrice,
    discountedPrice: discountedPrice,
    couponId: couponId,
    categoryId: categoryId,
    vendorId: vendorId,
    quantity: quantity,
    image: image,
    status: status,
    images: images,
    reviews:  reviews
      }
  })
  if(!updateInfo) throw "Could not update product in DB"
  return "Success!"
}
export {createProduct, getAllProducts, getProductById, deleteProductById,  addReview, addToCart, removeFromCart};

//man i dont know js

import { products } from "../config/mongoCollections.js";
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
    quantity = validInt(quantity, "Quantity");
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
    images: images
  };
  const insertInfo = await productsCollection.insertOne(addP);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add product to DB";
  const newId = insertInfo.insertedId.toString();
  return newId;
}
  //mongoshit

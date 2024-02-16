//man i dont know js

import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

const createProduct = async (
  name,
  description,
  image,
  couponId,
  images,
  actualPrice,
  discountedPrice,
  clinicId,
  packageCategoryId,
  status,
  ratingCount, 
) => {
  if (
    !name || !description || !actualPrice || !discountedPrice || !clinicId || !packageCategoryId
  ) {
    throw "Error: Some necessary inputs not provided";
  }

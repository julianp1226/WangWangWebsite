//man i dont know js

import { users } from "../config/mongoCollections.js";
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
    !name || !description || !actualPrice || !discountedPrice || !categoryId || !quantity || !couponId
  ) {
    throw "Error: Some necessary inputs not provided";
  };
  if (!image) {
    image = "/public/images/No_Image_Available.jpg";
  } else {
    image = validImageUrl(image);
  };
  //do more for optional args
  try {
    name = validStr(name, "Name");
    description = validStr(description, "Description");
    actualPrice = validNumber(actualPrice, "Actual Price");
    discountedPrice = validNumber(actualPrice, "Actual Price");
    clinicId = validStr(clinicId, "Clinic ID");
    packageCategoryId = validStr(packageCategoryId, "Package Category ID");
  }
  //mongoshit

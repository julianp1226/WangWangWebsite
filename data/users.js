import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import 'dotenv/config'

import {
  validId,
  validStr,
  validTime,
  validTimeInRange,
  validEmail,
  validImageUrl,
  checkPassword,
  validBool,
  validEmailOptional,
  validStrOptional,
  validMobile,
  validCountryCode,
  validInterests
} from "../validation.js";

import Stripe from 'stripe';
//TODO: Put secret key in .env (test key from personal stripe account, so doesn't matter too much rn)
let stripe = new Stripe(process.env.STRIPE_SECRET);

//TODO: Remove password from schema once proper authentication method is sortedt
//Creating User via app
const createUser = async (
  firstName,
  lastName,
  bio,
  interests,
  email,
  countryCode,
  mobile,
  profilePic,
  password
  //owner,
) => {
  if (
    !firstName ||
    !lastName ||
    !mobile ||
    !password
  ) {
    throw "Error: Missing required input";
  }
  // if (owner === null) {
  //   throw "Error: owner must be provided";
  // }
  if (!profilePic) {
    profilePic = "/public/images/No_Image_Available.jpg";
  } else {
    profilePic = validImageUrl(profilePic);
  }
  let stripeCustomer;
  try {
    firstName = validStr(firstName, "First name");
    lastName = validStr(lastName, "Last name");
    email = validEmailOptional(email);
    password = checkPassword(password);
    interests = validInterests(interests);
    countryCode = validCountryCode(countryCode);
    mobile = validMobile(mobile);
    stripeCustomer = await stripe.customers.create({
      name: firstName + " " + lastName,
      email: email,
      phone: "+" + countryCode + mobile
    })
  } catch (e) {
    throw e;
  }
  // if (typeof owner !== "boolean") {
  //   throw "Error: owner must be of type boolean";
  // }
  let addUser = {
    accessToken: "",
    deviceToken: "",
    firstName: firstName,
    lastName: lastName,
    bio: bio,
    interests: interests,
    email: email.toLowerCase(),
    countryCode: countryCode,
    mobile: mobile,
    deletedEmail: "",
    deletedMobile: "",
    status: "active",
    role: "user",
    profilePic: profilePic,
   // owner: false,
    deviceType: "ios",
    authType: "app",
    isNotification: true,
    stripeCustomerId: stripeCustomer.id, //TODO: Figure out how to generate customers with StripeAPI & store resulting id here
    creationDate: new Date(),
    insertDate: Math.round(new Date()/1000),
    lastUpdatedAt: Math.round(new Date()/1000),
    password: bcrypt.hashSync(password, 10)
  };
  const usersCollection = await users();
  //check email doesn't exist (only run if email is provided)
  if(email!==""){
    const checkEmail = await usersCollection.findOne({
      email: new RegExp("^" + email.toLowerCase(), "i"),
    });
    if (checkEmail !== null) {
      throw "Error: this email is already associated with an account.";
    }
  }
  let checkPhone = await usersCollection.findOne({
    countryCode: countryCode,
    mobile: mobile
  });
  if (checkPhone !== null /*&& (!checkPhone._id || checkPhone._id.toString() !== id)*/) {
    throw "Error: this phone number is already associated with an account.";
  }
  const insertInfo = await usersCollection.insertOne(addUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add user";

  const newId = insertInfo.insertedId.toString();

  const user = await getUserById(newId);
  return user;
};

const getUserById = async (id) => {
  try {
    id = validId(id, "userId");
  } catch (e) {
    throw "Error (data/users.js :: getUserById(id)):" + e;
  }

  const usersCollection = await users();
  const user = await usersCollection.findOne({ _id: new ObjectId(id) });

  if (user === null)
    throw "Error (data/users.js :: getUserById(id)): No user found";

  user._id = user._id.toString();
  return user;
};

// returns array of objects of all the people with that name
const getUserByName = async (firstname, lastname) => {
  try {
    firstname = validStr(firstname);
    lastname = validStr(lastname);
  } catch (e) {
    throw e;
  }
  const usersCollection = await users();
  // case insensitive search
  const user = await usersCollection
    .find({
      firstName: { $regex: new RegExp("^" + firstname, "i") },
      lastName: { $regex: new RegExp("^" + lastname, "i") },
    })
    .toArray();
  if (user.length === 0) throw "No user with that name";
  for (let i = 0; i < user.length; i++) {
    user[i]._id = user[i]._id.toString();
  }
  return user;
};

const getAllUsers = async () => {
  let allUsers;
  try {
    const usersCollection = await users();
    allUsers = await usersCollection.find({}).toArray();
  } 
  catch (e) {
    throw e;
  }
  return allUsers;
};

// does not update password
const updateUser = async (
  id,
  firstName,
  lastName,
  bio,
  interests,
  email,
  countryCode,
  mobile,
  profilePic,
  isNotification
) => {
  try{
    id = validId(id)
  }
  catch(e){
    throw e
  }
  let user = await getUserById(id);
  let authType = user.authType;
  if (
    !firstName ||
    !lastName ||
    //Mobile required if authenticated using app.
    (!mobile && authType === "app") /*||
    !isNotification*/
  ) {
    throw "Error: Missing required input";
  }
  /*if (owner === null) {
    throw "Error: owner must be provided";
  }*/
  if (!profilePic) {
    profilePic = "/public/images/No_Image_Available.jpg";
  } else {
    profilePic = validImageUrl(profilePic);
  }
  let stripeCustomer
  const usersCollection = await users();
  try {
    firstName = validStr(firstName);
    lastName = validStr(lastName);
    email = validEmailOptional(email);
    //check email doesn't exist (only run if email is provided)
    if(email!==""){
      let checkEmail = await usersCollection.findOne({
        _id: {$ne: new ObjectId(id)},
        email: email,
      });
      //console.log(checkEmail._id)
      if (checkEmail !== null /*&& (!checkEmail._id || checkEmail._id.toString() !== id)*/) {
        throw "Error: this email is already associated with an account.";
      }
    }
    bio = validStrOptional(bio, "Bio")
    isNotification = validBool(isNotification, "isNotification")

    if(authType === "app"){
      mobile = validMobile(mobile);
      countryCode = validCountryCode(countryCode)
    }
    if(mobile!=="" || countryCode!==""){
      if(mobile!== "" && countryCode !== ""){
        let checkPhone = await usersCollection.findOne({
          _id: {$ne: new ObjectId(id)},
          countryCode: countryCode,
          mobile: mobile
        });
        if (checkPhone !== null /*&& (!checkPhone._id || checkPhone._id.toString() !== id)*/) {
          throw "Error: this phone number is already associated with an account.";
        }
      }
      else{
        throw "Error: country code & mobile must both be provided or blank"
      }
    }
    stripeCustomer = await stripe.customers.update(user.stripeCustomerId, {
      name: firstName + " " + lastName,
      email: email,
      phone: "+" + countryCode + mobile
    })
  } catch (e) {
    throw e;
  }
 
  /*if (typeof owner !== "boolean") {
    if (typeof owner === "string") {
      if (owner === "true") {
        owner = true;
      } else if (owner === "false") {
        owner = false;
      } else {
        throw "Error: owner must be of type boolean"
      }
    } else {
      throw "Error: owner must be of type boolean";
    }
  }*/
  let updatedUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    bio: bio,
    interests: interests,
    countryCode: countryCode,
    mobile: mobile,
    profilePic: profilePic,
    isNotification: isNotification,
    lastUpdatedAt: Math.round(new Date()/1000)
  };
  const updateInfo = await usersCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updatedUser },
    { returnDocument: "after" }
  );
  if (updateInfo.lastErrorObject.n === 0) throw "Error: Update failed";

  let finalUser = await updateInfo.value;
  finalUser._id = finalUser._id.toString();
  return finalUser;
};

/*const checkUser = async (email, password) => {
  try {
    email = validStr(email, "email").toLowerCase();
    validStr(password, "password", 8);
  } catch (e) {
    throw "Error: " + e;
  }
  if (
    !/^[a-z0-9]+([._\-][a-z0-9]+)*@[a-z0-9]+(-[a-z0-9]+)*[a-z0-9]*\.[a-z0-9]+[a-z0-9]+$/.test(
      email
    ) ||
    email.length > 320
  )
    throw "Error: Invalid email address.";

  let passUpper = false;
  let passNumber = false;
  let passSpecial = false;
  for (let i of password) {
    if (i == " ") throw "Error: password must not contain spaces";
    if (/[A-Z]/.test(i)) passUpper = true;
    else if (/[0-9]/.test(i)) passNumber = true;
    else if (/[!@#$%^&*\(\)-_+=\[\]\{\}\\\|;:'",<.>\/?]/.test(i))
      passSpecial = true;
    else if (!/[a-z]/.test(i))
      throw "Error: password contains invalid characters";
  }
  if (!passUpper || !passNumber || !passSpecial)
    throw "Error: password must contain an uppercase character, number, and special character";

  const usersCollection = await users();
  let user;
  try {
    user = await usersCollection.findOne({ email: email });
  } catch (e) {
    throw "Error: " + e;
  }
  if (user === null) throw "Either the email address or password is invalid";

  let match = await bcrypt.compareSync(password, user.password);
  if (!match) throw "Either the email address or password is invalid";

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    //owner: user.owner,
    id: user._id.toString(),
  };
};*/

const checkUser = async (countryCode, mobile, password) => {
  try{
    countryCode = validCountryCode(countryCode)
    mobile = validMobile(mobile)
    password = checkPassword(password)
  }
  catch(e){
    throw e
  }

  /*let passUpper = false;
  let passNumber = false;
  let passSpecial = false;
  for (let i of password) {
    if (i == " ") throw "Error: password must not contain spaces";
    if (/[A-Z]/.test(i)) passUpper = true;
    else if (/[0-9]/.test(i)) passNumber = true;
    else if (/[!@#$%^&*\(\)-_+=\[\]\{\}\\\|;:'",<.>\/?]/.test(i))
      passSpecial = true;
    else if (!/[a-z]/.test(i))
      throw "Error: password contains invalid characters";
  }
  if (!passUpper || !passNumber || !passSpecial)
    throw "Error: password must contain an uppercase character, number, and special character";*/

  const usersCollection = await users();
  let user;
  try {
    user = await usersCollection.findOne({ countryCode: countryCode, mobile: mobile });
  } catch (e) {
    throw "Error: " + e;
  }
  if (user === null) throw "Either the phone number or password is invalid";

  let match = await bcrypt.compareSync(password, user.password);
  if (!match) throw "Either the phone number or password is invalid";

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    //owner: user.owner,
    id: user._id.toString(),
  };
};

/*const addReportedByUser = async (userId, writtenByUsername, writtenAboutId, reason) => {
  //userId reported it
  console.log("DATA REPORTING");
  let user, by, about;
  try {
    user = await getUserById(userId);
    by = await getUserByUsername(writtenByUsername);
    about = await getUserById(writtenAboutId);
    reason = validStr(reason, "reason");
  }
  catch (e)
  {
    throw e;
  }
  if (by._id == user._id)
  {
    throw "Error: cannot report your own review";
  }
  
  let buildReportedArray = user.report;
  for (let i=0; i<buildReportedArray.length;i++)
  {
    if (buildReportedArray[i].reviewer.localeCompare(by.username) == 0 &&
    buildReportedArray[i].reviewee.localeCompare(about.username) == 0)
    {
      throw "Error: Already reported this review";
    }
  }
  //data stored in user (reported by)
  let buildObjToPush =
  {
    reviewer: by.username,
    reviewee: about.username,//who the review is about
    reason: reason
  };
  buildReportedArray.push(buildObjToPush);

  const usersCollection = await users();

  const updateInfo = await usersCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: {report: buildReportedArray} },
    { returnDocument: "after" }
  );
  if (updateInfo.lastErrorObject.n === 0) throw "Error: Update failed";

  return buildReportedArray;
};*/

export {
  createUser,
  getUserById,
  getAllUsers,
  getUserByName,
  updateUser,
  checkUser,
};

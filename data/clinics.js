import { clinics } from "../config/mongoCollections.js";
import {getClinicSpecialisationById} from "../data/clinicSpecialisations.js"
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
  checkPassword,
  validAddress,
  validClinicStatus
} from "../validation.js";

const createClinic = async (
  accessToken, 
  email = undefined, 
  password = undefined, 
  role = "clinic",
  name = undefined, 
  description = "", 
  image = "", 
  price = undefined, 
  clinicSpecialisationIds = [], 
  status = "active",
  ratingCount = 0, 
  avgRating = 0, 
  timeZone = "", 
  startDate = 0, 
  endDate = 0, 
  scheduledTiming = [], 
  dayoff = [], 
  openingTime = "", 
  closingTime = "", 
  sessionBreak = 0, 
  slotTime = 0, 
  slotBreak = 0, 
  address = "", 
  locationPoint = undefined, 
  location = { lat: 0, lng: 0 }, 
  timing = [], 
  isDateRangeInfinite = false, 
  isProfileBasic = false, 
  isClinicTiming = false,
  areBankDetailsSubmitted = false,
  isStripeIntegrated = false,
  isPasswordChange = false,
  isApplyCancelled = false,
  stripeConnAccId = "", 
  insertDate = Math.round(new Date() / 1000)
  ) => {
  if (email === undefined) {
      /*console.error("Email is required!");
      return;*/
      throw "Error: Email is required! (data/clinics.js)";
  }
  if (password === undefined) {
      /*console.error("Password is required!");
      return;*/
      throw "Error: Password is required! (data/clinics.js)";
  }
  if (name === undefined) {
      /*console.error("Name is required!");
      return;*/
      throw "Error: Name is required! (data/clinics.js)";
  }
  if (price === undefined) {
      /*console.error("Price is required!");
      return;*/
      throw "Error: Price is required! (data/clinics.js)";
  }
  if (locationPoint === undefined) {
      /*console.error("LocationPoint is required!");
      return;*/
      throw "Error: Location Point is required! (data/clinics.js)";
  }
  /*if (status != "active" && status != "inactive") {
    console.error("Invalid status");
    return;
  }*/

  if (!image) {
    image = "/public/images/No_Image_Available.jpg";
  } else {
    image = validImageUrl(image);
  }

  try {
    email = validEmail(email);
    password = checkPassword(password);

    name = validStr(name);
    price = validNumber(price);
    ratingCount = validNumber(ratingCount);
    avgRating = validNumber(avgRating);
    status = validClinicStatus(status);
    
    startDate = validNumber(startDate);
    endDate = validNumber(endDate);
    sessionBreak = validNumber(sessionBreak);
    slotTime = validNumber(slotTime);
    slotBreak = validNumber(slotBreak);
    timeZone = validStr(timeZone);
    openingTime = validStr(openingTime);
    closingTime = validStr(closingTime);

    address = validStr(address);
    stripeConnAccId = validStr(stripeConnAccId);

    if (!Array.isArray(clinicSpecialisationIds)) {
      throw new Error("clinicSpecialisationIds must be an array!");
    }
    clinicSpecialisationIds.forEach(id => {
      try{
        id = validId(id);
        //Make sure each provided Id is actually a clinicSpecialisation
        getClinicSpecialisationById(id)
      } catch(e){
        throw e
      }
    });

    if (!Array.isArray(scheduledTiming)) {
        throw new Error("scheduledTiming must be an array!");
    }
    if (!Array.isArray(dayoff)) {
        throw new Error("dayoff must be an array!");
    }
    if (!Array.isArray(timing)) {
        throw new Error("timing must be an array!");
    }
  } catch (e) {
    throw e;
  }

  
  const createClinic = {
  accessToken: accessToken,
  email: email.toLowerCase(),
  password: bcrypt.hashSync(password, 10),
  role: role,
  name: name,
  description: description,
  image: image,
  price: price,
  clinicSpecialisationIds: clinicSpecialisationIds,
  status: status,
  ratingCount: ratingCount,
  avgRating: avgRating,
  timeZone: timeZone,
  startDate: startDate,
  endDate: endDate,
  scheduledTiming: scheduledTiming,
  dayoff: dayoff,
  openingTime: openingTime,
  closingTime: closingTime,
  sessionBreak: sessionBreak,
  slotTime: slotTime,
  slotBreak: slotBreak,
  address: address,
  locationPoint: locationPoint,
  location: location,
  timing: timing,
  isDateRangeInfinite: isDateRangeInfinite,
  isProfileBasic: isProfileBasic,
  isClinicTiming: isClinicTiming,
  areBankDetailsSubmitted: areBankDetailsSubmitted,
  isStripeIntegrated: isStripeIntegrated,
  isPasswordChange: isPasswordChange,
  isApplyCancelled: isApplyCancelled,
  stripeConnAccId: stripeConnAccId,
  insertDate: insertDate
};

  const clinicsCollection = await clinics();
  //check email doesn't exist
  const checkEmail = await clinicsCollection.findOne({
    email: new RegExp("^" + email.toLowerCase(), "i"),
  });
  if (checkEmail !== null) {
    throw "Error: this email is already associated with an clinic.";
  }
  const insertInfo = await clinicsCollection.insertOne(createClinic);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add clinic";

  const newId = insertInfo.insertedId.toString();

  const clinic = await getClinicById(newId);
  return clinic;
};

const getClinicById = async (id) => {
  try {
    id = validId(id, "clinicId");
  } catch (e) {
    throw "Error (data/clinics.js :: getClinicById(id)):" + e;
  }

  const clinicsCollection = await clinics();
  const clinic = await clinicsCollection.findOne({ _id: new ObjectId(id) });

  if (clinic === null)
    throw "Error (data/users.js :: getUserById(id)): No user found";

  clinic._id = clinic._id.toString();
  return clinic;
};


const getAllClinics = async () => {
  let allClinics;
  try {
    const ClinicsCollection = await users();
    allClinics = await ClinicsCollection.find({}).toArray();
  } 
  catch (e) {
    throw "Error (data/clinics.js :: getAllClinics()):" + e;
  }
  return allClinics;
};

//TODO: Test function
const addReview = async (id, rating) => {
  try{
    id = validId(id)
    let clinic = await getClinicById(id)
    let newCount = clinic.ratingCount + 1
    let newReview = {
      ratingCount: newCount,
      avgRating: (clinic.avgRating * clinic.ratingCount + rating)/newCount
    }

    const clinicsCollection = await clinics();
    const updateInfo = await clinicsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: newReview },
      { returnDocument: "after" }
    );
    if (updateInfo.lastErrorObject.n === 0) throw "Error: Review unable to be added";
  
    let finalClinic = await updateInfo.value;
    finalClinic._id = finalClinic._id.toString();
    return finalClinic;
  } catch(e){
    throw "Error (data/clinics.js :: addReview()):" + e;
  }
}

/*const clinic = await createClinic(
  "sampleAccessToken",
  "example@example.com",
  "samplePassword1!",
  "clinicAdmin",
  "Sample Clinic",
  "", // description
  "", // image
  100,
  [1, 2, 3], // clinicSpecialisationIds
  "active",
  10, // ratingCount
  4.5, // avgRating
  "UTC+0", // timeZone
  1645276800, // startDate (February 19, 2022)
  1676812800, // endDate (February 19, 2023)
  ["Monday", "Wednesday", "Friday"], // scheduledTiming
  ["Saturday", "Sunday"], // dayoff
  "08:00 AM", // openingTime
  "06:00 PM", // closingTime
  15, // sessionBreak
  30, // slotTime
  5, // slotBreak
  "123 Sample Street", // address
  7, // locationPoint
  { lat: 40.7128, lng: -74.0060 }, // location
  ["Morning", "Afternoon"], // timing
  false, // isDateRangeInfinite
  true, // isProfileBasic
  true, // isClinicTiming
  false, // areBankDetailsSubmitted
  false, // isStripeIntegrated
  false, // isPasswordChange
  false, // isApplyCancelled
  "sampleStripeAccountId" // stripeConnAccId
);
console.log(clinic)*/

//write some kind of update fun

export {
  createClinic,
  getClinicById,
  getAllClinics
};
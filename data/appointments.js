import { appointments, clinics } from "../config/mongoCollections.js";
//import {getClinicSpecialisationById} from "../data/clinicSpecialisations.js" - not sure if this one is needed for appointments
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { getClinicById } from "./clinics.js";
import { getUserById } from "./users.js";

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
  validClinicStatus,
  validBool,
  validDate
} from "../validation.js";

/*
const bookingSchema = new mongoose.Schema({
  userId: { type: String },
  clinicId: { type: String },
  startDateEpoch: { type: Number },
  endDateEpoch: { type: Number },
  previousStartDate: { type: Number, default: 0 },
  previousEndDate: { type: Number, default: 0 },
  couponId: { type: String, default: "" },
  amount: { type: Number },
  taxesAndFees: { type: Number },
  grandTotal: { type: Number },
  paymentType: { type: String, enum: ["POD", "paidOnline", "card"] },
  paymentStatus: { type: String, default: "pending" },
  paymentId: { type: String, default: "" },
  cardDetails: { type: Object, default: {} },
  status: { type: String, enum: ["scheduled", "rescheduled", "ongoing", "completed", "cancelled"], default: "scheduled" },
  is1hrSent: { type: Boolean, default: false},
  is24hrSent: { type: Boolean, default: false},
  insertDate: {
    type: Number,
    default: () => {
      return Math.round(new Date() / 1000);
    },
  },
  lastUpdatedAt: {
    type: Number,
    default: () => {
      return Math.round(new Date() / 1000);
    },
  },
});
*/


const addBooking = async (
  userId, 
  clinicId, 
  startDate, 
  endDate, 
  previousStartDate = 0, 
  previousEndDate = 0, 
  couponId = "", 
  amount, 
  taxesAndFees, 
  grandTotal, 
  paymentType, 
  paymentStatus = "pending", 
  paymentId = "", 
  cardDetails = {}, 
  status = "scheduled", 
  is1hrSent = false, 
  is24hrSent = false
) => {
  if(!userId || !clinicId || !startDate || !endDate || !amount || !taxesAndFees || !grandTotal || !paymentType) throw "Not all necessary fields provided";
  let clinicData;
  let userData;
  try {
    userId = validId(userId, "User ID");
    clinicId = validId(clinicId, "Clinic ID");
    startDate = validNumber(startDate, "Start Date");
    endDate = validNumber(endDate, "End Date");
    previousStartDate = validNumber(previousStartDate, "Previous Start Date");
    previousEndDate = validNumber(previousEndDate, "Previous End Date");
    couponId = !(couponId === "") ? validStr(couponId, "Coupon ID") : couponId;
    amount = validNumber(amount, "Amount");
    taxesAndFees = validNumber(taxesAndFees, "Taxes and Fees");
    grandTotal = validNumber(grandTotal, "Grand Total");
    paymentType = validStr(paymentType, "Payment Type");
    paymentId = !(paymentId === "") ? validStr(paymentId, "Coupon ID") : paymentId;
    status = validStr(status);
    is1hrSent = validBool(is1hrSent);
    is24hrSent = validBool(is24hrSent);
  } catch (e) {
    throw "Error (data/appointments.js :: addBooking): " + e
  };
  try {
    clinicData = getClinicById(clinicId);
  } catch (e) {
    throw "Error (data/appointments.js :: addBooking): Clinic is invalid"
  };
  try {
    userData = getUserById(userId);
  } catch (e) {
    throw "Error (data/appointments.js :: addBooking): User is invalid"
  };
  if(!["POD", "paidOnline", "card"].includes(paymentType)) throw "Error (data/appointments.js :: addBooking): Payment Type is invalid";
  if(!["scheduled", "rescheduled", "ongoing", "completed", "cancelled"].includes(status)) throw "Error (data/appointments.js :: addBooking): Status is invalid";
  let bookings = await appointments();
  //find appointments somehow which conflict
  let appointmentObj = {
    userId: userId,
    clinicId: clinicId,
    startDateEpoch: startDate,
    endDateEpoch: endDate,
    previousStartDate: previousStartDate,
    previousEndDate: previousEndDate,
    couponId: couponId,
    amount: amount,
    taxesAndFees: taxesAndFees,
    grandTotal: grandTotal,
    paymentType: paymentType,
    paymentStatus: paymentStatus,
    paymentId: paymentId,
    cardDetails: cardDetails,
    status: status,
    is1hrSent: is1hrSent,
    is24hrSent: is24hrSent
  };
  const insertInfo = await bookings.insertOne(appointmentObj);
  if(!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add appointment";

  const newId = insertInfo.insertedId.toString();

  const appointment = await getBookingById(newId);
  return appointment;
};

const getBookingById = async (id) => {
  try {
    id = validId(id, "Appointment ID");
  } catch (e) {
    throw "Error (data/clinics.js :: getClinicById(id)):" + e;
  }

  const bookings = await appointments();
  const appointment = await bookings.findOne({ _id: new ObjectId(id) });

  if (appointment === null)
    throw "Error (data/clinics.js :: getClinicById(id)): No appointment found";

  appointment._id = appointment._id.toString();
  return appointment;
};

const deleteBookingById = async (id) => {
  try {
    id = validId(id, "Appointment ID");
  } catch (e) {
    throw "Error (data/product.js :: deleteBookingById(id)):" + e;
  }

  const bookings = await appointments();
  const removalInfo = await appointments.findOneAndDelete({ _id: new ObjectId(id) });
  if(!removalInfo) throw "Could not delete appointment from DB"
  return "Appointment deleted!"
};

const updateBooking = async (
  appointmentId,
  userId, 
  clinicId, 
  startDate, 
  endDate, 
  previousStartDate = 0, 
  previousEndDate = 0, 
  couponId = "", 
  amount, 
  taxesAndFees, 
  grandTotal, 
  paymentType, 
  paymentStatus = "pending", 
  paymentId = "", 
  cardDetails = {}, 
  status = "scheduled", 
  is1hrSent = false, 
  is24hrSent = false
) => {
  if(!appointmentId || !userId || !clinicId || !startDate || !endDate || !amount || !taxesAndFees || !grandTotal || !paymentType) throw "Not all necessary fields provided";
  let clinicData;
  let userData;
  let appointmentData;
  try {
    appointmentId = validId(appointmentId, "Appointment ID");
    userId = validId(userId, "User ID");
    clinicId = validId(clinicId, "Clinic ID");
    startDate = validNumber(startDate, "Start Date");
    endDate = validNumber(endDate, "End Date");
    previousStartDate = validNumber(previousStartDate, "Previous Start Date");
    previousEndDate = validNumber(previousEndDate, "Previous End Date");
    couponId = !(couponId === "") ? validStr(couponId, "Coupon ID") : couponId;
    amount = validNumber(amount, "Amount");
    taxesAndFees = validNumber(taxesAndFees, "Taxes and Fees");
    grandTotal = validNumber(grandTotal, "Grand Total");
    paymentType = validStr(paymentType, "Payment Type");
    paymentId = !(paymentId === "") ? validStr(paymentId, "Coupon ID") : paymentId;
    status = validStr(status);
    is1hrSent = validBool(is1hrSent);
    is24hrSent = validBool(is24hrSent);
  } catch (e) {
    throw "Error (data/appointments.js :: addBooking): " + e
  };
  try {
    clinicData = getClinicById(clinicId);
  } catch (e) {
    throw "Error (data/appointments.js :: addBooking): Clinic is invalid"
  };
  try {
    userData = getUserById(userId);
  } catch (e) {
    throw "Error (data/appointments.js :: addBooking): User is invalid"
  };
  try {
    appointmentData = getBookingById(appointmentId);
  } catch (e) {
    throw "Error (data/appointments.js :: addBooking): User is invalid"
  };
  if(!["POD", "paidOnline", "card"].includes(paymentType)) throw "Error (data/appointments.js :: addBooking): Payment Type is invalid";
  if(!["scheduled", "rescheduled", "ongoing", "completed", "cancelled"].includes(status)) throw "Error (data/appointments.js :: addBooking): Status is invalid";
  let bookings = await appointments();
  //find appointments somehow which conflict
  let appointmentObj = {
    userId: userId,
    clinicId: clinicId,
    startDateEpoch: startDate,
    endDateEpoch: endDate,
    previousStartDate: previousStartDate,
    previousEndDate: previousEndDate,
    couponId: couponId,
    amount: amount,
    taxesAndFees: taxesAndFees,
    grandTotal: grandTotal,
    paymentType: paymentType,
    paymentStatus: paymentStatus,
    paymentId: paymentId,
    cardDetails: cardDetails,
    status: status,
    is1hrSent: is1hrSent,
    is24hrSent: is24hrSent
  };
  
  const updateInfo = await bookings.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: appointmentObj },
    { returnDocument: "after" }
  );
  if (updateInfo.lastErrorObject.n === 0) throw "Error: Update failed";

  let finalBooking = await updateInfo.value;
  finalBooking._id = finalBooking._id.toString();
  return finalBooking;
};

export {
  addBooking,
  updateBooking,
  getBookingById,
  deleteBookingById
};

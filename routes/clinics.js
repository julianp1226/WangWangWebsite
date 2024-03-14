import { Router } from "express";
const router = Router();
import multer from "multer";
import { ObjectId } from "mongodb";
import {
    createClinic
} from "../data/clinics.js";
import {
    createClinicSpecialisation
} from "../data/clinicSpecialisations.js";

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
);*/



router.route("/testClinic").get(async (req, res) => {

})

router.route("/testClinicSpecial").get(async (req, res) => {
    try{
        const special = await createClinicSpecialisation("Oral Care")
        return res.render("Error", {error: "No error, just don't want to make new HTML for a test page", auth:true, status:200})
    } catch(e){
        console.log(e)
        return res
        .status(400)
        .render("error", { error: e, auth: true, status: 400 });
    }
})

export default router;
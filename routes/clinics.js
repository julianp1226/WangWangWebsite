import { Router } from "express";
const router = Router();
import multer from "multer";
import { ObjectId } from "mongodb";
import {
    createClinic,
    getAllClinics,
    getClinicById
} from "../data/clinics.js";
import {
    createClinicSpecialisation,
    updateClinicSpecialisation
} from "../data/clinicSpecialisations.js";
import {
    validId
  } from "../validation.js";

/*const clinic = await createClinic(
  "sampleAccessToken",
  "example@example.com",
  "samplePassword1!",
  "clinicAdmin",
  "Sample Clinic",
  "", // description
  "", // image
  100,
  [], // clinicSpecialisationIds
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

/*router.route("/testClinic").get(async (req, res) => {
    try{
        const myClinic = await createClinic("sampleAccessToken",
        "example@example.com",
        "samplePassword1!",
        "clinicAdmin",
        "Sample Clinic",
        "", // description
        "", // image
        100,
        ["65f364f093318a81d9e8b35a"], // clinicSpecialisationIds
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
        "sampleStripeAccountId") // stripeConnAccId
        console.log(myClinic)
        return res.render("Error", {error: "No error, just don't want to make new HTML for a test page", auth:true, status:200})
    } catch(e){
        console.log(e)
        return res
        .status(400)
        .render("error", { error: e, auth: true, status: 400 });
    }
})

router.route("/testClinicSpecial").get(async (req, res) => {
    try{
        const special = await createClinicSpecialisation("Oral Care")
        console.log(special)
        return res.render("Error", {error: "No error, just don't want to make new HTML for a test page", auth:true, status:200})
    } catch(e){
        console.log(e)
        return res
        .status(400)
        .render("error", { error: e, auth: true, status: 400 });
    }
})

router.route("/testClinicSpecialU").get(async (req, res) => {
    try{
        const special = await updateClinicSpecialisation("65f364f093318a81d9e8b35a", "Skin Care", undefined, "inactive")
        console.log(special)
        return res.render("Error", {error: "No error, just don't want to make new HTML for a test page", auth:true, status:200})
    } catch(e){
        console.log(e)
        return res
        .status(400)
        .render("error", { error: e, auth: true, status: 400 });
    }
})*/

router.route("/").get(async (req, res) => { 
    let auth = false
    try{
        let clinics = await getAllClinics()
        if (req.session.user) {
            auth = true;
        }
        return res.render("clinics", {
            clinics: clinics,
            auth: auth
        });
    }catch(e){
        return res
        .status(404)
        .render("error", { error: "No clinics found" + e, status: 404});
    }
})

router.route("/:id").get(async (req, res)=> {
    let auth = false
    try{
        let clinicId = validId(req.params.id);
        let clinic = await getClinicById(clinicId)
        if (req.session.user) {
            auth = true;
        }

        let dates = []
        let date = new Date()
        const weekday = ["Sun","Mon","Tue","Wed","Thur","Fri","Sat"];
        const month = ["Jan","Feb","March","April","May","June","July","Aug","Sept","Oct","Nov","Dec"];


        for(let i = 0; i<14; i++){
            dates[i] = {
                day: date.getDate(),
                month: month[date.getMonth()],
                dayOfWeek: weekday[date.getDay()]}
            date.setUTCDate(date.getUTCDate() + 1)
        }

        return res.render("clinic", {
            clinic: clinic,
            auth: auth,
            dates: dates
        });
    }catch(e){
        return res
        .status(404)
        .render("error", { error: "Clinic Not Found" + e, status: 404});
    }
})

export default router;
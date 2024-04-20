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
    validId,
    validTime
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

        //Given schema says openingTime & closingTime can be "", but we can't work with that directly
        let openingTime = clinic.openingTime;
        if(openingTime === ""){
            openingTime = "12:00 AM"
        }

        let closingTime = clinic.closingTime;
        if(closingTime === ""){
            closingTime = "11:59 PM"
        }

        //Extract hours & minutes from time string as military time
        let openingHour = parseInt(openingTime.substring(0, openingTime.indexOf(":")));
        if(openingHour === 12 && openingTime.substring(openingTime.length-2)==="AM"){
            openingHour = 0
        }
        else if(openingHour !== 12 && openingTime.substring(openingTime.length-2)==="PM"){
            openingHour +=12
        }
        let openingMinute = parseInt(openingTime.substring(openingTime.indexOf(":")+1, openingTime.indexOf(":")+3));
        let closingHour = parseInt(closingTime.substring(0, closingTime.indexOf(":")));
        if(closingHour === 12 && closingTime.substring(closingTime.length-2)==="AM"){
            closingHour = 0
        }
        else if(closingHour !== 12 && closingTime.substring(closingTime.length-2)==="PM"){
            closingHour +=12
        }
        let closingMinute = parseInt(closingTime.substring(closingTime.indexOf(":")+1, closingTime.indexOf(":")+3));


        let times = [] //Stores times as object of hours & minutes as military time (closer to how Date stores it by default & makes some calculations easier)
        let displayTimes = [] //To store time as "normal" & be used on buttons (TODO: Fix this, currently just stores military time)
        let timeIndex = 0
        let currentDate = (new Date()).getDate()
        let sameDate = true;
        let beforeClosing = true;
        let closingDate = (new Date())
        closingDate.setHours(closingHour)
        closingDate.setMinutes(closingMinute)

        while(sameDate && beforeClosing){ //Loop goes until we've hit closing time or we roll over until midnight.
            let myDate = new Date()
            myDate.setHours(openingHour)
            myDate.setMinutes(openingMinute + timeIndex*(clinic.slotBreak))
            //myDate.setMinutes(openingMinute + timeIndex*(clinic.slotTime))
            let hours = myDate.getHours()
            let minutes = myDate.getMinutes()
            times[timeIndex] = {hours: hours, minutes: minutes}
            let leadingTime = ""
            let timeSuffix = " A.M."
            if(hours==0){
                hours = 12
            }
            else if(hours>12){
                hours -= 12;
                timeSuffix = " P.M."
            }
            if(hours<10){
                leadingTime = "0"
            }
            let middleDisplayTime = ":"
            if(minutes<10){
                middleDisplayTime =  middleDisplayTime + "0";
            }
            displayTimes[timeIndex] = leadingTime + hours.toString() + middleDisplayTime + minutes.toString() + timeSuffix
            sameDate = (currentDate == myDate.getDate())
            beforeClosing = (myDate.setMinutes(myDate.getMinutes() + clinic.slotTime)<closingDate)
            timeIndex++
        }
        //console.log(displayTimes)


        let dates = []
        let date = new Date()
        const weekday = ["Sun","Mon","Tue","Wed","Thur","Fri","Sat"];
        const month = ["Jan","Feb","March","April","May","June","July","Aug","Sept","Oct","Nov","Dec"];

        let currentDay = date.getDate()

        for(let i = 0; i<14; i++){
            dates[i] = {
                day: date.getDate(),
                month: month[date.getMonth()],
                dayOfWeek: weekday[date.getDay()],
                dayOfWeekNum: date.getDay(),
                year: date.getFullYear()}
            
            date.setUTCDate(date.getUTCDate() + 1)
        }



        return res.render("clinic", {
            clinic: clinic,
            auth: auth,
            dates: dates,
            times: displayTimes
        });
    }catch(e){
        return res
        .status(404)
        .render("error", { error: "Clinic Not Found" + e, status: 404});
    }
})

export default router;
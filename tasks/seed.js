
import { createProduct } from "../data/products.js";
import { createClinic } from "../data/clinics.js";
import {dbConnection, closeConnection} from '../config/mongoConnection.js';
const db = await dbConnection();

await db.dropDatabase();

const images1 = new Array(5).fill("/public/images/GSGImage.png")
const prod1 = await createProduct("Rituals of Sakura", "Lorem Ipsum", "/public/images/ROSImage.png",images1,20, 100.00,80.00,"5","1234","1234","active");
const images2 = new Array(5).fill("/public/images/GSGImage.png")
const prod2 = await createProduct("Glossier Super Glow", "Lorem Ipsum", "/public/images/GSGImage.png",images2,20, 100.00,80.00,"5","1234","1234","active");
const images3 = new Array(5).fill("/public/images/TOImage.png")
const prod3 = await createProduct("The Ordinary", "Lorem Ipsum", "/public/images/TOImage.png",images3,20, 150.25,100.00,"5","1234","1234","active");

const clinic = await createClinic(
  "sampleAccessToken",
  "example@example.com",
  "samplePassword1!",
  "clinicAdmin",
  "Sample Clinic",
  "", // description
  "/public/images/GSGImage.png", // image
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
);

const clinic2 = await createClinic(
    "sampleAccessToken",
    "example2@example.com",
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
  );

  const clinic3 = await createClinic(
    "sampleAccessToken",
    "example3@example.com",
    "samplePassword1!",
    "clinicAdmin",
    "Sample Clinic",
    "", // description
    "/public/images/TOImage.png", // image
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
  );
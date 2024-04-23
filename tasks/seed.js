
import { createProduct } from "../data/products.js";
import { createClinic } from "../data/clinics.js";
import { createUser } from "../data/users.js";
import { createPost } from "../data/posts.js";
import { createComment } from "../data/comments.js";
import { dbConnection, closeConnection } from '../config/mongoConnection.js';
const db = await dbConnection();

await db.dropDatabase();

//USERS
const user1 = await createUser("Julian", "Perez", "I'm a user", [], "jperezco@stevens.edu", "+1", "7328248821", "", "Yankees1226!");
const user2 = await createUser("John", "Smith", "I'm John", [], "", "+1", "7322346721", "", "JohnDoe1996!");

//POSTS 
const post1 = await createPost(user1._id, "post 1", "/public/media/venice.mp4", ["#fun", "#selfcare"], "This product is great!");
const post2 = await createPost(user2._id, "post 2", "/public/media/GSGImage.png", ["#selfcare", "#facial", "product"], "This product is great too");
const post3 = await createPost(user1._id, "post 3", "/public/media/TOImage.png", ["#fun", "#facial"], "Exciting stuff!");
const post4 = await createPost(user2._id, "post 4", "/public/media/GSGImage.png", ["#selfcare", "product"], "Really good product!");
const post5 = await createPost(user1._id, "post 5", "/public/media/TOImage.png", ["#fun", "#facial"], "This product is the best!");
const post6 = await createPost(user2._id, "post 6", "/public/media/GSGImage.png", ["#selfcare", "#facial", "product", "soft"], "This product is great too");

// SHOP
const images1 = new Array(5).fill("/public/images/GSGImage.png")
const prod1 = await createProduct("Rituals of Sakura", "Lorem Ipsum", "/public/images/ROSImage.png", images1, 20, 100.00, 80.00, "5", "1234", "1234", "active");
const images2 = new Array(5).fill("/public/images/GSGImage.png")
const prod2 = await createProduct("Glossier Super Glow", "Lorem Ipsum", "/public/images/GSGImage.png", images2, 20, 100.00, 80.00, "5", "1234", "1234", "active");
const images3 = new Array(5).fill("/public/images/TOImage.png")
const prod3 = await createProduct("The Ordinary", "Lorem Ipsum", "/public/images/TOImage.png", images3, 20, 150.25, 100.00, "5", "1234", "1234", "active");
// CLINICS
const clinic = await createClinic(
  "sampleAccessToken",
  "example@example.com",
  "samplePassword1!",
  "clinicAdmin",
  "Sample Clinic",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar nulla a dui vestibulum volutpat. Nullam turpis quam, consequat non convallis ac, aliquet quis felis. Ut ut molestie massa. Proin eleifend lorem enim, hendrerit rhoncus nisi egestas non. In egestas pulvinar magna nec sodales. Donec lacinia arcu urna, et finibus mi tempus id. Sed vel pretium nulla.", // description
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
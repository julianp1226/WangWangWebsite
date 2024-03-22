
import { createProduct } from "../data/products.js";
import {dbConnection, closeConnection} from '../config/mongoConnection.js';
const db = await dbConnection();

await db.dropDatabase();

const images1 = new Array(5).fill("/public/images/GSGImage.png")
const prod1 = await createProduct("Rituals of Sakura", "Lorem Ipsum", "/public/images/ROSImage.png",images1,20, 100.00,80.00,"5","1234","1234","active");
const images2 = new Array(5).fill("/public/images/GSGImage.png")
const prod2 = await createProduct("Glossier Super Glow", "Lorem Ipsum", "/public/images/GSGImage.png",images2,20, 100.00,80.00,"5","1234","1234","active");
const images3 = new Array(5).fill("/public/images/TOImage.png")
const prod3 = await createProduct("The Ordinary", "Lorem Ipsum", "/public/images/TOImage.png",images3,20, 100.00,80.00,"5","1234","1234","active");
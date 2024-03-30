import { cards } from "../config/mongoCollections.js";

import {
  validId,
  validStr,
  checkCardName,
  validNumber,
  validEmail,
  validDate
} from "../validation.js";

const createCard = async (
    userId= undefined,
    first6Digits= undefined,
    last4Digits= undefined,
    nameOnCard= undefined,
    cardScheme= undefined,
    cardType= undefined,
    expiry= undefined,
    email= undefined,
    cardToken= undefined,
    isDefault= false,
    status= undefined,
    redirectUrl= undefined,
    insertDate = Math.round(new Date() / 1000),
    creationDate= new Date()) => {
    if (userId === undefined) {
        throw "userID is required";
    }
    if (first6Digits === undefined) {
        throw "first6Digits is required!";
    }
    if (last4Digits === undefined) {
        throw "last4Digits is required!";
    }
    if (nameOnCard === undefined) {
        throw "nameOnCard is required";
    }
    if (cardScheme === undefined) {
        throw "CardScheme is required!";
    }
    if (cardType === undefined) {
        throw "CardType is required!";
    }
    if (expiry === undefined) {
        throw "expiry is required";
    }
    if (email === undefined) {
        throw "email is required!";
    }
    if (cardToken === undefined) {
        throw "cardToken is required!";
    }
    if (status === undefined) {
        throw "status is required";
    }
    if (redirectUrl === undefined) {
        throw "redirectUrl is required!";
    }

    try {
        userId = validStr(userId);
    } catch (e) {
        throw e;
    }
    try {
        first6Digits = validStr(first6Digits);
    } catch (e) {
        throw e;
    }
    try {
        last4Digits = validStr(last4Digits);
    } catch (e) {
        throw e;
    }
    if (first6Digits.length !== 6 || last4Digits.length !== 4){
        throw "first6Digits or last4Digits has incompatible length provided";
    }
    try {
        nameOnCard = checkCardName(nameOnCard);
    } catch (e) {
        throw e;
    }
    try {
        email = validEmail(email);
    } catch (e) {
        throw e;
    }
    if (typeof(isDefault)!=='boolean') throw "isDefault must be a boolean";
    try {
        status = validStr(status);
    } catch (e) {
        throw e;
    }
    if (status !== "active" && status !== "blocked" && status !== "deleted") throw "Invalid status provided";
    try {
        insertDate = validNumber(insertDate, insertDate, true, 2020, 2100);
    } catch (e) {
        throw e;
    }
    try {
        creationDate = validDate(creationDate);
    } catch (e) {
        throw e;
    }
    try {
        cardScheme = validStr(cardScheme);
    } catch (e) {
        throw e;
    }
    try {
        cardType = validStr(cardType);
    } catch (e) {
        throw e;
    }
    try {
        redirectUrl = validStr(redirectUrl);
    } catch (e) {
        throw e;
    }
    try {
        expiry = validStr(expiry);
    } catch (e) {
        throw e;
    }
    try {
        cardToken = validStr(cardToken);
    } catch (e) {
        throw e;
    }
    email = email.toLowerCase();
    
    const createCard = {
        userId: userId,
        first6Digits: first6Digits,
        last4Digits: last4Digits,
        nameOnCard: nameOnCard,
        cardScheme: cardScheme,
        cardType: cardType,
        expiry: expiry,
        email: email,
        cardToken: cardToken,
        isDefault: isDefault,
        status: status,
        redirectUrl: redirectUrl,
        insertDate: insertDate,
        creationDate: creationDate
    };

    const cardsCollection = await cards();
    //check card number doesn't exist
    const checkcard = await cardsCollection.findOne({
        'first6Digits': first6Digits,
        'last4Digits' : last4Digits
    });
    if (checkcard !== null) {
        throw "Error: this card is already registered.";
    }
    const insertInfo = await cardsCollection.insertOne(createCard);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw "Could not add card";

    const card = await getCardsByUserID(userId);
    return card;
};

// Get all cards from a certain userId
const getCardsByUserID = async (user_id) => {
    if (user_id === undefined || typeof(user_id) !== 'string') throw "user_id must be a string";
    user_id = user_id.trim()
    if (user_id.length ===0) throw "user_id must be non-empty string";
    const cardsCollection = await cards();
    let card = await cardsCollection.find({}).toArray();

    // if (!cards) throw "There are no cards";
    return card;
};


// Remove certain Card
const removeCard = async (user_id, first6, last4) =>{
    if (user_id === undefined || first6 === undefined || last4 === undefined) throw "Must provide all fields";
    if (typeof(first6) !== 'string' || typeof(last4) !== 'string' || typeof(user_id) !== 'string') throw "All fields must be a string";
    user_id = user_id.trim();
    first6 = first6.trim();
    last4 = last4.trim();
    if (user_id.length === 0 || first6.length ===0 || last4.length ===0) throw "All fields must be non-empty string";
    let card_collection  = await cards();
    let deleteinfo = await card_collection.findOneAndDelete({userId: user_id, first6Digits: first6, last4Digits:last4});
    if (!deleteinfo) throw "No matching card found";

    let new_cards = await getCardsByUserID(user_id);
    return new_cards;
}

export {
  createCard,
  getCardsByUserID,
  removeCard
};
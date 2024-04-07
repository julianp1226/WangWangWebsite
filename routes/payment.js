import { Router } from "express";
const router = Router();
import multer from "multer";
// import nodemailer from 'nodemailer';
import {
  validAddress,
  validExpLevel,
  validId,
  validStr,
  validStrOptional,
} from "../validation.js";
import xss from 'xss';
import { getCardsByUserID, createCard, removeCard } from "../data/cards.js";


router
  .route("/id/:userId")
  .get(async (req, res) => {
    try{
      let all_cards = await getCardsByUserID(req.params.userId);
      res.render("Payments", {
        auth: true,
        id: req.session.user.id,
        all_cards: all_cards,
        ownPage: req.params.userId === req.session.user.id
      });
    }catch(e){
      return res.render("error", {error: e, auth: true});
    }
  })
  .post(async (req, res) => {
    let newCard = req.body;
    if (Object.keys(newCard).length !== 6) return res.status(400).render("error", {error: "Must provide all the card info", auth: true});

    let cardScheme = "";
    let cardType = "";
    let cardToken = "";
    let redirectUrl = "";
    let status = "active";
    let expiry = newCard.expiryM + '/' + newCard.expiryY;
    // newCard.isDefault = false;
    try{
      let remaining_methods = await createCard(req.params.userId, newCard.CardNumber.slice(0, 4) + newCard.CardNumber.slice(5, 7), 
        newCard.CardNumber.slice(-4), newCard.nameOnCard, cardScheme, cardType, expiry, newCard.email, cardToken, false, status, redirectUrl);
      res.render("Payments", {
        auth: true,
        ownPage: req.params.userId === req.session.user.id,     //Check here
        id: req.session.user.id,
        all_cards: remaining_methods
      });
    }catch(e){
      return res.render("error", {error: e, auth: true});
    }
  })
  .delete(async (req, res) =>{
    let newCard = req.body;
    try{
      let remaining_methods = await removeCard(req.params.userId, newCard.first6Digits, newCard.last4Digits);
      res.render("Payments", {
        auth: true,
        id: req.session.user.id,
        ownPage: req.params.userId === req.session.user.id,     //Check here
        all_cards: remaining_methods
      });
    }catch(e){
      return res.render("error", {error: e, auth: true});
    }
  });

export default router;

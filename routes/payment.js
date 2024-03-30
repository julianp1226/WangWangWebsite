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
        all_cards: all_cards
      });
    }catch(e){
      return res.render("error", {error: e, auth: true});
    }
  });


router.route("/id/:userId/addPayment")
  .post(async (req, res) => {
    let newCard = req.body;
    if (!newCard) throw "Error: Card Info not Complete";
    try{
      let remaining_methods = await createCard(req.params.userId, newCard.first6Digits, newCard.last4Digits, newCard.nameOnCard, 
        newCard.cardScheme, newCard.cardType, newCard.expiry, newCard.email, newCard.cardToken, newCard.isDefault, newCard.status, newCard.redirectUrl);
      res.render("addPayment", {
        auth: true,
        ownPage: req.params.userId === req.session.user.id,     //Check here
        id: req.session.user.id,
        all_cards: remaining_methods
      });
    }catch(e){
      return res.render("error", {error: e, auth: true});
    }
  });


router.route("/id/:userId/deletePayment")
  .delete(async (req, res) =>{
    if (!req.body) throw "Must provide first 6 and last 4 digits";
    try{
      let remaining_methods = await removeCard(req.params.userId, req.body.first6Digits, req.body.last4Digits);
      res.render("Payments", {
        auth: true,
        id: req.session.user.id,
        ownPage: req.params.userId === req.session.user.id,     //Check here
        all_cards: remaining_methods
      });
    }catch(e){
      return res.render("error", {error: e, auth: true});
    }
  })

export default router;

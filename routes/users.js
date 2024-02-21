import { Router } from "express";
const router = Router();
import multer from "multer";
import { ObjectId } from "mongodb";
const upload = multer({ dest: "public/images" });
import fs from "fs";
// import nodemailer from 'nodemailer';
import {
  createUser,
  getUserById,
  getUserByName,
  getUserByUsername,
  updateUser,
  addReportedByUser
} from "../data/users.js";
import {
  validAddress,
  validExpLevel,
  validId,
  validState,
  validStr,
  validZip,
} from "../validation.js";
import { getAllUsers } from "../data/users.js";
import xss from 'xss';

router.route("/id/:userId").get(async (req, res) => {
  let sessionId;
  let userId;
  try {
    userId = validId(req.params.userId);
    sessionId = validId(req.session.user.id);
  } catch (e) {
    return res
      .status(400)
      .render("error", { error: e, auth: true, status: 400 });
  }
  let currentUser;
  try {
    currentUser = await getUserById(req.session.user.id);
  }
  catch (e)
  {
    return res
    .status(404)
    .render("error", { error: "Current user not found", auth: true, status: 404 });
  }
  try {
    let user = await getUserById(req.params.userId);
    return res.render("profilePage", {
      id: req.session.user.id,
      title: req.params.username,
      user: user,
      auth: true,
      ownPage: userId == sessionId,
      currentUsername: currentUser.username
    });
  } catch (e) {
    return res
      .status(404)
      .render("error", { error: "User not found", auth: true, status: 404 });
  }
  //return res.json({ userId: req.params.userId, implementMe: "<-" });
});


router
  .route("/id/:userId/editProfile")
  .get(async (req, res) => {
    let thisUser = await getUserById(req.params.userId);
    res.render("editProfile", {
      auth: true,
      //owner: req.session.user.owner,
      id: req.session.user.id,
      email: thisUser.email,
      state: thisUser.state,
      city: thisUser.city,
      zip: thisUser.zip,
    });
  })
  .post(upload.single("userImage"), async (req, res) => {
    let updatedUser = req.body;
    let fileData = req.file;
    let currentUser = await getUserById(req.params.userId);
    if (fileData) {
      fs.readFile(fileData.path, function (err, data) {
        if (err) throw err;
        fs.writeFile(
          "public/images/" + fileData.originalname,
          data,
          function (err) {
            if (err) throw err;
          }
        );
      });
      updatedUser["userImage"] = "/public/images/" + fileData.originalname;
    } else {
      updatedUser["userImage"] = currentUser.image;
    }
    let thisUser;
    let isAuth;
    if (req.session.user) {
      isAuth = true;
    } else {
      isAuth = false;
    }

    try {
      thisUser = await getUserById(req.params.userId);
    } catch (e) {
      return res.render("editProfile", {
        auth: isAuth,
       // owner: req.session.user.owner,
        id: req.session.user.id,
        email: thisUser.email,
        state: thisUser.state,
        city: thisUser.city,
        zip: thisUser.zip,
        bad: e,
      });
    }
    let newCity, newState, newZip, newLevel, newOwner;
    try {
      newCity = validStr(xss(updatedUser.cityInput));
    } catch (e) {
      return res.render("editProfile", {
        auth: isAuth,
        //owner: req.session.user.owner,
        id: req.session.user.id,
        email: thisUser.email,
        state: thisUser.state,
        city: thisUser.city,
        zip: thisUser.zip,
        bad: e,
      });
    }
    try {
      newState = validState(xss(updatedUser.stateInput));
    } catch (e) {
      return res.render("editProfile", {
        auth: isAuth,
       // owner: req.session.user.owner,
        id: req.session.user.id,
        email: thisUser.email,
        state: thisUser.state,
        city: thisUser.city,
        zip: thisUser.zip,
        bad: e,
      });
    }
    try {
      newZip = validZip(xss(updatedUser.zipInput));
    } catch (e) {
      return res.render("editProfile", {
        auth: isAuth,
       // owner: req.session.user.owner,
        id: req.session.user.id,
        email: thisUser.email,
        state: thisUser.state,
        city: thisUser.city,
        zip: thisUser.zip,
        bad: e,
      });
    }

    let address = await validAddress("", newCity, newState, newZip);
    if (address === false) {
      return res.render("editProfile", {
        auth: isAuth,
        id: req.session.user.id,
        email: thisUser.email,
        state: thisUser.state,
        city: thisUser.city,
        zip: thisUser.zip,
        bad: "Invalid address",
      });
    }

    try {
      let finalUser = await updateUser(
        req.params.userId,
        thisUser.firstName,
        thisUser.lastName,
        thisUser.username,
        thisUser.age,
        newCity,
        newState,
        newZip,
        xss(updatedUser.emailAddressInput),
        "intermediate",
        //thisUser.owner,
        xss(updatedUser.userImage)
      );
      if (finalUser) {
        res.redirect(`/user/id/${req.params.userId}`);
      }
    } catch (e) {
      return res.render("editProfile", {
        auth: isAuth,
        //owner: req.session.user.owner,
        id: req.session.user.id,
        email: thisUser.email,
        state: thisUser.state,
        city: thisUser.city,
        zip: thisUser.zip,
        bad: e,
      });
    }
  });  

export default router;

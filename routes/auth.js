import { Router } from "express";
import { createUser, checkUser } from "../data/users.js";
const router = Router();
import { users } from "../config/mongoCollections.js";
import { isAuth, validId, validStr, validStrArr, validNumber, validAddress, validState, validZip, validTime, validTimeInRange, validEmail, 
  validExpLevel, validDate, validImageUrl, checkPassword, validUsername, validEmailOptional, validStrOptional, validMobile, validCountryCode, validInterests} from "../validation.js";
import xss from 'xss';

router
  .route("/login")
  .get(async (req, res) => {
    return res.render("login", {error: false, message: ""});
  })
  .post(async (req, res) => {
    let countryCode, mobile, password;
    try {
      countryCode = validCountryCode(xss(req.body.countryCodeInput)).toLowerCase();
      mobile = validMobile(xss(req.body.mobileInput));
      password = checkPassword(xss(req.body.passwordInput));
      /*if (password.length != xss(req.body.passwordInput.length))
        throw "Password must not contain whitespace.";
      if (password.length < 8)
        throw "Password must be at least 8 characters long";
      if (
        !/^[a-z0-9]+([._\-][a-z0-9]+)*@[a-z0-9]+(-[a-z0-9]+)*[a-z0-9]*\.[a-z0-9]+[a-z0-9]+$/.test(
          emailAddress
        ) ||
        emailAddress.length > 320
      )
        throw "Invalid email address format";
      let passUpper = false;
      let passNumber = false;
      let passSpecial = false;
      for (let i of password) {
        if (i == " ") throw "Password must not contain spaces";
        if (/[A-Z]/.test(i)) passUpper = true;
        else if (/[0-9]/.test(i)) passNumber = true;
        else if (/[!@#$%^&*\(\)-_+=\[\]\{\}\\\|;:'",<.>\/?]/.test(i))
          passSpecial = true;
        else if (!/[a-z]/.test(i)) throw "Password contains invalid characters";
      }
      if (!passUpper || !passNumber || !passSpecial)
        throw "Password must contain an uppercase character, number, and special character";*/
      let user = await checkUser(countryCode, mobile, password);
      req.session.user = user;

      if (req.session.user.owner === true) {
        return res.redirect("/");
      } else {
        return res.redirect("/");
      }
      
    } catch (e) {
      return res
        .status(400)
        .render("login", { auth: false, message: e, error: true });
    }
  });

router.route("/register")
  .get(async (req, res) => {
    return res.render("register", { auth: false, bad: "" });
  })
  .post(async (req, res) => {
    let firstName = xss(req.body.firstNameInput);
    let lastName = xss(req.body.lastNameInput);
    //let bio = xss(req.body.bio);
    let email = xss(req.body.emailAddressInput);
    let countryCode = xss(req.body.countryCodeInput)
    let mobile = xss(req.body.mobileInput)
    let password = xss(req.body.passwordInput);    
    let errors = "";
    // let hasErrors = false;

    if (
      !firstName ||
      !lastName ||
      !countryCode ||
      !mobile ||
      !password
    ) 
    {
      errors += "All required inputs must be provided";
    }

    try {
      firstName = validStr(firstName, "First name");
      lastName = validStr(lastName, "Last name");
      // console.log(address)
      email = validEmailOptional(email);
      mobile = validMobile(mobile)
      countryCode = validCountryCode(countryCode);
      password = checkPassword(password);
    }
    catch (e) {
      errors += ' - ' + e;
    }


    const usersCollection = await users();
    //check email doesn't exist if one is provided
    email = email.trim()
    if(email !== ""){
      const checkEmail = await usersCollection.findOne({
        email: new RegExp("^" + email.toLowerCase(), "i"),
      });
      if (checkEmail !== null) {
        errors += " - this email is already associated with an account";
      }
    }

    if (errors != "") {
      return res.render("register", {auth: false, bad: errors});
    }

    try {
      //make update
      const newUser = await createUser(
        firstName,
        lastName,
        "",
        [],
        email,
        countryCode,
        mobile,
        "",
        password
      );
      if (newUser) {
        return res.redirect('login');      
      }
      else {
        //if it did not error but didn't work:
        res.status(500).render('error', {error: "Internal Server Error"});
      }
    }
    catch (e) {
      // console.log(e)
      res.render('register', {auth: false, bad: e});
    }
  });

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  return res.render("logout", { auth: false });
});

export default router;

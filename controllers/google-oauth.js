import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy}  from 'passport-google-oauth';
const express = require('express');
const router = express.Router();
const googleAuth = 1;
passport.use(
    new GoogleStrategy(
        {
            //TODO: Put in Env when presenting
            clientID: "888866903134-rnb72ql2t05mgnpdp9gs9u7bc752h05n.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "/auth/google"
        },
        function (accessToken, refreshToken, profile, done) {
            userProfile = profile;
            return done(null,userProfile);
        }
    )
);

router.get(
    '/google',
    passport.authenticate('google', {scope: ['profile', 'email']})
);

router.get(
    '/auth/google',
    passport.authenticate('google', {failureRedirect: '/auth/error' }),
    (req,res) => {
        res.redirect('/auth/success');
    }
);
router.get('/success', async (req, res) => {
    const {failure, success } = await googleAuth.registerWithGoogle(userProfile);
    res.render("homepage", {
        auth: true,
        title: "Home",
        id: userProfile.id
      });
})
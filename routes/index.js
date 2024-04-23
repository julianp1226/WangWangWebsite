import userRoutes from "./users.js";
import authRoutes from "./auth.js";
import postRoutes from './posts.js'
import clinicRoutes from './clinics.js'
import shopRoutes from './shops.js'
import paymentRoutes from './payment.js'
import cartRoutes from './cart.js'
import aboutusRoute from './aboutus.js'

const constructor = (app) => {
  app.use("/", authRoutes);
  app.use("/user", userRoutes);
  app.use("/feed", postRoutes);// TODO: Handle own profile, other user profiles, reviews, etc.
  app.use("/clinic", clinicRoutes); //TODO: Comment out test routes after making sure all clinic functions work properly
  app.use("/shop", shopRoutes);
  app.use("/payments", paymentRoutes);
  app.use("/cart", cartRoutes);
  app.use("/aboutus", aboutusRoute);
  app.get("/", async (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.id) {
      return res.render("homepage", { auth: false, title: "Home" });
    }

    return res.render("homepage", {
      auth: true,
      title: "Home",
      id: req.session.user.id
    });
  });

  app.use("*", (req, res) => {
    return res.redirect("/");
  });
};

export default constructor;

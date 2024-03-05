import userRoutes from "./users.js";
import authRoutes from "./auth.js";

const constructor = (app) => {
  app.use("/", authRoutes);
  app.use("/user", userRoutes); // TODO: Handle own profile, other user profiles, reviews, etc.

  app.get("/", async (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.id) {
      // To test mall without login
      // return res.render("mall", { auth: true, title: "Home", layout: 'main' });
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

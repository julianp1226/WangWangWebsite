import { Router } from "express";
const router = Router();

router.route("/").get(async (req, res) => {
  let auth = false;
  if (req.session.user) {
    auth = true;
  }
  return res.render("about_us", {
    auth: auth,
  });
})

export default router;
import { Router } from "express";
const router = Router();
import multer from "multer";
import { ObjectId } from "mongodb";
const upload = multer({ dest: "public/images" });
import fs from "fs";
import {
  getAllPosts,
  createPost,
  deletePostById,
  getPostById
} from "../data/posts.js";
import xss from 'xss';


router.route("/:postId").get(async (req, res) => {
  let sessionId;
  let postId;
  try {
    postId = validId(req.params.postId);
    sessionId = validId(req.session.user.id);
  } catch (e) {
    return res
      .status(400)
      .render("error", { error: e, auth: true, status: 400 });
  }
  let thisCourt;
  try {
    thisCourt = await getPostById(postId);
  } catch (e) {
    return res
    .status(404)
    .render("error", { error: "Current post not found", auth: true, status: 404 });
  }
  return res.json({postId: postId})
  //return res.json({ postId: req.params.postId, implementMe: "<-" });
});

export default router;
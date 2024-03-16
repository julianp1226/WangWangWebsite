import { Router } from "express";
const router = Router();
import multer from "multer";
import { ObjectId } from "mongodb";
const upload = multer({ dest: "public/media" });
import fs from "fs";
import {
  getAllPosts,
  createPost,
  deletePostById,
  getPostById
} from "../data/posts.js";
import {
  validId,
  validImageUrl,
} from "../validation.js";
import xss from 'xss';

router.route("/").get(async (req, res) => {
  let allPosts;
  try {
    allPosts = await getAllPosts();
  } catch (e) {
    return res.status(500).render("error", { error: e, status: 500 });
  }
  //return res.json(allPosts)
  return res.render("feed", {
      title: "Feed",
      posts: allPosts,
      auth: true,
      id: req.session.user.id
    });
});


router.route("/id/:postId").get(async (req, res) => {
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
  let thisPost;
  try {
    thisPost = await getPostById(postId);
  } catch (e) {
    return res
    .status(404)
    .render("error", { error: "Current post not found", auth: true, status: 404 });
  }
  return res.json(thisPost)
});

export default router;
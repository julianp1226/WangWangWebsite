import { posts } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import 'dotenv/config'

import {
  validId,
  validStr,
  validTime,
  validTimeInRange,
  validEmail,
  validImageUrl,
  checkPassword,
  validBool,
  validEmailOptional,
  validStrOptional,
  validMobile,
  validCountryCode,
  validInterests,
  validStrArr,
  validNumber,
  validVideoUrl,
  isValidImage
} from "../validation.js";


const createPost = async (
  userId,
  title,
  media,
  tags,
  likeCount,
  commentCount
) => {
  if (
    !userId ||
    !title ||
    !media ||
    !tags ||
    !likeCount ||
    !commentCount
  ) {
    throw "Error: Missing required input";
  }
  let type;
  try {
    userId = validId(userId);
  } catch (e) {
    throw e;
  }
  try {
    title = validStr(title);
  } catch (e) {
    throw e;
  }
  try {
    media = validStr(media);
  } catch (e) {
    throw e;
  }
  if (validVideoUrl(media)) {
    type = "video"
  } else if (isValidImage(media)) {
    type = "image"
  } else {
    throw "Invalid file format."
  }
  try {
    type = validStr(type);
  } catch (e) {
    throw e;
  }
  try {
    tags = validStrArr(tags);
  } catch (e) {
    throw e;
  }
  try {
    likeCount = validNumber(likeCount);
  } catch (e) {
    throw e;
  }
  try {
    commentCount = validNumber(commentCount);
  } catch (e) {
    throw e;
  }

  let addPost = {
    userId: userId,
    title: title,
    media: media,
    type: type,
    tags: tags,
    likeCount: likeCount,
    commentCount:commentCount,
    insertDate: new Date().toJSON().slice(0, 10)
  };
  const postsCollection = await posts();
 
 
  const insertInfo = await postsCollection.insertOne(addPost);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not make post";

  const newId = insertInfo.insertedId.toString();

  const post = await getPostById(newId);
  return post;
};

const getPostById = async (id) => {
  try {
    id = validId(id, "postId");
  } catch (e) {
    throw "Error (data/posts.js :: getPostById(id)):" + e;
  }

  const postsCollection = await posts();
  const post = await postsCollection.findOne({ _id: new ObjectId(id) });

  if (post === null)
    throw "Error (data/posts.js :: getPostById(id)): No post found";

  post._id = post._id.toString();
  return post;
};

//console.log(await createPost("65fd11a1a0f40b80482efaca", "post 1", "/public/media/venice.mp4", ["#fun", "#selfcare", "#facial"], 112, 3));
const getAllPosts = async () => {
  let allPosts;
  try {
    const postsCollection = await posts();
    allPosts = await postsCollection.find({}).toArray();
  } 
  catch (e) {
    throw e;
  }
  return allPosts;
};

const deletePostById = async (id) => {
  try {
    id = validId(id, "postId");
  } catch (e) {
    throw "Error (data/posts.js :: deletePostById(id)):" + e;
  }

  const postsCollection = await posts();
  const deletionInfo = await postsCollection.deleteOne({ _id: new ObjectId(id) });

  if (deletionInfo.deletedCount === 0)
    throw "Error (data/posts.js :: deletePostById(id)): No post found with the given ID";

  return { deletedCount: deletionInfo.deletedCount };
};

export {
  createPost,
  getPostById,
  getAllPosts,
  deletePostById
}
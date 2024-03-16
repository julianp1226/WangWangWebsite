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
  validNumber
} from "../validation.js";


const createPost = async (
  userId,
  title,
  media,
  type,
  tags,
  likeCount,
  commentCount
) => {
  if (
    !userId ||
    !title ||
    !media ||
    !type ||
    !tags ||
    !likeCount ||
    !commentCount
  ) {
    throw "Error: Missing required input";
  }
 
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
    type = validStr(type);
  } catch (e) {
    throw e;
  }
  if (type != "image" && type != "video") {
    throw "Error: Media must be of type image or video.";
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

//console.log(await createPost("65f4c23c772bb8ce19f612bb", "Buy this!", "insert thing here", "video", ["#fun", "#selfcare"], 67, 2));
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
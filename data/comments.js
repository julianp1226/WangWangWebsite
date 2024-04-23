import { posts, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { validId, validStr, validStrArr, validNumber } from "../validation.js";

const createComment = async (userId, postId, comment) => {
  try {
    userId = validId(userId);
    postId = validId(postId);
  } catch (e) {
    throw (
      "Error (data/comments.js):" +
      e
    );
  }

  const postsCollection = await posts();
  const usersCollection = await users();
  let post = await postsCollection.findOne({
    _id: new ObjectId(postId),
  });

  const commenter = await usersCollection.findOne({
    _id: new ObjectId(userId),
  });

  if (post === null)
    throw "Error (data/comments.js :: Post not found)";
  if (commenter === null)
    throw "Error (data/comments.js :: User commenter not found)";

  let postComments = post.comments;

  try {
    comment = validStr(comment, "Comment");
  } catch (e) {
    throw (
      "Error (data/comments.js :: comment not valid" +
      e
    );
  }


  let commentObject = {
    _id: new ObjectId(),
    commenterFirstname: commenter.firstName,
    commenterProfilePic: commenter.profilePic,
    user_id: userId,
    post_id: postId,
    comment: comment,
    likes: 0,
    date: new Date().toJSON().slice(0, 10),
  };

  postComments.push(commentObject);

  const updatedInfo = await postsCollection.findOneAndUpdate(
    { _id: new ObjectId(postId) },
    { $set: { comments: postComments }, $inc : { "commentCount" : 1 } },
    { returnDocument: "after" }
  );

  if (updatedInfo.lastErrorObject.n === 0)
    throw "Error (data/comments.js :: Could not update post";

  commentObject._id = commentObject._id.toString();
  return commentObject;
};

const likePost = async (postId) => {
  try {
    postId = validId(postId);
  } catch (e) {
    throw (
      "Error (data/comments.js):" +
      e
    );
  }
  
  const postsCollection = await posts();

  const updatedInfo = await postsCollection.findOneAndUpdate(
    { _id: new ObjectId(postId) },
    { $inc : { "likeCount" : 1 } },
    { returnDocument: "after" }
  );

  return updatedInfo;
}

//console.log(await likePost('65fd11a1a0f40b80482efaca'));
//console.log(await createComment("65fd11a1a0f40b80482efaca","6604514fef5b72488d4dfed1", "Good stuff" ))

export {
  createComment,
  likePost
}
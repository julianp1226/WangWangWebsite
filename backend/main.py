from flask import Flask, render_template, request, jsonify, session
from dbinit import Connection
from uuid import uuid1
from flask_cors import CORS, cross_origin
from datetime import date
import bcrypt
from bson import json_util
from flask_jwt_extended import JWTManager, create_access_token, jwt_required

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = "Hc1hq,5iw6f$khVmFBF6s2s.f$2ej"

db = Connection("WangWang")


def login_required(func):
    def wrapper(*args, **kwargs):
        if "user" not in session:
            return jsonify({"message": "Unauthorized"}), 401
        return func(*args, **kwargs)

    return wrapper


@app.route("/", methods=["GET"])
def root():
    users = db.user.find({})
    return list(users)


@app.route("/newuser", methods=["POST"])
def insert_user():
    _id = str(uuid1().hex)
    password = request.form["accessToken"]
    deviceToken = ""
    firstName = request.form["firstName"]
    lastName = request.form["lastName"]
    bio = ""
    interests = request.form["interests"]
    email = request.form["email"]
    countryCode = request.form["countryCode"]
    mobile = request.form["mobile"]
    deletedEmail = ""
    deletedMobile = ""
    status = "active"
    role = "user"
    profilePic = ""
    deviceType = "desktop"
    authType = "app"
    isNotification = True
    stripeCustomerId = ""
    creationDate = str(date.today())
    insertDate = ""
    lastUpdatedAt = ""

    # salting password
    salt = bcrypt.gensalt()
    accessToken = bcrypt.hashpw(password.encode("utf-8"), salt)

    content = {
        "_id": _id,
        "accessToken": accessToken,
        "deviceToken": deviceToken,
        "firstName": firstName,
        "lastName": lastName,
        "bio": bio,
        "interests": interests,
        "email": email,
        "countryCode": countryCode,
        "mobile": mobile,
        "deletedEmail": deletedEmail,
        "deletedMobile": deletedMobile,
        "status": status,
        "role": role,
        "profilePic": profilePic,
        "deviceType": deviceType,
        "authType": authType,
        "isNotification": isNotification,
        "stripeCustomerId": stripeCustomerId,
        "creationDate": creationDate,
        "insertDate": insertDate,
        "lastUpdatedAt": lastUpdatedAt,
    }

    result = db.user.insert_one(content)
    if result.inserted_id:
        user = db.user.find_one({"_id": _id})
        session["user"] = user["_id"]  # Set the user in the session
        return jsonify({"message": "User has been inserted", "user": user})
    else:
        return jsonify({"message": "User not inserted"})


@app.route("/user", methods=["GET"])
# @login_required
def get_user():
    user_id = session.get("user")
    print(session)
    print(user_id)
    if user_id:
        user = db.user.find({"_id": user_id})
        return jsonify(user)
    else:
        return jsonify("not found")


@app.route("/login", methods=["POST"])
def login():
    email = request.form.get("email")
    password = request.form.get("accessToken")

    # Retrieve the user from the database based on the provided email
    user = db.user.find_one({"email": email})

    if user and bcrypt.checkpw(password.encode("utf-8"), user["accessToken"]):
        # If the password is correct, set the user in the session
        session["user"] = user["_id"]
        print(session)
        return jsonify("Login Successful")
    else:
        return jsonify("Invalid Credentials")


@app.route("/logout", methods=["GET"])
def logout():
    session.pop("user", None)
    return jsonify({"message": "Logout successful"})


if __name__ == "__main__":
    app.run(port=8887, debug=True)
    # print(get_users())

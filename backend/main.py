from flask import Flask, render_template, request, jsonify
from dbinit import Connection
from uuid import uuid1
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)
db = Connection("flask_mongo_crud")


@app.route("/", methods=["GET"])
def root():
    users = db.user.find({})
    return list(users)


@app.route("/newuser", methods=["POST"])
def insert_user():
    _id = str(uuid1().hex)

    firstName = request.form["firstName"]
    lastName = request.form["lastName"]
    number = request.form["number"]

    content = {
        "_id": _id,
        "firstName": firstName,
        "lastName": lastName,
        "number": number,
    }

    result = db.user.insert_one(content)
    if not result.inserted_id:
        return jsonify("user not inserted")

    return jsonify("User has been inserted")


@app.route("/user/<_id>", methods=["GET"])
def get_user(_id):
    user = db.user.find({"_id": _id})
    return list(user)


@app.get("/users")
def get_users():
    users = db.user.find({})
    return list(users)


if __name__ == "__main__":
    app.run(port=8887, debug=True)
    # print(get_users())

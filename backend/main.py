from flask import Flask
from dbinit import Connection

from uuid import uuid1
from flask import request

app = Flask(__name__)
db = Connection("flask_mongo_crud")


@app.route("/newuser", methods=["POST"])
def insert_user(firstName, lastName, number):
    _id = str(uuid1().hex)

    content = {
        "_id": _id,
        "firstName": firstName,
        "lastName": lastName,
        "number": number,
    }

    result = db.user.insert_one(content)
    if not result.inserted_id:
        return {"message": "Failed to insert"}, 500

    return {"message": "Success", "data": {"id": result.inserted_id}}, 200


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

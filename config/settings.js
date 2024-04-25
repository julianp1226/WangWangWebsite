import 'dotenv/config'

export const mongoConfig = {
  // serverUrl: "mongodb://localhost:27017/",
  //serverUrl: 'mongodb://127.0.0.1:27017/',
  serverUrl: process.env.MONGO_CONNECTION_STRING,
  database: "WangWang",
};
import dotenv from 'dotenv';
import app from "./server.js";
import mongodb from "mongodb";
import ReviewsDAO from "./dao/reviewsDAO.js";

dotenv.config();

const MongoClient = mongodb.MongoClient
const mongo_username = process.env['MONGO_USERNAME'];
const mongo_password = process.env['MONGO_PASSWORD'];

const uri =`mongodb+srv://${mongo_username}:${mongo_password}@edimovie.mgup4.mongodb.net/?retryWrites=true&w=majority&appName=edimovie`;

const port = 8000;


MongoClient.connect(uri, {
    maxPoolSize: 50,
    wtimeoutMS: 2500,
  })
    .catch(err => {
      console.error(err.stack);
      process.exit(1);
    })
    .then(async client => {
      console.log("Connected to MongoDB Atlas");
      await ReviewsDAO.injectDB(client);
      app.listen(port, () => {
        console.log(`listening on port ${port}`);
      });
    });
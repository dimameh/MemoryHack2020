const Mongoose = require('mongoose');
var config = require('../config').config;
Mongoose.Promise = global.Promise;

const connectToDb = async () => {
  try {
    await Mongoose.connect(config.MONGO_URI, { useNewUrlParser: true });
    console.log('Connected to mongo!!!');
  } catch (err) {
    console.log('Could not connect to MongoDB');
  }
};

exports.connectToDb = connectToDb;
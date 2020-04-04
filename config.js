exports.config = {
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/memoryhack',
    serverPort: process.env.PORT || 1335,
    photoDir: './photos/'
  };
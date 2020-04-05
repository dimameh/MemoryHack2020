exports.config = {
  MONGO_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/memoryhack',
  serverPort: process.env.PORT || 1335,
  photoDir: './photo/',
  processPhotoDir: './processPhoto/',
};
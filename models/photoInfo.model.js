const mongoose = require('mongoose');

const PhotoInfoSchema = mongoose.Schema({
  photoName: { type: String, required: true, unique: true },
  vkUserId: { type: Number, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  birthYear: { type: Number },
  deathYear: { type: Number },
  bio: { type: String },
}, { collection: 'photoInfo' });

const PhotoInfoModel = mongoose.model('photoInfo', PhotoInfoSchema);

PhotoInfoModel.addPhotoInfo = (photoInfoToAdd) => photoInfoToAdd.save();

PhotoInfoModel.getPhotoInfo = () => PhotoInfoModel.find({ }, '-__v -_id');

PhotoInfoModel.getUsersPhoto = (vkUserId) => PhotoInfoModel.find({ vkUserId }, '-__v -_id');

PhotoInfoModel.removeAll = () => PhotoInfoModel.remove({});

exports.photoInfoModel = PhotoInfoModel;
const mongoose = require('mongoose');

const PhotoInfoSchema = mongoose.Schema({
  photoName: { type: String, required: true, unique: true },
  vkUserId: { type: Number, required: true },
}, { collection: 'photoInfo' });

const PhotoInfoModel = mongoose.model('photoInfo', PhotoInfoSchema);

PhotoInfoModel.addPhotoInfo = (photoInfoToAdd) => photoInfoToAdd.save();

PhotoInfoModel.getPhotoInfo = () => PhotoInfoModel.find({ }, '-__v -_id');

// PhotoInfoModel.getUsersPhoto

PhotoInfoModel.removeAll = () => PhotoInfoModel.remove({});

exports.photoInfoModel = PhotoInfoModel;
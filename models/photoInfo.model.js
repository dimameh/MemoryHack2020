const mongoose = require('mongoose');

const PhotoSchema = mongoose.Schema({
  photoPath: { type: String, required: true, unique: true },
}, { collection: 'photos' });

const PhotoModel = mongoose.model('photos', PhotoSchema);

PhotoModel.addPhoto = (photoToAdd) => photoToAdd.save();

PhotoModel.getPhotos = () => PhotoModel.find({ }, '-__v -_id');

exports.photoModel = PhotoModel;
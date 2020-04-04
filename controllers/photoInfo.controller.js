const PhotoInfo = require('../models/photoInfo.model').photoModel;

const controller = {};

controller.addPhoto = async (photoPath) => {
    const photoToAdd = PhotoInfo({
        photoPath
    });
    try {
        await PhotoInfo.addPhoto(photoToAdd);
        console.log('Adding new photo... ');
    } catch (err) {
        throw `Error in add photo- ${err}`;
    }
  };

controller.getPhotos = async function() {
    return await PhotoInfo.getPhotos();
}

exports.controller = controller;
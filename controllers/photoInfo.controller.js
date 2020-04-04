const PhotoInfo = require('../models/photoInfo.model').photoModel;

const controller = {};

controller.addPhoto = async (photoName) => {
    const photoToAdd = PhotoInfo({
        photoName
    });
    try {
        await PhotoInfo.addPhoto(photoToAdd);
        console.log('Adding new photo... ');
    } catch (err) {
        throw `Error in add photo- ${err}`;
    }
  };

controller.getPhotos = async function () {
    return await PhotoInfo.getPhotos();
}

controller.removeAll = async function () {
    await PhotoInfo.removeAll();
}

exports.controller = controller;
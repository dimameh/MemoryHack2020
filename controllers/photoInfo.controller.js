const PhotoInfo = require('../models/photoInfo.model').photoInfoModel;

const controller = {};

controller.addPhotoInfo = async (photoName, vkUserId) => {
    const photoToAdd = PhotoInfo({
        photoName,
        vkUserId
    });
    try {
        await PhotoInfo.addPhotoInfo(photoToAdd);
        console.log('Adding new photo info... ');
    } catch (err) {
        throw `Error in add photo info- ${err}`;
    }
  };

controller.getPhotoInfo = async function () {
    return await PhotoInfo.getPhotoInfo();
}

controller.removeAll = async function () {
    await PhotoInfo.removeAll();
}

exports.controller = controller;
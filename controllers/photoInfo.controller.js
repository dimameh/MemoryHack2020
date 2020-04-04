const PhotoInfo = require('../models/photoInfo.model').photoInfoModel;

const controller = {};

controller.addPhotoInfo = async (data) => {
    const photoToAdd = PhotoInfo({
        photoName: data.photoName,
        vkUserId: data.vkUserId,
        name: data.name,
        surname: data.surname,
        birthYear: data.birthYear,
        deathYear: data.deathYear,
        bio: data.bio,
    });
    try {
        await PhotoInfo.addPhotoInfo(photoToAdd);
        console.log('Adding new photo info... ');
    } catch (err) {
        throw `Error in add photo info- ${err}`;
    }
}

controller.getPhotoInfo = async function () {
    return await PhotoInfo.getPhotoInfo();
}

controller.getUsersPhoto = async (vkUserId) => {
    return await PhotoInfo.getUsersPhoto(vkUserId);
}

controller.removeAll = async function () {
    await PhotoInfo.removeAll();
}

exports.controller = controller;
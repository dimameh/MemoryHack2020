function isValidPhotoInfoData(data) {
    if(!data.vkUserId || !data.name || !data.surname) {
        return false;
    }

    if(data.birthYear) {
        if (data.birthYear < 1841 || data.birthYear > 1945) {
            return false;
        }
    }

    if (data.deathYear) {
        if(data.deathYear - data.birthYear > 120) {
            return false
        }
    } 
    return true;
}

exports.isValidPhotoInfoData = isValidPhotoInfoData;
let index = 0;

const GenerateName = (filename) => {
    index++;
    var name = filename.substr(0, filename.lastIndexOf('.'));
    var ext = filename.substr(filename.lastIndexOf('.'), filename.length);
    name += `-${index}`;
    return name + ext;
}

exports.GenerateName = GenerateName;
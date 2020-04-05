const fs = require('fs'),
    request = require('request'),
    express = require('express'),
    app = express(),
    config = require('./config').config,
    connect = require('./db/connect'),
    upload = require('express-fileupload');
    photoInfoController = require('./controllers/photoInfo.controller').controller,
    nameGenerator = require('./photoNameGenerator'),
    path = require('path'),
    validator = require('./validator'),
    translit = require('cyrillic-to-translit-js');

app.use('/public', express.static(__dirname + '/public'));  
app.use(express.static(__dirname + '/public')); 
app.use(upload());

app.listen(config.serverPort, function () {
  console.log('Listening on port ' + config.serverPort);
});

connect.connectToDb();

app.get('/', async (req, res) => {
    try {
        let file = fs.readFileSync('./images/links.json');
        let object = JSON.parse(file);
        res.send(object);
    } catch (e) {
        res.status(404);
        res.json({ status: 'error', error: 'File not found!' });
    }
});

app.post('/uploadPhoto', function(req, res) {
    if (req.files) {
        if (!validator.isValidPhotoInfoData(req.body)) {
            res.status(500);
            res.json({ status: 'error', error: 'data is not valid' });
        } else {
            var file = req.files.filename;
            var filename = translit().transform(nameGenerator.GenerateName(file.name));
            if (!fs.existsSync(config.photoDir)) {
                fs.mkdirSync(config.photoDir);
            }
            file.mv(config.photoDir + filename, function(err) {
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.json({ status: 'error', error: 'error with upload photo' });
                } else {
                    try {
                        data = req.body;
                        data.photoName = filename;
                        photoInfoController.addPhotoInfo(data);
                        res.status(201);
                        res.json({ status: 'success', filePath: `${data}` });
                    } catch (err) {
                        res.status(500);
                        res.json({ status: 'error', error: 'db error- ' + err });
                    }                
                }
            });
        }
    }
});

app.get('/getPhoto',function(req, res) {
    var fullUrl = req.protocol + '://' + req.get('host');
    photoInfoController.getPhotoInfo().then(result => {
        result.forEach(element => {
            element.photoName = fullUrl + config.photoDir.substr(1, config.photoDir.length) + element.photoName
        });
        result.reverse();
        res.status(200);
        res.json(result);
    })
});

app.get('/test', function(req, res) {
    res.status(200);
    res.sendFile(__dirname + '/front/index.html');
});

app.get('/photo/:filename', function(req, res) {
    res.status(200);
    res.sendFile(__dirname + config.photoDir.substr(1, config.photoDir.length) + req.params.filename);
});

app.get('/getUserPhoto', function(req, res) {
    var fullUrl = req.protocol + '://' + req.get('host');
    photoInfoController.getUsersPhoto(req.query.vkUserId).then(result => {
        result.forEach(element => {
            element.photoName = fullUrl + config.photoDir.substr(1, config.photoDir.length) + element.photoName
        });
        result.reverse();
        res.status(200);
        res.json(result);
    })
});

//Требуется для дебага
app.get('/removePhoto', function(req, res) {
    const directory = 'photo';

    fs.readdir(directory, (err, files) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.json({status: 'error', error: error});
        } else {
            for (const file of files) {
                fs.unlink(path.join(directory, file), err => {
                    if (err) {
                        console.log(err);
                        res.status(500);
                        res.json({ status: 'error', error: error });
                    }
                });
            }
        }
    });
    photoInfoController.removeAll();
    console.log('all photo has been removed');
    res.status(200);
    res.json({status: 'success', error: 'all photo has been removed'});
});

app.get('/processPhoto', function(req, res) {

    var file = req.files.filename;
            var filename = translit().transform(nameGenerator.GenerateName(file.name));
            if (!fs.existsSync(config.processPhotoDir)) {
                fs.mkdirSync(config.processPhotoDir);
            }
            file.mv(config.processPhotoDir + filename, function(err) {
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.json({ status: 'error', error: 'error with upload photo' });
                } else {
                    try {
                        var fullUrl = req.protocol + '://' + req.get('host');
                        const url = fullUrl + config.processPhotoDir.substr(1,config.processPhotoDir.length) + filename;
                        const body = { url, sex: req.body.sex };

                        //посылаем запрос на нейронку
                        //получаем ответ, отсылаем его в res
                        

                        
                        //Удаляем файл
                        try {
                            var filePath = config.processPhotoDir + filename;
                            fs.unlinkSync(filePath);
                        } catch(err) {
                            console.error('error with deleting file- ' + err);
                            res.status(500);
                            res.json({ status: 'error', error: 'error with deleting file- ' + err });
                        }
                    } catch (err) {
                        res.status(500);
                        res.json({ status: 'error', error: 'db error- ' + err });
                    }                
                }
            });
            const formData = {
                // Pass a simple key-value pair
                sex: req.body.sex,
                // Pass data via Buffers
                my_buffer: Buffer.from([1, 2, 3]),
                // Pass data via Streams
                my_file: fs.createReadStream(__dirname + '/unicycle.jpg'),
            
              };
          
          
          
            request.post({ url:'http://service.com/upload', formData: formData }, function optionalCallback(err, httpResponse, body) {
                if (err) {
                    return console.error('upload failed:', err);
                }
                console.log('Upload successful!  Server responded with:', body);
            });
});

//request.post({url:'http://service.com/upload', form: {key:'value'}}, function(err,httpResponse,body){ /* ... */ })

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

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

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
                        var resultUrl = generateLink(data.photoName, req);
                        res.json({ status: 'success', filePath: resultUrl });
                    } catch (err) {
                        res.status(500);
                        res.json({ status: 'error', error: 'db error- ' + err });
                    }                
                }
            });
        }
    } else {
        res.json({ status: 'error', error: 'No files' });
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

app.get('/processPhoto/:filename', function(req, res) {
    res.status(200);
    res.sendFile(__dirname + config.processPhotoDir.substr(1, config.processPhotoDir.length) + req.params.filename);
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
    const secondDirectory = 'processPhoto';
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
    fs.readdir(secondDirectory, (err, files) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.json({status: 'error', error: error});
        } else {
            for (const file of files) {
                fs.unlink(path.join(secondDirectory, file), err => {
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

app.post('/processPhoto', function(req, res) {
    if (req.files) {

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
                var resultUrl = generateProcessLink(filename, req);
                const body = { url: resultUrl, sex: req.body.sex };


                var options = { method: 'POST',
                  url: 'http://170ec337.ngrok.io/upload',
                  headers: 
                   { 'Postman-Token': '92294eda-ae91-43bb-b368-b50c8f031859',
                     'cache-control': 'no-cache',
                     'Content-Type': 'application/x-www-form-urlencoded' },
                  form: 
                   { url: resultUrl,
                     undefined: undefined } };
                
                request(options, function (error, response, body) {
                  if (error) throw new Error(error);
                
                  res.json({status: 'success', result: JSON.parse(body)});
                });
            }
        })
        
    } else {
        res.json({ status: 'error', error: 'No files' });
    }
});

function generateLink(photoName, req) {
    var fullUrl = req.protocol + '://' + req.get('host');
    var result = fullUrl + config.photoDir.substr(1, config.photoDir.length) + photoName
    return result;
}

function generateProcessLink(photoName, req) {
    var fullUrl = req.protocol + '://' + req.get('host');
    var result = fullUrl + config.processPhotoDir.substr(1, config.processPhotoDir.length) + photoName
    return result;
}

//request.post({url:'http://service.com/upload', form: {key:'value'}}, function(err,httpResponse,body){ /* ... */ })
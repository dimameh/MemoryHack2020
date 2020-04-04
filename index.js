const fs = require('fs'),
    request = require('request'),
    express = require('express'),
    app = express(),
    config = require('./config').config,
    connect = require('./db/connect'),
    upload = require('express-fileupload');
    photoController = require('./controllers/photoInfo.controller').controller,
    nameGenerator = require('./photoNameGenerator');
    path = require('path');


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
        res.send('File not found!');
    }
});

app.post('/uploadPhoto', function(req, res) {
    if(req.files){
        var file = req.files.filename,
            filename = nameGenerator.GenerateName(file.name);
            if (!fs.existsSync(config.photoDir)){
                fs.mkdirSync(config.photoDir);
}
            file.mv(config.photoDir + filename, function(err){
                if(err){
                    console.log(err);
                    res.send('error with upload photo');
                } else {
                    try {
                        photoController.addPhoto(filename);
                        res.send(`Success! filePath: [${filename}]`);
                    } catch (err) {
                        res.send('db error- ' + err);
                    }                
                }
            });
    }
});

app.get('/getPhotos',function(req, res) {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    fullUrl = fullUrl.substr(0, fullUrl.length - 9);
    photoController.getPhotos().then(result => {
        result.forEach(element => {
            element.photoName = fullUrl + 'photo/' + element.photoName
        });
        res.send(result);
    })
});

app.get('/test', function(req, res) {
    res.sendFile(__dirname + '/front/index.html');
});

app.get('/photo/:name', function(req, res) {
    res.sendFile(__dirname + config.photoDir.substr(1, config.photoDir.length) + req.params.name);
});

//Требуется для дебага
app.get('/removePhotos', function(rea, res) {
    const directory = 'photos';

    fs.readdir(directory, (err, files) => {
        if (err) {
            console.log(err);
        } else {
            for (const file of files) {
                fs.unlink(path.join(directory, file), err => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
    });
    photoController.removeAll();
    console.log('all photo has been removed');
    res.send('all photo has been removed');
});

//request.post({url:'http://service.com/upload', form: {key:'value'}}, function(err,httpResponse,body){ /* ... */ })


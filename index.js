const fs = require('fs'),
    fileUrl = require('file-url'),
    request = require('request'),
    express = require('express'),
    app = express(),
    config = require('./config').config,
    connect = require('./db/connect'),
    upload = require('express-fileupload');
    photoController = require('./controllers/photoInfo.controller').controller,
    nameGenerator = require('./photoNameGenerator');


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
                        const url = fileUrl(config.photoDir + filename);
                        photoController.addPhoto(url);
                        res.send(`Success! filePath: [${url}]`);
                    } catch (err) {
                        res.send('db error- ' + err);
                    }                
                }
            });
    }
});

app.get('/getPhotos',function(req, res) {
    photoController.getPhotos().then(result => {
        res.send(result);
    })
});

app.get('/test', function(req, res) {
    res.sendFile(__dirname + '/front/index.html');
});

//request.post({url:'http://service.com/upload', form: {key:'value'}}, function(err,httpResponse,body){ /* ... */ })


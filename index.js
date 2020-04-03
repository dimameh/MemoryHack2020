var fs = require('fs');
var express = require('express');
var app = express();

app.listen((process.env.PORT || 3000), function () {
  console.log('Listening on port ' + (process.env.PORT || 3000));
});

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
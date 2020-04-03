var fs = require('fs');
var express = require('express');
var app = express();

app.listen((process.env.PORT || 3000), function () {
  console.log('Listening on port ' + (process.env.PORT || 3000));
});

app.get('/', async (req, res) => {
    try {
        var array = fs.readFileSync('./images/links.txt').toString().split("\n");   

        res.send(array);
    } catch (e) {
        res.status(404);
        res.send('File not found!');
    }
});
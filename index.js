var fs = require('fs');
var express = require('express');
var app = express();

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});

app.get('/', async (req, res) => {
    try {
        var array = fs.readFileSync('./images/links.txt').toString().split("\n");   
        for(var i = 0; i < array.length-1; i++){
            array[i] = array[i].substr(0, array[i].length-1);
        }
        res.send(array);
    } catch (e) {
        res.status(404);
        res.send('File not found!');
    }
});
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json())


app.get('/', function (req, res) {
    res.send('Hello World!');
});

<<<<<<< HEAD
app.listen('4000', function () {
    console.log('Example app listening on port 4000!');
});
=======
app.listen('/dimaggio224xz.github.io/my_test/server.js', function () {
    console.log('Example app listening on port 3000!');
});
>>>>>>> bb9383c8bb137c50e7466411d83ac88d8ee69974

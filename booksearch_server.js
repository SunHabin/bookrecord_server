var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');

app.use(express.json());

//support URL-encode body
app.use(bodyParser.urlencoded({extended: true}));

var con = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: 'bean0403',
    database: 'jajus'
});

var server = app.listen(3000, function() {
    var host = server.address().address
    var port = server.address().port

    console.log("server start");

});

con.connect(function(error){
    if(!!error)console.log("error"+statusCode);
    else console.log("connected");
});


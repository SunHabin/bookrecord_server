var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');

app.use(express.json());

//support URL-encode body
app.use(bodyParser.urlencoded({extended:true}));

//naver api authetication
var client_id = 'lD4obV87D0slswIijir6';
var client_secret = 'anU63Lz7eq';

// mysql connection info
var con = mysql.createConnection({
    host : 'localhost',
    user: 'root',
    password: 'bean0403',
    database: 'jajus'
});

// server start
var server = app.listen(3000, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("server start")
})

// mysql connection
con.connect(function(error){
    if(!!error)
        console.log("error:"+error);
    else
        console.log("connected");
})

app.get('/search/book/:ISBN', function(req, res) {
    // JSON 결과
    console.log(req.params.ISBN)
    var api_url = 'https://openapi.naver.com/v1/search/book.json?query=' + encodeURI(req.params.ISBN);

    var request = require('request');
    var options = {
        url : api_url,
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret':client_secret}
    };
    request.get(options, function (error,response,body) {
        if(!error && response.statusCode == 200) {
            res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
            res.end(body.items);
        } else {
            res.status(response.statusCode).end();
            console.log('error = ' + response.statusCode);
        }
    });
});
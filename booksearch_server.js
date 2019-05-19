// 네이버 검색 Open API test

var express = require('express');
var app = express();

var client_id = 'lD4obV87D0slswIijir6';
var client_secret = 'anU63Lz7eq';

app.get('/search/book', function(req, res) {
    // JSON 결과
    console.log(req.query.query)
    var api_url = 'https://openapi.naver.com/v1/search/book.json?query=' + encodeURI(req.query.query);

    var request = require('request');
    var options = {
        url : api_url,
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret':client_secret}
    };
    request.get(options, function (error,response,body) {
        if(!error && response.statusCode == 200) {
            res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
            res.end(body);
        } else {
            res.status(response.statusCode).end();
            console.log('error = ' + response.statusCode);
        }
    });
});

app.listen(3000, function () {
  console.log('http://127.0.0.1:3000/search/book?query=검색어 app listening on port 3000!');
});
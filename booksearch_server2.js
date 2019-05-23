var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
var date = moment().format('YYYY-MM-DD');
console.log(date);
var content = null;

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
            // 데이터 저장을 위한 객체 변환
            content = JSON.parse(body);
            saveBook(content, req.params.ISBN);

            res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
            console.log(body);
            res.end(body);
        } else {
            res.status(response.statusCode).end();
            console.log('error = ' + response.statusCode);
        }
    });
});


function saveBook(content, ISBN) {
    var sql = 'INSERT INTO book_all (ISBN, book_name, img_src, author, publisher, public_date, more_url, read_date) VALUES(?,?,?,?,?,?,?,?)';
    var params = [ISBN, content.items[0].title, content.items[0].image, content.items[0].author, content.items[0].publisher, content.items[0].pubdate, content.items[0].link, date];

    conn.query(sql, params, function(err, rows, fields){
        if(err)
        console.log(err);
    })
}
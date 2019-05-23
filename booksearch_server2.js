var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cherrio = require('cheerio');

// 현재시간=한국시간으로 맞춰줌
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
var date = moment().format('YYYY-MM-DD');
var content = null;
var category = 1;

app.use(express.json());

//support URL-encode body
app.use(bodyParser.urlencoded({ extended: true }));

//naver api authetication
var client_id = 'lD4obV87D0slswIijir6';
var client_secret = 'anU63Lz7eq';

// mysql connection info
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'bean0403',
    database: 'jajus'
});

// server start
var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("server start")
})

// mysql connection
con.connect(function (error) {
    if (!!error)
        console.log("error:" + error);
    else
        console.log("connected");
})

app.get('/search/book/:ISBN', function (req, res) {
    // JSON 결과
    console.log(req.params.ISBN)
    var api_url = 'https://openapi.naver.com/v1/search/book.json?query=' + encodeURI(req.params.ISBN);

    var request = require('request');
    var options = {
        url: api_url,
        headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
    };
    request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // 데이터 저장을 위한 객체 변환
            content = JSON.parse(body);
            saveBook(content, req.params.ISBN);

            res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
            console.log(body);
            res.end(body);
        } else {
            res.status(response.statusCode).end();
            console.log('error = ' + response.statusCode);
        }
    });
});


function saveBook(content, ISBN) {

    var request = require('request');

    request(content.items[0].link, (error, response, body) => {
        if (error) throw error;
        let $ = cherrio.load(body);
        try {
            let cate = '';
            cate = $('#category_location1_depth').text();
            category = selectCate(cate);
            console.log(category);
        }
        catch (error) {
            console.error(error);
        }
    });

    var sql = 'INSERT INTO book_all (ISBN, book_name, img_src, author, publisher, public_date, more_url, read_date, category) VALUES(?,?,?,?,?,?,?,?,?)';
    var params = [ISBN, content.items[0].title.toString(), content.items[0].image, content.items[0].author, content.items[0].publisher, content.items[0].pubdate, content.items[0].link, date, category];
    console.log(catagory);

    con.query(sql, params, function (err, rows, fields) {
        if (err)
            console.log(err);
    })
};


function selectCate(cate) {
    var category = cate;
    switch (category) {
        case "소설":
            return 2;
        case "시/에세이":
            return 3;
        case "경제/경영":
            return 4;
        case "자기계발":
            return 5;
        case "인문":
            return 6;
        case "역사/문화":
            return 7;
        case "국어/외국어":
            return 8;
        case "가정/생활/요리":
            return 9;
        case "청소년":
            return 10;
        case "사회":
            return 11;
        case "여행/지도":
            return 12;
        case "과학/공학":
            return 13;
        case "예술/대중문화":
            return 14;
        case "컴퓨터/IT":
            return 15;
        case "종교":
            return 16;
        case "학습/참고서":
            return 17;
        case "취업/수험서":
            return 18;
        case "건강":
            return 19;
        case "취미/레저":
            return 20;
        case "사전":
            return 21;
        case "만화":
            return 22;
        case "잡지":
            return 23;
        case "해외도서":
            return 24;
        case "유아":
            return 25;
        case "어린이":
            return 26;
        default:
            return 1;
    }
}
// 필요 module
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

// 필요 전역 변수
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

// ISBN코드로 책 데이터 검색
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
    console.log(content.items);

    request(content.items[0].link, (error, response, body) => {
        if (error) throw error;
        console.log("firstofall");
        let $ = cherrio.load(body);
        try {
            let cate = '';
            cate = $('#category_location1_depth').text();
            console.log("first" + cate);
            category = selectCate(cate);
            console.log("second" + category);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            var sql = 'INSERT INTO book_all (ISBN, book_name, img_src, author, publisher, public_date, more_url, read_date, category) VALUES(?,?,?,?,?,?,?,?,?)';
            console.log("third" + category);
            var params = [ISBN, content.items[0].title.toString(), content.items[0].image, content.items[0].author, content.items[0].publisher, content.items[0].pubdate, content.items[0].link, date, category];

            con.query(sql, params, function (err, rows, fields) {
                if (err)
                    console.log(err);
            })
        }
    });
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

// main 하루한권
app.get('/oneBook/', function (req, res) {

    console.log("oneBook");

    con.query('SELECT * FROM book_all WHERE ISBN = 9788932473901', function (error, rows, fields) {
        if (!!error)
            console.log(error);
        else {
            console.log(rows);
            res.send(JSON.stringify(rows));
        }
    })
})

// main 읽은 책 수
app.get('/readBook/:name', function (req, res) {
    //TEST
    console.log("get readBook");
    //new_date = "'" + date.substring(0,7) + "'";
    new_date = date.substring(0, 7);

    con.query('SELECT month_count FROM user_monthly where user_name = ? and read_ym = ?', [req.params.name, new_date], function (error, rows, fields) {
        if (!!error)
            console.log(error);
        else {
            console.log(rows);
            res.end(JSON.stringify(rows));
        }
    })
})

// 책 등록
app.post('/saveBook/', function (req, res) {
    //TEST
    console.log("get saveBook");
    var read_date = date.substring(0, 10);
    var user_name = '';
    var ISBN = '';
    var read_rate = 1;
    var category = 0;
    console.log(req.body);

    con.query('SELECT * FROM book_all where ISBN = ?', req.body.ISBN, function (error, rows, fields) {
        if (!!error) {
            console.log("error1");
            console.log(error);
            console.log(rows.category);
        }
        else {
            console.log("hello")
            console.log(rows);
            console.log(rows[0].category);
            category = rows[0].category;
            user_name = req.body.user_name;
            ISBN = req.body.ISBN;
            // console.log(req.body.read_rate);

            // if(req.body.read_rate == null){
            //     read_rate = 1;
            // }
            // else {
            // console.log(req.body.read_rate);
            // read_rate = req.body.read_rate;
            // }
            selectParams(user_name, ISBN, read_date, read_rate, category);
            res.end('success insert!');
        }
    });
})

function selectParams(user_name, ISBN, read_date, read_rate, category){
    var params = [user_name, ISBN, read_date, read_rate, category];
        con.query('INSERT INTO user_book (user_name, ISBN, read_date, read_rate, category) values (?,?,?,?,?)', params, function (error, rows, fields) {
            if (!!error) {
                console.log("error2");
                console.log(error);
            }
            else {
                console.log(rows);
            }
        })

}


// 개인 독서통계 - category
app.get('/statCategory/:name',function(req,res){
    
    //TEST
    console.log("statCategory");
    
    con.query('SELECT * FROM user_category where user_name = ? order by ca_count desc limit 3', req.params.name, function(error, rows, fields) {
        if(!!error)
            console.log(error);
        else{
            console.log(rows);
            res.send(JSON.stringify(rows));
        }
    })

})



// 개인 독서통계 - month
app.post('/statMonthly/', function(req,res){
    //TEST
    console.log("statMonthly");

    var read_ym = req.body.year + '%';

    con.query('select * from user_monthly where user_name = ? and read_ym like ? order by read_ym', [req.body.user_name, read_ym], function(error,rows,fields){
        if(!!error)
            console.log(error);
        else{
            console.log(rows);
            res.send(JSON.stringify(rows));
        }
    })
})

//지혜가한거
//내책장 - 제목 fetch
app.get('/myreadBook/:name', function (req, res) {

    console.log("myreadBook");

    con.query('select * from user_book join book_all on user_book.ISBN = book_all.ISBN where user_name = ? order by book_all.read_date ASC', [req.params.name], function (error, rows, fields) {
        if (!!error)
            console.log(error);
        else {
            console.log(rows);
            res.send(JSON.stringify(rows));
        }
    })
})

//'select * from user_book where user_name = ?'
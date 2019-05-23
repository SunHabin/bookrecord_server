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
    if(!!error)console.log("error"+error);
    else console.log("connected");
});

// data client로 보내기
app.get('/user',function(req, res){
    
    //TEST
    console.log("get select");

    con.query('SELECT * FROM user',function(error, rows, fields){
        if(!!error)console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    })
})
 
// insert
app.post('/user',function(req, res){
    
    //TEST
    console.log("post");
    
    con.query('INSERT INTO user SET ?', req.body, function(error, rows, fields){
        if(!!error)console.log(error);
        else{
            console.log(rows);
            res.send(JSON.stringify(rows));
        }
    })
})

app.get('/user/:user_name', function(req, res){
        
    //TEST
    console.log("get select");

    con.query('SELECT * FROM user WHERE user_name=?', req.params.user_name, function(error, rows, fields){
        if(!!error)console.log(error);
        else{
            console.log(rows);
            res.send(JSON.stringify(rows));
        }
    })
})

app.delete('/user/:user_name', function(req, res){
        
    //TEST
    console.log("delete");

    con.query('DELETE FROM user WHERE user_name=?', req.params.user_name, function(error, rows, fields){
        if(!!error)console.log(error);
        else{
            console.log(rows);
            res.end('success delete!');
        }
    })
})

app.put('/user',function(req, res){
    
    //TEST
    console.log("put");
    
    con.query('UPDATE user set email=?, age=? WHERE user_name=?',[req.body.email, req.body.age, req.body.user_name], function(error, rows, fields){
        if(!!error)console.log(error);
        else{ 
            console.log(rows);
            res.send(JSON.stringify(rows));
        }
    })
})


var sql = 'INSERT INTO topic (title, description, author) VALUES("Express", "Web framework", "jacob")';
conn.query(sql, function(err, rows, fields){
    if(err) console.log(err);
    console.log(rows.insertId); 
    // insertId는 auto_increment설정해 놓았다.
    //(고유한 식별자를 알아낼 수 있는 방법이다.)
});

//sql문을 하드코딩 하지 않고, ? 라는 치환자를 두어 코딩함
var sql = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?)';
var params = ['Supervisor', 'Watcher', 'graphittie'];
//파라미터를 값들로 줌(배열로 생성)
conn.query(sql, params, function(err, rows, fields){
    // 쿼리문 두번째 인자로 파라미터로 전달함(값들을 치환시켜서 실행함. 
    // 보안과도 밀접한 관계가 있음(sql injection attack))
    if(err) console.log(err);
    console.log(rows.insertId);
});
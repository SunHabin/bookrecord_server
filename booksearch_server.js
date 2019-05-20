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
    console.log("get");
    
    con.query('SELECT * FROM user',function(error, rows, fields){
        if(!!error)console.log('error');
        else{
            console.log(rows);
            res.send(rows);
        }
    })
})
 
// insert
app.post('/user',function(req, res){
    console.log("post");
    
    con.query('INSERT INTO user SET ?', req.body, function(error, rows, fields){
        if(!!error)console.log(error);
        else{
            console.log(rows);
            res.send(JSON.stringify(rows));
        }
    })
})
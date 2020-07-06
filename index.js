var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
const md5 = require("md5");

var app = express();

var config = {
    host : 'localhost', 
    user : 'username',
    password : 'password',
    database : 'db'
}

var connection = mysql.createConnection(config);
connection.connect(function(err){
    console.log("connected to the database");
});

// drop and create table
connection.query('DROP TABLE IF EXISTS accounts');
connection.query('CREATE TABLE accounts (email varchar(100) NOT NULL, password varchar(255) NOT NULL)');

// create a demo user
var demo_email = "somebody@gmail.com";
var demo_pass = md5("password");
connection.query('INSERT INTO accounts(email, password) VALUES(?, ?)', [demo_email, demo_pass]);



app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname+'/index.html'));
});


app.get('/welcome', (req, res)=>{
    res.sendFile(path.join(__dirname + '/welcome.html'));
});


app.get('/nowelcome', (req, res)=>{
    res.sendFile(path.join(__dirname + '/nowelcome.html'));
});


app.post('/auth', (req, res)=>{
    var email = req.body.email;
    var password = md5(req.body.password);
   
    if(email && password){
        connection.query('SELECT * FROM accounts WHERE email = ? AND password = ?', [email, password], (error, results)=>{
            if(results.length > 0){
                console.log("success!");
                res.redirect('/welcome');
            }else{
                console.log("wrong email/password!");
                res.redirect('/nowelcome');
            }
        });

    }
});


app.listen(3000, () => console.log('listening at 3000'));









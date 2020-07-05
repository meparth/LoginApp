var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');


var config = {
    host : 'localhost', 
    user : 'root',
    password : 'DingDong',
    database : 'users'
}

var connection = mysql.createConnection(config);
connection.connect(function(err){
    console.log("connected to the database.");
});

var app = express();

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
    var password = req.body.password;
    // res.redirect('/welcome');



    if(email && password){
        connection.query('SELECT * FROM accounts WHERE email = ? AND password = ?', [email, password], (error, results)=>{
            if(results.length > 0){
                console.log("SUCCESSSSSSS");
                res.redirect('/welcome');
            }else{
                console.log("NOOOOOOOOOO");
                res.redirect('/nowelcome');
            }
            // console.log(results);
            // res.redirect('/welcome');
        });



    }else{
        res.send('plis gib username and pass');
    }
});






app.listen(3000, () => console.log('listening at 3000'));









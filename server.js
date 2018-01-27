var express = require('express');
var bodyParser = require('body-parser');
var serverConfig = require('./serverConfig');
var mysql = require('mysql');
//var https = require('https');
//var fs = require('fs');

var app = express();
var port = serverConfig.port();
var ip = serverConfig.ipAddr();

app.use(bodyParser.json());

var conn = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "root",
	database:"SmartChef"
});	

conn.connect(function(err) {
	if(err) throw err;
	console.log(" Connected to Database! ");
});

app.get('/', function(req, res) {
	console.log(req);
	conn.query('SELECT * FROM dishes', function(err, results, fields) {
		if(err) throw err;
		res.json(results);
	});
});

app.post('/', function(req, res) {
	var postData = req.body.ingredients;
	var postData = postData.toString();
	var str_arr = postData.split(',');
	var str_mod = "";
	for(i = 0; i < str_arr.length; i++){
		if(i == 0){
			str_mod = "(ingredients LIKE '%"+str_arr[i].trim()+"%')";
		} else {
			str_mod = str_mod + " AND (ingredients LIKE '%"+str_arr[i].trim()+"%')";
		}
	}
	conn.query("SELECT * FROM dishes WHERE "+str_mod, function(err, results, fields) {
		res.json(results);
	});
});

app.listen(port, ip, function() {
	console.log("Server is Running!");
});


var express = require('express');
var mysql = require('mysql');

var db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Debu0210#',
	database: 'sps',
	debug: false,
	multipleStatements: true
});

db.connect(function(err){
	if(err) {
		throw err;
	}
	console.log('database connected!!');
});


const admin = require('firebase-admin');
var sleep = require('system-sleep');
var serviceAccount = require('./admin.json');
const { escapeRegExpChars } = require('ejs/lib/utils');
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://sps-iot-afb6d-default-rtdb.firebaseio.com/",
	authDomain: "sps-iot-afb6d-default-rtdb.firebaseio.com"
});

var db1 = admin.database();
var test = db1.ref("test");
function getTest() {
	// console.log(test)
	test.once('value', function(snap) {
		// res.status(200).json({"test": snap.val()}['test']['distanceInch']);
		var di = {"test": snap.val()}['test']['distanceInch'];
		var di2 = {"test": snap.val()}['test']['distanceInch2'];
		// var di = 0;
		// console.log({"test": snap.val()}['test']['distanceInch']);
		if(di >= 12)
			var data = `UPDATE parking SET sesnor = '0' WHERE code = '1'`;
		else
			var data = `UPDATE parking SET sesnor = '1' WHERE code = '1'`;
		var query = db.query(data, function(err, result) {
			if(err)
				throw err;
		});

		if(di2 >= 12)
			var data = `UPDATE parking SET sesnor = '0' WHERE code = '5'`;
		else
			var data = `UPDATE parking SET sesnor = '1' WHERE code = '5'`;
		var query = db.query(data, function(err, result) {
			if(err)
				throw err;
			else
				console.log('database updated!!');
		});
	});
};

while(1) {
	getTest();
	sleep(1*1000);
}
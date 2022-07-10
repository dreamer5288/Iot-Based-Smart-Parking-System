var express = require('express');
var expressSession = require('express-session');
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var schedule = require('node-schedule');

var app = express();

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
var serviceAccount = require('./admin.json');
const { escapeRegExpChars } = require('ejs/lib/utils');
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://sps-iot-afb6d-default-rtdb.firebaseio.com/",
	authDomain: "sps-iot-afb6d-default-rtdb.firebaseio.com"
});

// var di = 0;
var db1 = admin.database();
var test = db1.ref("test");
function getTest(res) {
	// console.log(test)
	test.once('value', function(snap) {
		console.log(1);
		res.status(200).json({"test": snap.val()});
		// var di = {"test": snap.val()}['test']['distanceInch'];
		// // var di = 0;
		// // console.log({"test": snap.val()}['test']['distanceInch']);
		// if(di >= 12)
		// 	var data = `UPDATE parking SET sesnor = '0' WHERE code = '5'`;
		// else
		// 	var data = `UPDATE parking SET sesnor = '1' WHERE code = '5'`;
		// var query = db.query(data, function(err, result) {
		// 	if(err)
		// 		throw err;
		// 	else
		// 		console.log('1');
		// 		// res.redirect('/');
		// });
		// var data = `UPDATE parking SET sensor = '1' WHERE code = '5'`;
	});
};
// app.use(express.bodyParser());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/', function(req, res) {
// 	getTest(res);
// 	//res.send(test);
// });


app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(expressSession({secret: 'my top secret code', saveUninitialized: true, resave: false}));
app.use('/assets',express.static('assets'));
app.use(express.static(__dirname + '/assets'));

// app.use(express.bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/data', function(req, res) {
	getTest(res);
	// console.log(di);
	// res.send ('di');
	// console.log(res);
	// res.send(res);
});

//

// var schedule = require('node-schedule');
var date = new Date('2022-04-15T23:43:14.545Z');
// var date = new Date('2022, 4, 16, 5, 4, 40');
schedule.scheduleJob(date, function(){
  console.log('The world is going to end today.');
});

var today = new Date();
var te = new Date(today.getTime() + 1*60000);
// console.log(te);

//

app.get('/', function(req, res) {
	res.redirect('/login');
});

app.get('/login', function(req, res) {
	if(req.session.auth === undefined) {
		req.session.auth = 0;
	}

	if(req.session.auth === 0) {
		res.render('login');
	}
	else if(req.session.auth === 1) {
		res.redirect('/admin');
	}
	else if(req.session.auth === 2) {
		res.redirect('/user');
	}
});

app.post('/login', function(req, res) {
	var email = req.body.email;
	req.session.email = email;
	var password = req.body.password;

	var data = `SELECT * FROM auth WHERE email = '${email}'`;
	var query = db.query(data, function(err, result) {
		if(err) {
			throw err;
		}
		else {
			if(result.length === 0) {
				res.redirect('/nousr');
			}
			else {
				bcrypt.compare(password, result[0]['password']).then(function(result1) {
					if(result[0]['id'] === 1) {
						if(result1) {
							req.session.auth = 1;
							res.redirect('/admin');
						}
						else {
							res.redirect('/nouser');
						}
					}

					else if(result[0]['id'] === 2) {
						if(result1) {
							req.session.auth = 2;
							res.redirect('/user');
						}
						else {
							res.redirect('/nouser');
						}
					}
				});
			}
		}
	});
});

app.get('/register', function(req, res) {
	if(req.session.auth === undefined) {
		req.session.auth = 0;
	}

	if(req.session.auth === 0) {
		res.render('register');
	}
	else if(req.session.auth === 1) {
		res.redirect('/admin');
	}
	else if(req.session.auth === 2) {
		res.redirect('/user');
	}
});

app.post('/register', function(req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var data = `SELECT * FROM auth WHERE email = '${email}'`;
	var query = db.query(data, function(err, result) {
		if(err) {
			throw err;
		}
		else if(result.length > 0) {
			res.redirect('/eae');
		}
		else if(result.length === 0) {
			bcrypt.hash(password, 10).then(function(hash) {
				var data1 = `INSERT INTO auth VALUES ('${name}', '${email}', '${hash}', '0', '0', '0', '0', '2')`;
				var query1 = db.query(data1, function(err1, result1) {
					if(err1) {
						throw err1;
					}
					else {
						res.redirect('/');
					}
				});
			});
		}
	});
});

app.get('/admin', function(req, res) {
	if(req.session.auth === 1) {
		var data = `SELECT * FROM parking`;
		var query = db.query(data, function(err, result) {
			if(err) {
				throw err;
			}
			else {
				// console.log(result);
				res.render('admin', {result: result});
			}
		});
	}
	else {
		res.redirect('/');
	}
});

app.get('/add', function(req, res) {
	if(req.session.auth === 1) {
		res.render('add');
	}
	else {
		res.redirect('/');
	}
});

app.post('/add', function(req, res) {
	if(req.session.auth === 1) {
		var loc = req.body.loc;
		var price = req.body.price;
		var data1 = `SELECT MAX(code) as code FROM parking; SELECT MAX(slot) as slot FROM parking WHERE loc = '${loc}';`;
		var query1 = db.query(data1, function(err1, result1) {
			if(err1) {
				throw err1;
			}
			else {
				var data = `INSERT INTO parking VALUES ('${loc}', '${result1[0][0]['code']+1}', '${result1[1][0]['slot']+1}', '${price}', '1', '0', '0')`;
				var query = db.query(data, function(err, result) {
					if(err) {
						throw err;
					}
					else {
						res.redirect('/');
					}
				});
			}
		});
	}
	else {
		res.redirect('/');
	}
});

app.get('/logout', function(req, res) {
	req.session.auth = 0;
	res.redirect('/');
});

app.get('/cbs/:code/:slot', function(req, res) {
	if(req.session.auth === 1) {
		var code = req.params.code;
		var slot = req.params.slot;
		if(slot === '1') {
			var data = `UPDATE parking SET status = '4' WHERE code = '${code}'`;
			var query = db.query(data, function(err, result) {
				if(err) {
					throw err;
				}
				else {
					res.redirect('/');
				}
			});
		}
		else if(slot === '4') {
			var data = `UPDATE parking SET status = '1' WHERE code = '${code}'`;
			var query = db.query(data, function(err, result) {
				if(err) {
					throw err;
				}
				else {
					res.redirect('/');
				}
			});
		}
	}
	else {
		res.redirect('/');
	}
});



// user

app.get('/user', function(req, res) {
	if(req.session.auth === 2) {
		// console.log(req.session.email);
		var data = `SELECT p_code FROM auth WHERE email = '${req.session.email}'; SELECT * FROM parking;`
		var query = db.query(data, function(err, result) {
			if(err) {
				throw err;
			}
			else {
				if(result[0][0]['p_code'] === 0) {
					// console.log(result);
					res.render('user', {result: result});
				}
				else {
					var data1 = `SELECT p_code FROM auth WHERE email = '${req.session.email}'; SELECT * FROM parking; SELECT * FROM parking WHERE code = '${result[0][0]['p_code']}'`;
					var query1 = db.query(data1, function(err1, result1) {
						if(err1) {
							throw err1;
						}
						else {
							// console.log(result1);
							res.render('user', {result: result1});
						}
					});
				}
			}
		});
		
	}
	else {
		res.redirect('/');
	}
});

app.get('/book/:code', function(req, res) {
	if(req.session.auth === 2) {
		var code = req.params.code;
		var data = `SELECT * FROM parking WHERE code = '${code}'`;
		var query = db.query(data, function(err, result) {
			if(err)
				throw err;
			else
				res.render('book', {result: result});
		});	
	}
	else {
		res.redirect('/');
	}
});

app.post('/book', function(req, res) {
	var code = req.body.code;
	var hour = req.body.hour;
	var price = req.body.price;
	var today = new Date()
	var h = (today.getHours()+parseInt(hour))%24
	var m = today.getMinutes()
	var et = h+":"
	if(h < 10)
		et = 0 + et
	if(m < 10)
		et = et + 0
	et = et + m
 	var data = `UPDATE auth SET p_code = '${code}' WHERE email = '${req.session.email}'; UPDATE	parking SET status = '${2}', et = '${et}' WHERE code = '${code}'`;
 	var query = db.query(data, function(err, result) {
 		if(err)
 			throw err;
 	});

 	var af15 = new Date(today.getTime() + 15*60000);
 	schedule.scheduleJob(af15, function(){
 		data = `SELECT * FROM parking WHERE code = '${code}'`;
 		query = db.query(data, function(err, result) {
 			if(err)
 				throw err;
 			else {
 				if(result[0]['sesnor'] === 1) {
 					var data1 = `UPDATE auth SET d_amount = d_amount + ${hour*price}, p_code = '0' WHERE email = '${req.session.email}'; UPDATE parking SET status = '3' WHERE code = '${code}'`;
 					var query1 = db.query(data1, function(err1, result1) {
 						if(err1)
 							throw err1;
 						schedule.scheduleJob(new Date(today.getTime() + hour*60000), function() {
 							var data2 = `UPDATE auth SET p_code = '0' WHERE email = '${req.session.email}'; UPDATE parking SET status = '1', et = '0' WHERE code = '${code}'`;
 							var query2 = db.query(data2, function(err2, result2) {
 								if(err)
 									throw err;
 							});
 						});
 					});
 				}
 				else {
 					var data1 = `UPDATE auth SET p_code = '0', d_amount = d_amount+50 WHERE email = '${req.session.email}'; UPDATE parking SET status = '1', et = '0' WHERE code = '${code}'`;
 					var query1 = db.query(data1, function(err1, result1) {
 						if(err1)
 							throw err1;
 					});
 				}
 			}
 		});
	});
 	res.redirect('/');
});

app.get('/pay', function(req, res) {
	if(req.session.auth === 2) {
		var data = `SELECT d_amount FROM auth WHERE email = '${req.session.email}'`;
		var query = db.query(data, function(err, result) {
			if(err)
				throw err;
			else
				res.render('pay', {result:result});
		});
	}
	else {
		res.redirect('/');
	}
});

app.post('/pay', function(req, res) {
	var data = `UPDATE auth SET d_amount = '0' WHERE email = '${req.session.email}'`;
	var query = db.query(data, function(err, result) {
		if(err)
			throw err;
		else
			res.redirect('/');
	});
});

app.listen(3000, function(req, res) {
	console.log('server started!!')
});
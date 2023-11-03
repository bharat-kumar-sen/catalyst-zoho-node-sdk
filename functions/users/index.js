'use strict';

// Add libraries and depedencies
require("dotenv").config();

// Initialize express js
const express = require('express');
const app = express();
var bodyParser = require('body-parser')
var cors = require("cors");
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRETKEY,
  proxy: true,
  resave: true,
  saveUninitialized: true
}));
/* 
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-type,Accept,x-access-token,X-Key');
	if (req.method == 'OPTIONS') {
		res.status(200).end();
	} else {
		next();
	}
});
 */

app.use(
  cors({
    origin: ["http://localhost:4200", 'https://appsail-50016224023.development.catalystappsail.in', 'https://catalyst-mean-app-60024458376.development.catalystserverless.in'],
    credentials: true,
  })
);

const usersCtl = require('./controllers/usersController');
app.post('/', async(req,res) => {
  if(usersCtl[req.query.api_type]) {
		usersCtl[req.query.api_type](req,res)
	} else {
		res.status(400).json({message: 'There are no api found please check in server'})
	}
});

app.get('/', async(req,res) => {
  if(usersCtl[req.query.api_type]) {
		usersCtl[req.query.api_type](req,res)
	} else {
		res.status(400).json({message: 'There are no api found please check in server'})
	}
});

// app.delete('/:id', async(req,res) => {
//   console.log('delete=======', req.params.id)
//   if(usersCtl[req.query.api_type]) {
// 		usersCtl[req.query.api_type](req,res)
// 	} else {
// 		res.status(400).json({message: 'There are no api found please check in server'})
// 	}
// });

// Export module
module.exports = app;
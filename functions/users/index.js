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
app.use(
  cors({
    origin: ["http://localhost:4200"],
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
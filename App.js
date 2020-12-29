#!/usr/bin/env node

// setting dotenv
require('dotenv').config()

var express = require('express'),
app = express(),
chalk = require('chalk'),
options  = require('minimist')(process.argv.slice(2)),
axios = require('axios'),
rateLimit = require("express-rate-limit"),
api = 'https://api.github.com/graphql',
port = process.env.PORT || options.port || options.p || 3000,
reqLimit = process.env.LIMIT ||  options.limit || options.l || 50,
token = process.env.TOKEN || options.token || options.t;
// limit 
limiter = rateLimit({
	windowMs: 30 * 60 * 1000, // 15 minutes
	max: reqLimit*2, 	
	message:'Your Limit Has Exceeded'
});









// logger 
function logger(message){
    console.log(chalk.bgYellow.red(`(LOG):${Date()}:${message}`))
}    
logger.req = (message,req) => {
    console.log(chalk.bgYellow.blue(`(REQUEST):${Date()}:Ip : ${req.ip} : ${message}`))
}
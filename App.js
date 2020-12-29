#!/usr/bin/env node

// setting dotenv
require('dotenv').config()

var express = require('express'),
app = express(),
chalk = require('chalk'),
options  = require('minimist')(process.argv.slice(2)),
axios = require('axios'),
api = 'https://api.github.com/graphql',
token = process.env.TOKEN || options.token || options.t;
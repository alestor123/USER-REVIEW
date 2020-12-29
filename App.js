#!/usr/bin/env node

// setting dotenv
require('dotenv').config()

var express = require('express'),
app = express(),
chalk = require('chalk'),
pck = require('./package.json'),
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

// cli 
if(options.v || options.version){
    console.log( `${pck.version}`)
  process.exit(1);
}
else if (options.h || options.help) { // checking undifined args
    console.log(`
	Usage: ${pck.name} -p <Port Number> -t <Token> -l <Limit Number> 
	-t , --token    for setting tokn
	-l , --limit setting request limit
	-p , --port setting port number
	-v , --version for showing cli version
	-i , --issue for reporting web page (any issue or bugs)
`);
process.exit(0)
}
else if (options.i || options.issue) { // checking undifined args
  console.log(`
  Issues at ${pck.bugs.url} 
`);
process.exit(0)
}

else{
	app.listen(port, () => logger(`Server running at ${port}`))
}
// setting axios header auth 
if (token) {// add express limit 
    axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
    logger(`Got Token ${token}`)
}
app.get('/github', (req,res) => {
	res.redirect(pck.homepage)
	logger.req('Redirect',req)
})
app.get('/user/:name',limiter, (req, res) => {
    logger.req(`Name : ${req.params.name}`,req)
    axios.post(api, 
        {query: `
              query userInfo($login: String!) {
                user(login: $login) {
                  name
                  login
                  contributionsCollection {
                    totalCommitContributions
                    restrictedContributionsCount
                  }
                  repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
                    totalCount
                  }
                  pullRequests(first: 1) {
                    totalCount
                  }
                  issues(first: 1) {
                    totalCount
                  }
      
                  repositories(first: 100, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}) {
                    totalCount
                    nodes {
                      stargazers {
                        totalCount
                      }
                    }
                  }
                }
              }
              `,variables: { login: req.params.name },})
      .then((response) => {
        console.log(response.data.data.user.issues);
        res.json(response.data.data)
      })
      .catch((error) => {
        res.send(error)
        logger.err(error)
      });

})

// logger 
function logger(message){
    console.log(chalk.bgYellow.red(`(LOG):${Date()}:${message}`))
}    
logger.req = (message,req) => {
    console.log(chalk.bgYellow.blue(`(REQUEST):${Date()}:Ip : ${req.ip} : ${message}`))
}
logger.err = (message) => {
    console.error(chalk.bgRed.green(`(ERROR):${Date()} : ${message}`))
}
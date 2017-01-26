// load the mysql library
var mysql = require('promise-mysql');
var rpass = require('./temp/rootpass.js')
var reddit = require('./reddit');

// create a connection to our Cloud9 server
var redditdb = mysql.createPool({
  host: 'localhost',
  port: 8889,
  user: 'root',
  password: rpass,
  database: 'reddit_api',
  connectionLimit: 10
});
//passing my DB to my reddit api function
var redditAPI = reddit(redditdb);

// requests...now with promises!!!
redditAPI.createUser({
  username: 'mumfordsAndSonswitacreamcheezz',
  password: 'wasup12123'
})
.then(function(res){
  return redditAPI.createPost({
    title: 'hi reddit!',
    url: 'https://www.reddit.com',
    userId: res.id
  })
})
.then(function(res){
  console.log(res)
})
.catch(function(err){
  console.log(err,'error fiddy five / ERROR 55')
})

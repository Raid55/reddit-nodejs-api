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

// redditAPI.createUser({
//   username: 'mumfordsAndSonswitacreamcheezz',
//   password: 'wasup12123'
// })
// .then(function(res){
//   return redditAPI.createPost({
//     title: 'hi reddit!',
//     url: 'https://www.reddit.com',
//     userId: res.id
//   })
// })
// .then(function(res){
//   console.log(res)
// })
// .catch(function(err){
//   console.log(err,'error fiddy five / ERROR 55')
// })

// redditAPI.createPost({
//   title: 'CSGO PRO SCENE CALLED A JOKE BY MORGAN FREEMAN',
//   url: 'https://MorganFreeman.org.co.uk',
//   userId: 1,
//   subId: 1
// })

redditAPI.getAllPosts()
.then(function(res){
  console.log(res);
})
.catch(function(err){
  console.log(err);
})

// redditAPI.getAllPostsForUser(1)
// .then(function(res){
//   console.log(res);
// })
// .catch(function(err){
//   console.log(err);
// })

// redditAPI.getSinglePost(8)
// .then(function(res){
//   console.log(res);
// })
// .catch(function(err){
//   console.log(err);
// })

// redditAPI.getAllSubreddits()
// .then(function(res){
//   res.forEach(function(el){
//     console.log(el);
//   })
// })
// .catch(function(err){
//   console.log(err);
// })

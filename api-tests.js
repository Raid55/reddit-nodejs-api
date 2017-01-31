// load the mysql library
var mysql = require('promise-mysql');
var rpass = require('./temp/rootpass.js')
var reddit = require('./redditSQLCalls');

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

redditAPI.createPost({
  title: 'cute doge again',
  url: 'https://dogesallday.net',
  userId: 8,
  subId: 1
})
.then(console.log)
//
// redditAPI.createPost({
//   title: 'alt LEFT?!?!?',
//   url: 'https://inforwars.net',
//   userId: 3,
//   subId: 1
// });
// redditAPI.createPost({
//   title: 'ABSOLUTE HITLER',
//   url: 'https://CONSPIRASISES.org',
//   userId: 4,
//   subId: 1
// });
// redditAPI.getAllPosts({
//   sortingMethod: 'top'
// })
// .then(console.log)
// .then(function(res){
//   console.log(res);
// })
// .catch(function(err){
//   console.log(err);
// })

// redditAPI.createComment({
//   text:'cringy kid,lolol',
//   postId: 13,
//   userId: 7,
//   parentId: 3
// })
// .then(function(res){
//   console.log(res);
// })
// .catch(function(err){
//   console.log(err);
// })

// redditAPI.getCommentsForPosts(13)
// .then(console.log)
// .catch(console.log)


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

// redditAPI.createVoteorUpdate({
//   postId: 10,
//   userId: 6,
//   vote: 1
// })

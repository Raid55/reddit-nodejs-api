var express = require('express');
var app = express();
var mysql = require('promise-mysql');
var rpass = require('./temp/rootpass.js');
var reddit = require('./redditSQLCalls');
var bParse = require('body-parser');


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
//app.uses////////////////
app.use('/files', express.static('static_files'))
app.use(bParse.json());
app.use(bParse.urlencoded({
  extended: true
}));
app.set('view engine', 'pug');
//////////////////////////
//exercise 1 and 2
app.get('/hello', function (req, res) {
  if (!req.query.name){
    res.send('<h1>Hello World Mr.Anonymous!</h1>');
  }else{
    res.send(`<h1>Hello World ${req.query.name} </h1>`)
  }
});
app.get('/test', function(req, res) {
  res.render('post-list.pug');
});
//exercise 2b
app.get('/hello/:tagId', function(req, res) {
  res.send(`<h1>Hello World ${req.params.tagId} </h1>`);
});

//exercise 3
app.get('/calculator/:tagId', function(req, res) {
  var tempObj = {
    operator: req.params.tagId,
    firstOperand: +req.query.num1,
    secondOperand: +req.query.num2
  }
  if(tempObj.operator === 'add'){
    tempObj.solution = tempObj.firstOperand + tempObj.secondOperand;
    res.send(JSON.stringify(tempObj));
  }else if(req.params.tagId === 'sub'){
    tempObj.solution = tempObj.firstOperand - tempObj.secondOperand;
    res.send(JSON.stringify(tempObj));
  }else if(req.params.tagId === 'div'){
    tempObj.solution = tempObj.firstOperand / tempObj.secondOperand;
    res.send(JSON.stringify(tempObj));
  }else if(req.params.tagId === 'mult'){
    tempObj.solution = tempObj.firstOperand * tempObj.secondOperand;
    res.send(JSON.stringify(tempObj));
  }else{
    tempObj.solution = 'There was an error'
    res.status(400).send(tempObj)
  }
});
//
redditAPI.getAllPosts({
  sortingMethod: 'top',
  numPerPage: 5
})
//exercise 4
app.get('/posts/:tagId',function(req,res){
  redditAPI.getAllPosts({
    sortingMethod: req.params.tagId,
    numPerPage: +req.query.limit
  })
  .then(function(res1){
    res.render('post-list', {posts: res1});
  })
  .catch(function(err){
    res.status(400).send(err)
  })
})
//ex 5
app.get('/createContent', function(req,res){
  res.render('create-content.pug');
})
//ex 6
app.post('/createContent', function(req,res){
  redditAPI.createPost({
    title: req.body.title,
    url: req.body.url,
    userId: 10,
    subId: 1
  })
  .then((res1) => res.redirect(`post/${res1.id}`))
  .catch(() =>  res.status(400).send(`<h1>ERROR, that was an error... try again later :(</h1>`))
})
//ex 6 challenge
app.get('post/:id', function(req,res){
  redditAPI.getSinglePost(+req.params.id)
  .then(function(res1){
    res.send(`
<div id="contents">
  <h1><a href="${res1.url}">${res1.title}</a></h1>
  <p>Created by ${res1.user.username}</p>
</div>`)
  })
  .catch(function(err){
    res.status(400).send(`<h1>ERROR, that was an error... try again later :(</h1>`)
  })
})
//ex7
/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */
app.get('/testing',function(req,res){
  res.render('layout.pug')
})
// Boilerplate code to start up the web server
var server = app.listen(5555, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log(`Example app listening at http://localhost:${port}`);
});

// res.send(res1.reduce(function(accu,el,indx){
//   accu += `
//   <li class="content-item">
//   <h2 class="content-item__title">
//     <a href="`+el.url+`">`+el.title+`</a>
//   </h2>
//   <p>Created by `+el.user.username+`</p>
//   </li>`
//   return accu;
// },`<div id="contents">
// <h1>List of contents</h1>
// <ul class="contents-list">`) +`</ul></div>`)

var express = require('express');
var app = express();

//exercise 1 and 2
app.get('/hello', function (req, res) {
  if (!req.query.name){
    res.send('<h1>Hello World Mr.Anonymous!</h1>');
  }else{
    res.send('<h1>Hello World '+ req.query.name +'</h1>')
  }

});
//exercise 2b
app.get('/hello/:tagId', function(req, res) {
  res.send('<h1>Hello World '+ req.params.tagId +'</h1>');
});
//renegade functions

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
    res.send(JSON.stringify(tempObj));
  }
});

//exercise 4


/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
var server = app.listen(5555, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

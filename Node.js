'use strict';
var http = require('http');
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/app'));


/*app.use(function(req, res) {
  if(req.url=='/payment'){
    doPayment(req, res);
  }else if(req.url == '/process'){
    sendPayment(req,res);

  }else
    res.sendFile(__dirname + '/app/index.html');
  });*/


var braintree = require('braintree');

var bodyParser = require('body-parser');
var parseUrlEnconded = bodyParser.urlencoded({
  extended: false
});

var gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId:   '28shvz44bvxycg6s',
    publicKey:    'r5bgkvdfdtc8f4px',
    privateKey:   'b2304dfd5abf1290492cd5aaec79dfd0'
});


app.get('/deliveryRequest', function (request, response) {
  console.log('Thank you for requesting me');
  response.header('Access-Control-Allow-Origin', '*');
  response.header( 'Access-Control-Allow-Credentials', true);
  response.header ('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  response.header ('Access-Control-Allow-Headers', 'Content-Type');


  gateway.clientToken.generate({}, function (err, res) {
    var outputdata = {token:res.clientToken};
  
   response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify( outputdata));
  });
console.log("SecondVal");
});

app.post('/process', parseUrlEnconded, function (request, response) {

 response.header('Access-Control-Allow-Origin', '*');
  response.header( 'Access-Control-Allow-Credentials', true);
  response.header ('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  response.header ('Access-Control-Allow-Headers', 'Content-Type');
 
  var transaction = request.body;
  console.log("Payment amt: "+transaction.amount);
  console.log(transaction.payment_method_nonce);

  gateway.transaction.sale({
    amount: transaction.amount,
    paymentMethodNonce: transaction.payment_method_nonce
  }, function (err, result) {

    if (err) {
      /*//throw err;
      var outputdata = {message:"Error occurred inside server"};
      response.setHeader('Content-Type', 'application/json');
      response.send(JSON.stringfy(outputdata));*/
      console.log("Sorry!! the server is not started.");
    }
    if (result.success) {

      /*console.log(result);
      console.log("Success");
      var outputdata = {message:"Successfully sent"};
      response.setHeader('Content-Type', 'application/json');
      response.send(JSON.stringfy(outputdata));*/
       response.writeHead(302, {
          'Location': '/#/deliveryRequest?msg=psuccess'
        });
        response.end();

    /* response.sendFile('home/dashboard.html', {
        root: './app'
      });*/
      
      console.log("Successfully sent your amount");
    } else {
      /*console.log("Hi else condition");
           var outputdata = {message:"Successfully failed"};
          response.setHeader('Content-Type', 'application/json');
          response.send(JSON.stringfy(outputdata));*/
           response.writeHead(302, {
          'Location': '/#/deliveryRequest?msg=pfailed'
           });
           response.end();
         /* response.sendFile('home/dashboard.html', {
          root: './app'
           });*/
      
          console.log("Sorry!! May be the server was not started or the amount you entered is too high");


      }

    }
  );

});

app.get('/', function (request, response) {
      response.sendFile('index.html', {
        root: './app'
      });
  });

app.listen(9000, function () {
  console.log('Listening on port 9000');
});

module.exports = app;
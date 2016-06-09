'use strict';

var express = require('express');
var app = express();

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



app.get('/payment', function (request, response) {

  gateway.clientToken.generate({}, function (err, res) {
    yetiBraintreeClientToken = res.clientToken;
    response.send(res.clientToken);
  });

});

app.post('/process', parseUrlEnconded, function (request, response) {

  var transaction = request.body;

  gateway.transaction.sale({
    amount: transaction.amount,
    paymentMethodNonce: transaction.payment_method_nonce
  }, function (err, result) {

    if (err) {
      //throw err;
      var outputdata = {message:"Error occurred inside server"};
      response.setHeader('Content-Type', 'application/json');
      response.send(JSON.stringfy(outputdata));
    }
    if (result.success) {

      console.log(result);
      console.log("Success");
      var outputdata = {message:"Successfully sent"};
      response.setHeader('Content-Type', 'application/json');
      response.send(JSON.stringfy(outputdata));
    } else {
      console.log("Hi else condition");
           var outputdata = {message:"Successfully failed"};
          response.setHeader('Content-Type', 'application/json');
          response.send(JSON.stringfy(outputdata));
      }

    }
  );

});

app.listen(8000, function () {
  console.log('Listening on port 8000');
});

module.exports = app;
'use strict';
var http = require('http');
//var nodemailer = require('nodemailer');
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



/*var Firebase = require('firebase');


firebase.initializeApp({
   serviceAccount: {
    projectId: "x-press-yeti",
    clientEmail: "xpressyeti@x-press-yeti.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCiR6tHLMyf4SRv\npDBxoZaYl8ux5QUngDD652A3k3ShUScMmSr+Vp/89NOEuw8YmawaGnMvJ9qVtCDE\nDX4BM2i9CgUYqJ6KUBXIWQM+eX7XGFNW6TjRbbMvcInWctfqzenrX7nTwk0yaVAB\n1ttC6Mbmvn3yI1atdidh1BD+xLrS5MbXoR1CMICVrbJhCsawSIbw8xzOxnYRvJiw\nVsdt7wLFQKFZRfPHSGnWjE310rF++pATxQ3vgSYe7/GlgHrRAMP0//rqJyidRzK9\nJIoMGFY5Wzk3OXKcprMTGKEQwzDi9rHqWazpIr+Bl50x7c0ll2FiR7tHgEnHk+vK\nV+JBaipVAgMBAAECggEAMCsv1u+gSXCtvQmya3g4WFDuYH6HWiM95qvZLoXxX5TU\nD3RDg704vf/57PMNVxL+N71UJVIiGr+d3jPXDAozc7FOs/QRIyMEZDSvttKfaL9K\ntYiCmf+C6XjxIRtzpbm7TmdapFWPToBeBD2/VYv8xi8S+VWt+80PgYVOCiFhBwnx\nvGYLdo4qj0zaAz91TcjzBQzoGpjhIu3xcPWKOcjLxiBxLHIJXmuwWrLn3CInGUoX\nMkrkbWML0bGgemOeHI26vjl7H8VYxlfIR8BhRkcwnrh4GC45iPfE3Y2uS2GfCj+O\nNZcWu8/beE6/EPqQroVW6EjTHCGIh8DyeI8V88HLAQKBgQDgrRV81OmBO5JVo6oV\nSoiHzLX87J5FKrRCI5PcJP9ohM6yXTn+Rhm/dVagBLNhUEWfMtzqJs0/s+v2XO+G\nKzJkpScpSFTnl79+9C/ePUaJKR/1YucFiycoa7+hWsY2UsL+lsc0PHcO/TAidzQa\nG8efWGb/JbVCHAKrd1Jgqz9clQKBgQC455qQo+VZbO7uJHdi9guTn/7jpNGdikfG\n9pSiGSpGegewhBCevDeJzcaQGDvDDLL15o0dxCgFQVGs7dcoQjbEHhYZnRPZWg/m\nOE5r5QcCCITD/D63WoTEr0n/oZCqw2Lfb8UbREPku839hC6uscV5dBGeat/1bT+1\nnK71tjpmwQKBgQCeCACSMmwf81fllt3eZfOMmWf0hDZ67iOmVcH92aQwzyFYAgz1\nljcsHQuWOFg3/a9K4ArVQ/+gbBxvyETN+XpTonreJbtavrj6QiWdSzpe5adOAYf/\ntTYQz2EVzHSY5zOywTlSu6j+yQXfaDsklh+eLB8eHlbVLkCOfLpbtng11QKBgD+l\nCKDMqT70rfEugCGCC04O/k8hBj2xwS8M5PA+tTx4+HibnJTmuD8oozYqATgMAPV/\nHAeo4xWb/B8H5s0mrW8n4/eBB7oCtAJMU0H0HUtn3zsOcg/uilCg/VmOJRuCEWBT\nOoc+IhhzRF4Ex4S+D/jUKNRceSYjKpC6k8ZjqQqBAoGAXOVUcKvM18XXWJUYZs/G\nTNnXjuxmfoXSk8Wajff8BXaP+nqIKIq5pHFe0HYyxqIofDNs7euxqaZBRnc2kdPs\n4wgt65e3vUoaGN2YpDk9oZCwg4bWfcXrUejIYQ7/rGi9tkbDqRhZZrChoJPLrpcD\nk/I7IS5qYboXj5Ah5fMqGVQ=\n-----END PRIVATE KEY-----\n"
  },
  databaseURL: "https://x-press-yeti.firebaseio.com/"
});
*/


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
          'Location': '/#/home?msg=psuccess'
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
          'Location': '/#/home?msg=pfailed'
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
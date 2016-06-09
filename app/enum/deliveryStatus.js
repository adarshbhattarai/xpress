var app = angular.module('myApp.enum',[]);
app.constant('Constants', {
    Status: {
        pending: 'pending',
        accepted: 'accepted',
        delivered: 'delivered',
        onRoute: 'onRoute',
        cancelled:'cancelled',
        rejected:'rejected'
    }
}); 
/**
 * Created with JetBrains PhpStorm.
 * User: R5596333
 * Date: 11/03/13
 * Time: 17:36
 * To change this template use File | Settings | File Templates.
 */
var express = require('express');
var app = express();
var data = require('./SGTransport.js');

app.listen(3000);
console.log('Listening on port 3000');
/// Routes
function dataCallback(res) {
    return function (err, data) {
        if (err) {
            res.send({error:err});
        } else {
            // Il serait intéressant de fournir une réponse plus lisible en
            // cas de mise à jour ou d'insertion...
            res.send(data);
        }
    }
}

// Lecture, via GET
//app.get('/bills', function(req, res) {
//    data.listBills(dataCallback(res));
//});
//
//app.get('/bills/:id', function(req, res) {
//    data.getBill(req.params.id, dataCallback(res));
//});
//
//app.get('/clients', function(req, res) {
//    data.listClients(dataCallback(res));
//});
//
//app.get('/clients/:id', function(req, res) {
//    data.getClient(req.params.id, dataCallback(res));
//});

app.get('/products', function (req, res) {
    data.listProducts(dataCallback(res));
});

//app.get('/products/:id', function(req, res) {
//    data.getProduct(req.params.id, dataCallback(res));
//});

// Ajout et suppression de produits sur une facture, via POST

//app.post('/bills/:billId/add/:productId', function(req, res) {
//    data.addProductToBill(req.params.billId, req.params.productId,
//        dataCallback(res));
//});
//
//app.post('/bills/:billId/remove/:productId', function(req, res) {
//    data.removeProductFromBill(req.params.billId, req.params.productId,
//        dataCallback(res));
//});

// Mise à jour via POST
//app.post('/bills/:id', function(req, res) {
//    data.updateBill(req.params.id, req.body, dataCallback(res));
//});

app.post('/products/:id', function (req, res) {
    data.updateProduct(req.params.id, req.body, dataCallback(res));
});

app.post('/products', function (req, res) {
    data.insertProduct(req.body, dataCallback(res));
});


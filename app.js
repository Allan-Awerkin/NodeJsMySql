/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path')
    , data = require('./SGTransport.js');
;

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

//app.get('/', routes.index);
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

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

app.get('/products', function (req, res) {
    data.listProducts(dataCallback(res));
});

app.post('/products/:id', function (req, res) {
    data.updateProduct(req.params.id, req.body, dataCallback(res));
});

app.post('/products', function (req, res) {
    data.insertProduct(req.body, dataCallback(res));
});
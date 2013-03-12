/**
 * Created with JetBrains PhpStorm.
 * User: R5596333
 * Date: 11/03/13
 * Time: 16:21
 * To change this template use File | Settings | File Templates.
 */
// On utilise notre enveloppe sur node-mysql
var db = require('./db.js');

// On veut pouvoir tester la validité des noms de colonnes pour se protéger
// des injections SQL.
var columnNameRegex = /^([a-zA-Z0-9_$]{1,64}\.)?[a-zA-Z0-9_$]{1,64}$/;
function checkColumnName(name) {
    return columnNameRegex.test(name);
}

function checkColumns(obj) {
    for (var key in obj) {
        if (!checkColumnName(key)) {
            return false;
        }
    }
    return true;
}

exports.listProducts = function (callback) {
    db.findAll('requests', callback);
}

// Pour la création et la mise à jour, on ajoute une vérification
// pour les noms de colonne.
exports.insertProduct = function (values, callback) {
    if (checkColumns(values)) {
        db.insert('requests', values, callback);
    } else {
        callback('Invalid column name', null);
    }
}

exports.updateProduct = function (id, values, callback) {
    if (checkColumns(values)) {
        db.updateById('requests', id, values, callback);
    } else {
        callback('Invalid column name', null);
    }
}


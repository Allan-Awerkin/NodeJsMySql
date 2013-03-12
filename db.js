// On utilise le module node-mysql
var mysql = require('mysql');

// Module natif filesystem pour lire le fichier de configuration
var fs = require('fs')

// On utilise fs.readFileSync, qui est un appel bloquant : en effet, cette
// commande ne sera utilis�e qu'une fois au chargement de ce module, et nous
// avons besoin des informations contenues dans le fichier pour configurer
// notre client.
var config = JSON.parse(fs.readFileSync('./mysql-config.json'));

// On initialise un nouveau client qui exécutera nos requêtes, en lui passant
// l'objet config précédemment initialisé.
var client = new mysql.createConnection(config);

// On se connecte � la base de donn�es. Un programme node.js ne poss�de qu'un
// seul thread d'ex�cution, nous n'avons donc pas besoin de nous inqui�ter
// des probl�mes de concurrence.
client.connect();

// Nous d�clarons quelques fonctions utilitaires
function hashToClause(hash, separator) {
    var result = '';
    var values = [];
    var first = true;
    for (var key in hash) {
        result += (first ? '' : separator) + key + ' = ?';
        values.push(hash[key]);
        first = false;
    }
    return { clause:result, values:values };
}

// Nous pouvons � pr�sent �crire les fonctions CRUD qui seront expos�es par
// le module

// L'insertion prend en param�tres
// - le nom de la table
// - Un hash ayant pour cl�s les noms de colonnes, pour valeurs les valeurs
// associ�es respectives
// - Un callback (optionnel) au format function(err, data)
function insert(table, values, callback) {
    // On construit la requ�te dynamiquement
    var q = 'INSERT INTO ' + table + ' SET ';
    var clause = hashToClause(values, ', ');
    q += clause.clause + ';';
    // On envoie la req�ete avec le callback fourni.
    // Les param�tres dans clause.values sont automatiquement �chapp�s.
    client.query(q, clause.values, callback);
}

// La suppression prend en param�tres :
// - La table sur laquelle elle est effectu�e
// - Un hash ayant pour cl�s les colonnes contraintes, pour valeurs les
// contraintes. Les diff�rentes contraintes sont des �galit�es li�es par des
// 'AND'.
function remove(table, where, callback) {
    var q = 'DELETE FROM ' + table + ' WHERE ';
    var clause = hashToClause(where, ' AND ');
    q += clause.clause;
    client.query(q, clause.values, callback);
}

// La lecture prend les m�mes param�tres que la suppression � l'exception
// du troisi�me qui pr�cise les colonnes qui sont ramen�es dans un tableau.
// si le param�tre est null, on ex�cute un SELECT *
function read(table, where, columns, callback) {
    var columnsClause = (columns ? columns.join(', ') : '*');
    var q = 'SELECT ' + columnsClause + ' FROM ' + table;
    if (where) {
        var clause = hashToClause(where, ' AND ');
        q += ' WHERE ' + clause.clause;
    }
    client.query(q, (where ? clause.values : callback), callback);
}

// la mise � jour prend les param�tres suivants :
// - table
// - hash where (identique read, delete)
// - hash values (identique insert)
// - callback
function update(table, where, values, callback) {
    var whereClause = hashToClause(where, ' AND ');
    var valuesClause = hashToClause(values, ' AND ');
    var q = 'UPDATE ' + table + ' SET ' + valuesClause.clause + ' WHERE ' +
        whereClause.clause + ';';
    client.query(q, whereClause.values.concat(valuesClause.values), callback);
}

// On expose maintenant les m�thodes au travers de l'objet exports
exports.insert = insert;
exports.remove = remove;
exports.read = read;
exports.update = update;

// On peut simplifier les op�rations courantes (liste, modification via
// l'id, etc.) avec les fonctions suivantes.
exports.updateById = function (table, id, values, callback) {
    update(table, { 'id':id }, values, callback);
}

exports.find = function (table, id, callback) {
    read(table, { 'id':id }, null, callback);
}

exports.removeById = function (table, id, callback) {
    remove(table, { 'id':id }, callback);
}

exports.findAll = function (table, callback) {
    read(table, null, null, callback);
}

// Dans certains cas les m�thodes CRUD simples ne suffisent pas � obtenir le
// r�sultat escompt�. On donne donc acc�s � la m�thode query pour pouvoir
// utiliser du SQL directement si besoin est.
exports.query = function (query, values, callback) {
    return client.query(query, values, callback);
}
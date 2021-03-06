
//metodos que sao exportados

module.exports = {
    selectAll:    dbSelectAll,
    selectOne:    dbSelectOne,
    executeQuery: dbExecuteQuery
}

///////////////////////////////////////////////////////////////////////////////////////////
///
/// Database config
///
var pg = require('pg');
//var connString = "pg://postgres:poqw12@localhost:5432/datastore";
//var connString = "pg://esuoljgnhhpspg:a59uOWemlyfXOu8fuK48JzOBeK@postgres://esuoljgnhhpspg:a59uOWemlyfXOu8fuK48JzOBeK@ec2-107-20-169-200.compute-1.amazonaws.com:5432/d9art4oc2q6c9l";
var connString = postgres://esuoljgnhhpspg:a59uOWemlyfXOu8fuK48JzOBeK@ec2-107-20-169-200.compute-1.amazonaws.com:5432/d9art4oc2q6c9l

///
function dbSelectAll(query, createElem, callback)
{
    pg.connect(connString, function(err, client, done) {

        
        if(err) return callback("Error fetching client from pool: " + err);

        client.query(query, function(err, result) {

            done();
            if(err) return callback("Error running query: " + err);

            var elems = result.rows.map(createElem);

             callback(null, elems);
        });
    });
}

function dbSelectOne(query, queryParams, createElem, callback)
{
    pg.connect(connString, function(err, client, done) {
        if(err) return callback("Error fetching client from pool: " + err);
        client.query(query, queryParams, function(err, result) {
            done();

            if(err) return callback("Error running query: " + err);

            if(result.rowCount == 0) return callback(null, null);
            if(result.rowCount > 1)  return callback("More than one element selected.", null);
            var elem = createElem(result.rows[0]);
            callback(null, elem);
        });
    });
}

function dbExecuteQuery(query, queryParams, callback) {
    pg.connect(connString, function(err, client, done) {
        
        if(err) return callback("Error fetching client from pool: " + err);
        client.query(query, queryParams, function(err, result) {
            done();

            if(err) return callback("Error running query: " + err);

            if(result.rowCount != 1) return callback("Cannot execute the query: " + query, null);
            callback(null,result.rowCount);
        });
    });
}

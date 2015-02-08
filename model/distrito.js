var db = require('./db');

function City(id, city) {
    this.id = id || require('node-uuid').v4();
    this.city = city || "";
};



// Simbolos para exportar
var distrito = {};
// Obtem todos os distritos ordenados por nome e por ordem crescente
distrito.getAll = function(cb) {
	 db.selectAll("SELECT idcity, city from dbCities",
        
        function(row) { 
            return  new City(row.idcity, row.city); 
        },
        cb);
};
// Obtem o nome do distrito por id
distrito.getById = function( id, cb) {
	db.selectOne("SELECT idcity, ciTy from dbCities where idcity=$1 limit 2",
        [id],
        function(row) {
         
             return  new City(row.idcity, row.city); 

         },

        cb);
};

module.exports = distrito;
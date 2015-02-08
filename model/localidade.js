var db = require('./db');

function Localidade(idcity, idlocal, local) {
    this.idcity = idcity || 0;
    this.idlocal = idlocal|| 0;
    this.local = local || "";
};



// Simbolos para exportar
var localidade = {};
// Obtem todas as localidades de um distrito
localidade.getAllByIdCity = function( id, cb) {
	db.selectAll("SELECT idcity, idlocal,  local from dblocation where idcity="+id,
        function(row) {
         
             return  new Localidade(row.idcity, row.idlocal, row.local); 

         },

        cb);
};

module.exports = localidade;
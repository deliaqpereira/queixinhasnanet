var express = require('express');
var router = express.Router();
var async = require('async');
var localidade = require('../model/localidade');

/* GET /distrito/:id/localidade */
router.get('/:id/localidade', function(req, res) {
	async.series({
		localidade: function(next) {	
			localidade.getAllByIdCity(req.params.id, function(result) {
				next(null, result);
			});
		}
	},
	function(err, results) {
		res.writeHead(200, {"Content-Type": "application/json"});
		res.end(JSON.stringify(results.localidade));
	});
});

module.exports = router;
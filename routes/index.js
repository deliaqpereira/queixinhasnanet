var express = require('express');
var router = express.Router();

var queixa = require("../model/queixa");
//var db = require("../model/db");


/* GET home page. */
router.get('/', function (req, res, next) {

	queixa.findAll(function (err, items)
	{

		if (err) return next (new Error(err));

		res.render('index',{model:items, 
							isAuthenticated: req.isAuthenticated,
							identity: req.identity
						   });
	});

});

module.exports = router;

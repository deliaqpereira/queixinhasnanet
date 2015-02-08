var express = require('express');
var router = express.Router();
var authorization = require('../middleware/authorization');
var async = require('async');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var queixa = require("../model/queixa");
var distrito = require("../model/distrito");
var utilizador = require("../model/user");

/*Metodos
/* GET queixas/details/:id. */
/*mostrar os detalhes de uma queixinha por id */
router.get('/details/:id', function(req, res, next) {

	async.series({
	    item:function(callback){
	        
	        queixa.getById( req.params.id , function (err, item)
			{
				if (err) return next (new Error(err));

				callback(null, item);
			});

	    },
	    notify:function(callback){
	        
	        queixa.getNotifyByUsr( req.identity , function (err, item)
			{
				if (err) return next (new Error(err));

				callback(null, item);
			});

	    },
	    comments:function(callback){

	        queixa.getAllCommentsById( req.params.id , function (err, comments)
			{
				if (err) return next (new Error(err));
				
				callback(null, comments);

			});
	    }
	},
	// optional callback
	function(err, results){
	    if (err) return next (new Error(err));
	    res.render('queixas/details',{model:results,
	    							  isAuthenticated: req.isAuthenticated,
									  identity: req.identity});
	});
});

/* Get /queixas/criar - Criar uma queixinha */
/*passa pelo middleware da autorização para preencher o campo identity*/
router.get('/criar', authorization('/users/login'), function(req, res){
	

	async.series({
	    distrito:function(callback){
	        
	        distrito.getAll(function (err, item)
			{
				if (err) return next (new Error(err));

				callback(null, item);
			});

	    }
	},
	// optional callback
	function(err, results){
	    if (err) return next (new Error(err));

	    /* Redirecionar para a view de criacao com a lista dos distritos preenchida */
		res.render('queixas/criar', { 	isAuthenticated: req.isAuthenticated,
										identity: req.identity,
										model:results
									});

	});
		
	
});

/* POST /queixas/criar - Criar uma queixinha */
/*passa pelo middleware da autorização para preencher o campo identity*/
router.post('/criar', authorization('/users/login'), function(req, res){
	
	async.series({
	    user:function(callback){
	        
	        utilizador.getByNick(req.identity,function (err, usr)
			{
				if (err) return next (new Error(err));

				callback(null, usr);
			});

	    },
	    queixa:function(callback){
	        
	        queixa.getNextId(function (err, item)
			{
				if (err) return next (new Error(err));

				callback(null, item);
			});

	    }
	},

	// optional callback
	function(err, results){
	    if (err) return next (new Error(err));

	    var item={};
	    item.id = results.queixa[0].id+1;
	    item.title=req.body.titulo;
	    item.description = req.body.descricao;
	    item.usr = results.user.usr;
	    item.dtcreate = new Date();
	    item.city = req.body.distrito;
	    item.local = 1;
		queixa.createNew(item, function(novo) {
			/* Redirecionar para as lista das minhas queixas */
			res.redirect('/queixas/utilizador');
		});


	});

});


/* GET /queixas/editar/id - Editar a queixinha */
router.get('/editar/:id', authorization('/users/login'), function(req, res) {

		async.series({
		distrito:function(callback){
	        
	        distrito.getAll(function (err, item)
			{
				if (err) return next (new Error(err));

				callback(null, item);
			});

	    },
	    item:function(callback){
	        
	        queixa.getById( req.params.id , function (err, item)
			{
				if (err) return next (new Error(err));

				callback(null, item);
			});

	    },
	    comments:function(callback){

	        queixa.getAllCommentsById( req.params.id , function (err, comments)
			{
				if (err) return next (new Error(err));
				
				callback(null, comments);

			});
	    }
	},
	// optional callback
	function(err, results){
	    if (err) return next (new Error(err));
	    res.render('queixas/editar',{model:results,
	    							isAuthenticated: req.isAuthenticated,
									identity: req.identity});
	});
		
});


/* POST /queixas/editar - Gravar alteracoes da queixa */
router.post('/editar', authorization('/users/login'), function(req, res){

	async.series({
	    queixa:function(callback){
	        
	        queixa.getNextUpdate(req.body.id, function (err, nrupdate)
			{
				if (err) return next (new Error(err));

				callback(null, nrupdate);
			});

	    }
	},
    // optional callback
	function(err, results){

	    if (err) return next (new Error(err));

	    var item={};
	    item.id = req.body.id;
	    item.title=req.body.titulo;
	    item.description = req.body.descricao;
	    item.closed = req.body.encerrado=='on'?1:0;
	    item.updated = parseInt(results.queixa.updated)+1;

		queixa.edit(item, function(changed) {
			// Redirecionar para as lista das minhas queixas 
			res.redirect('/queixas/details/' + req.body.id);
		});
	});
});

/* GET /queixas/notify - Gravar no utilizador que vai ser notificcado */
router.get('/notify/:id', authorization('/users/login'), function(req, res){

	async.series({
		user:function(callback){
	        
	        utilizador.getByNick(req.identity,function (err, usr)
			{
				if (err) return next (new Error(err));

				callback(null, usr);
			});

	    },
	    queixa:function(callback){
	        
	        queixa.getNotifyByUsr(req.identity, function (err, item)
			{
				if (err) return next (new Error(err));

				callback(null, item);
			});

	    }
	},
    // optional callback
	function(err, results){

		
	    if (err) return next (new Error(err));
	    
	    
	    if (req.identity == 'undefined')
	    {
	    	res.redirect('/');
	    }
	    else
	    {
	    	var insert = false;
		    if (results.queixa.length == 0) //deve fazer um insert na tabela de notificações
		    {
		    	insert = true;
		    }


			var item=[results.user.usr, req.params.id, 1, 0];

			queixa.checkOrUncheckNotify(insert, item, function(changed) {
				// Redirecionar para as lista das minhas queixas 
				res.redirect('/queixas/utilizador');
			});
		

	    }
	    
	});
});

/* DELETE /queixas/apagar/id - Apagar a queixa*/
router.delete('/apagar/:id', authorization('/users/login'), function(req, res, next) {

	async.series( { 
		remove:function(next)	{
			queixa.deleteById(req.params.id,function(err, numDeleted)
					{ 
						next(null, numDeleted);
					});
		}
	},
	function(err,results) {
		
		if (results.remove== null)
		{
			var e = new Error('A queixa não foi encontrada para ser apagada.');
			e.status = 404;
			next(e);
		}
		else
		{
			res.send('A queixa foi apagada com sucesso.');
		}
	});
});


/* GET /queixas/utilizador - Obter a lista de queixas de um utilizador */
router.get('/utilizador', authorization('/users/login'), function(req, res, next){
	async.series( { 
		queixasByUsr:function(next)	{
			queixa.getAllByUsr(req.identity,function(err, data)
					{ 
						next(null, data);
					});
		}
	},
	function(err,results) {
		
		if (results.queixasByUsr== null)
		{
			var e = new Error('Não foram encontradas queixas');
			e.status = 404;
			next(e);
		}
		else
		{
			res.render('queixas/utilizador',{	title: 'Lista de queixinhas', 
												model:results.queixasByUsr,
												isAuthenticated: req.isAuthenticated,
												identity: req.identity
											});
		}
	});
});

//var smtpTransport = nodemailer.createTransport("SMTP",
//{   service: "Gmail",
  // sets automatically host, port and connection security settings   
//  auth: {       user: "pi.g15n@gmail.com",       pass: "12345poiuy"   }
//});

var transport = nodemailer.createTransport(smtpTransport({
    service: 'gmail',

    auth: {
        user: 'deliaqpereira@gmail.com',
        pass: 'imlp2011'
    }
}));

/*POST  queixas/details/:id/setcomment - criar um comentario numa queixa */
router.post('/details/:id/setcomment', authorization('/users/login'), function(req, res){

	async.series( { 
		user:function(callback){
	        
	        utilizador.getByNick(req.identity,function (err, usr)
			{
				if (err) return next (new Error(err));

				callback(null, usr);
			});

	    },
	    userNotify:function(callback){
	        
	        queixa.getAllUsrToNotify(req.params.id,function (err, usr)
			{
				if (err) return next (new Error(err));

				callback(null, usr);
			});

	    },
		queixa:function(next)	{
			queixa.getById(req.params.id,function(err,data){
				next(null, data);
			});
		},
		comment:function(next)	{
			queixa.getNextIdComment(req.params.id,function(err,data){
				next(null, data);
			});
		},
	},
	function(err,results) {

		req.body.user = req.identity;
		comentario={};
		comentario.idqueixa = req.params.id;
		comentario.id = results.comment.length?parseInt(results.comment[0].id)+1 : 1;
		comentario.comentario = req.body.Texto;
		comentario.usr = results.user.usr;

	  	var link = req.headers['referer'];
	  	queixa.AddComment(comentario, function(insertcomment) 
	  	{
	  		/*for(var i=0; i< results.userNotify.length; i++)
	  		{
				transport.sendMail(
					{
						from: results.user.usr,
						to: results.userNotify[i].usr,
						subject: req.body.Texto, 
						text: link// body
					}, 
					function(error, response){  
					 	//callback  
			    	 	if(error)
					 	{       
					 		console.log(error);   
					 	}
					 	else
					 	{
					 		console.log("enviou mensagem");   
					 	}      
				 
			 		transport.close(); // shut down the connection pool, no more messages.  
			 	});
			}
			*/

			/* Redirecionar para o detalhe do anuncio */
			res.redirect('/queixas/details/' + req.params.id);
			
		});
	});
});

module.exports = router;
var express = require('express');
var router = express.Router();
var async = require('async');

// carregamento do middleware de Autenticacao e Autorizacao
var authentication = require('../middleware/authentication');
var authorization = require('../middleware/authorization');


/* GET /users  direcionar para /users/login */
router.get('/', function(req, res) {
  res.redirect('/users/login');
});

/* GET /users/login Pagina para o utilizador se logar. */
router.get('/login', function(req, res) {

	res.render('users/login', { req: req, title: 'Entrar' });


});

/* POST Receber as credencias para utilizador se logar. */
router.post('/login', function(req, res) {
	authentication.login(req.body.userName, req.body.password, req.body.RememberMe, res, function(success) {
		if(success)
		{
			res.redirect('/');
		} 
		else
		{
			res.render('users/login', {  isAuthenticated: req.isAuthenticated,
										 identity: req.identity,
										 title: 'Entrar', 
										 errorMsg: 'Nome de utilizador ou password errada.' });
		}
	});
});


/* GET Pagina para o utilizador sair. */
router.get('/sair', function(req, res) {
	authentication.logout(res);
	res.redirect('/');
});

/* GET Editar o utilizador actual */
router.get('/editar', authorization('/users/login'), function(req, res) {
	res.render('users/editar', { isAuthenticated: req.isAuthenticated,
								 identity: req.identity, 
								 title: 'Editar registo de utilizador' });
});

/* POST Editar o utilizador actual */
router.post('/editar', authorization('/users/login'), function(req, res) {
	if(req.body.newPassword != req.body.confirmPassword) {
		res.render('users/editar', {isAuthenticated: req.isAuthenticated,
									identity: req.identity, 
									title: 'Editar registo de utilizador', 
									errorMsg: 'Palavra passe e confirmação não são iguais' });
	} else {
		authentication.userExist(req.identity, req.body.newPassword, function(found) {
			if(found) {
				auth.changePassword(req.identity, req.body.newPassword);
				errorMsg = 'Nova palavra passe actualizada com sucesso';
			} else {
				errorMsg = 'Palavra passe incorrecta';
			}
			res.render('users/editar', {isAuthenticated: req.isAuthenticated,
										identity: req.identity, 
										title: 'Editar registo de utilizador', 
										errorMsg: errorMsg });
		});
	}
});


/* GET Criar novo utilizador */
router.get('/registar', function(req, res) {
	console.log(req.identity);
	console.log(req.isAuthenticated);
	res.render('users/registar', {isAuthenticated: req.isAuthenticated,
								identity: req.identity, 
								title: 'Registar novo utlizador' });
});


/* POST Criar novo utilizador */
router.post('/registar', function(req, res) {
	if(req.body.password != req.body.confirmPassword) 
	{
		res.render('users/registar', {isAuthenticated: req.isAuthenticated,
									identity: req.identity, 
									title: 'Registar novo utlizador', 
									errorMsg: 'Palavra passe e confirmação não são iguais' });
	}
	else
	{
		authentication.newUser(req.body.userEmail, req.body.password, req.body.userName, res, function(err)
		{
			if(err)
			{
				res.render('users/registar', {isAuthenticated: req.isAuthenticated,
											identity: req.identity, 
											title: 'Registar novo utlizador', 
											errorMsg: 'Nome de utilizador já existe' });
			} 
			else
			{
				authentication.login(req.body.userName, req.body.password, false, res, function() {
					res.redirect('/');
				});
			}
		});
	}
});

module.exports = router;

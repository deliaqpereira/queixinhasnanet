
var utilizador = require("../model/user");


//cookie gerado para o utilizador
var cookieName = '__iamyourcookie';
// Um dia
var maxAge = 60 * 60 * 24 * 1000;

//objecto para ser exportado
var authentication = {};

authentication.login = function(username, password, rememberMe, res, callback) {

	utilizador.getByUsr(username, password, function(err, result) {
		
		var success = false;
		if (err) return callback (new Error(err));

		if(result==null)
		{
			res.clearCookie(cookieName);
		} 
		else
		{
			if(rememberMe)
			{
				res.cookie(cookieName, result.name, { maxAge: maxAge });
			}
			else
			{
				res.cookie(cookieName, result.name);
			}
			success = true;
		}
		callback( success);
	}
	); 
}

authentication.logout = function(res) {
	res.clearCookie(cookieName);
}


authentication.changePassword = function(username, newPassword, callback) {
	utilizador.updatePassword(username, newPassword, callback);
}

authentication.newUser = function(useremail, password, nickname, res, callback) {
	utilizador.createNew(useremail, password, nickname, res, callback);
}
module.exports = authentication;
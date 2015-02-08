// Página de login
var login_route = '';
var cookieName = '__iamyourcookie';

// Middleware de autorizacao
module.exports = function(route) {

	login_route = route || false;
	
	return function(req, res, next) {
		cookie = req.cookies[cookieName] || false;
		
		if(cookie)
		{
			req.identity = cookie;
			req.isAuthenticated = true;
			next();
		}
		else
		{
			req.identity = false;
			req.isAuthenticated = false;
			if(login_route) {
				res.redirect(login_route);
			} else {
				next();
			}
		}
	}
};
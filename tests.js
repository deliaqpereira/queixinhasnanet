var queixa = require("./model/queixa");
var utilizador = require("./model/user");


queixa.findAll(function (err, items)
{
	console.log("Primeiro registo da base de dados:",items[0].id==1);	
});

queixa.getById( 1 , function (err, item)
{
	console.log("O registo 1 existe:",item.id==1);
});

queixa.getAllCommentsById( 1 , function (err, comments)
{
	console.log("Existem comentarios no registo: ",comments.length>0);

});

queixa.getAllByUsr('joe',function(err, items)
{ 
	console.log("Existem registos para o utilizador joe ",items.length>0);
});

utilizador.getByNick('joe' ,function (err, item)
{
	console.log("O utilizador joe é: ",item.usr);
});
 
queixa.getNotifyByUsr( 'joe' , function (err, items)
{
	console.log("Existem notificações do utilizador joe: ",items.length>0);
});
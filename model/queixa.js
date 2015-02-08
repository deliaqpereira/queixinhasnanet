var db = require('./db');

function Queixa(id, title, description, creationDate, votecount, closed, updated) {
    this.id = id || require('node-uuid').v4();
    this.title = title || "";
    this.description = description || "";
    this.creationDate = creationDate || new Date();
    this.votecount = votecount || 0;
    this.closed = closed;
    this.updated = updated || 0;

};

function Comentario(id, description, creationDate, usr, idqueixa) {
    this.id = id || require('node-uuid').v4();
    this.description = description || "";
    this.creationDate = creationDate || new Date();
    this.usr = usr || "";
    this.idqueixa = idqueixa || 0;
};

function Notif(user, id, notify, vote) {
    this.usr = user || "";
    this.id = id || "";
    this.notify = notify || new Date();
    this.vote = vote || "";
};

module.exports = Queixa;


Queixa.findAll = function(cb)
{
    
    db.selectAll("SELECT idqueixa, title, descr, dtcreate, votecount, closed from dbQueixas order by idqueixa",
        
        function(row) { 
            return  new Queixa(row.idqueixa, row.title, row.descr, row.dtcreate, row.votecount, row.closed); 
        },
        cb);
}

Queixa.getById = function(id, cb)
{
    db.selectOne("SELECT idqueixa, title, descr, dtcreate ,votecount, closed from dbQueixas where idqueixa=$1 limit 2",
        [id],
        function(row) {
         
             return new Queixa(row.idqueixa, row.title, row.descr, row.dtcreate, row.votecount, row.closed); 

         },

        cb);
};

Queixa.getAllByUsr = function(id, cb)
{
    db.selectAll("SELECT idqueixa, title, descr, dtcreate, votecount from dbQueixas inner join dbusers on dbqueixas.usr=dbusers.usr  where dbusers.nick like '"+id+"'",
        function(row) {
            return  new Queixa(row.idqueixa, row.title, row.descr, row.dtcreate, row.votecount); 

         },

        cb);
};

Queixa.getNextId = function(cb)
{
    db.selectAll("select *  from dbQueixas order by idqueixa desc limit 1",
        function(row) {
         
             return new Queixa(row.idqueixa, row.title, row.descr, row.dtcreate); 
         },

        cb);
};

Queixa.getNextUpdate = function(id, cb)
{
    var params=[id];
    db.selectOne("select *  from dbQueixas where idqueixa=$1 order by updated desc limit 1", params,
        function(row) {
         
             return new Queixa(row.idqueixa, row.title, row.descr, row.dtcreate, row.votecount,row.closed, row.updated); 
         },

        cb);
};
Queixa.getAllCommentsById = function(id, cb)
{
    db.selectAll("select id, descr, dtcreate,nick from dbcomentarios inner join dbusers on dbcomentarios.usr=dbusers.usr  where idqueixa="+id,
        function(row) {
            return  new Comentario(row.id, row.descr, row.dtcreate, row.nick); 

         },

        cb);
};

Queixa.createNew = function(queixa, cb)
{
    var params = [queixa.id, queixa.usr, queixa.title, queixa.description, queixa.dtcreate, queixa.city, queixa.local];
    db.executeQuery("INSERT into dbQueixas(idqueixa,usr, title, descr, dtcreate, idCity,location) values($1, $2, $3, $4, $5, $6, $7)",
        params,
        function(err) { cb(err, queixa.id) },
        cb);
};

Queixa.edit = function(queixa, cb)
{
    var params = [queixa.id, queixa.title, queixa.description, queixa.closed, queixa.updated];
    db.executeQuery("UPDATE dbQueixas SET (title, descr, closed, updated) = ($2, $3, $4, $5) where idqueixa = $1",
        params,
        function(err) {
            if(err) return cb(new Error(err));
                Queixa.getById(queixa.id, cb);
            }
        );
};

Queixa.getNextIdComment = function(id,cb)
{
    db.selectAll("select *  from dbComentarios where idqueixa="+id+" order by id desc limit 1",
        function(row) {
         
             return new Comentario(row.id, row.descr, row.dtcreate,row.usr, row.idqueixa); 
         },

        cb);
};
Queixa.AddComment = function(comment, cb)
{
    var params = [comment.idqueixa, comment.id, comment.comentario,  new Date(), comment.usr];
    console.log(params);
    db.executeQuery("INSERT into dbComentarios(idqueixa,id, descr, dtcreate, usr) values($1, $2, $3, $4, $5)",
        params,
        function(err) {
            if (err) return cb(new Error(err));
                Queixa.getById(comment.idqueixa, cb);
            },
        cb);
};

Queixa.checkOrUncheckNotify = function(insert, items, cb)
{
    if (insert == true)
    {
        var params=[items.usr, items.id, 1, items.vote];
        
        db.executeQuery("INSERT into dbNotify (usr, idqueixa, notify, voting) values($1, $2, $3, $4)",
            params,
            cb
        );
    }
    else
    {
        var params=[items.usr, items.id];
        console.log(params);
        db.executeQuery("UPDATE dbNotify SET notify = NOT notify where idqueixa = $2",
            params,
            cb
        );
    }
};

Queixa.getNotifyByUsr = function(id, cb)
{
    db.selectAll("SELECT * from dbNotify inner join dbusers on dbNotify.usr=dbusers.usr  where dbusers.nick like '"+id+"'",
        function(row) {
            return  new Notif(row.usr, row.idqueixa, row.notify, row.voting); 

         },

        cb);
};

Queixa.getAllUsrToNotify = function(id, cb)
{
    db.selectAll("SELECT * from dbNotify   where dbNotify.idqueixa="+id,
        function(row) {
            return  new Notif(row.usr, row.idqueixa, row.notify, row.voting); 

         },

        cb);
};


Queixa.deleteById = function(id, cb)
{
    db.executeQuery("DELETE FROM dbQueixas where idqueixa = $1",
        [id],
        cb
    );
};


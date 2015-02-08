var db = require('./db');

function User(usr, name, isAdmin)
{
    this.usr = usr;
    this.name = name;
    this.isAdmin = isAdmin || 0;
}

module.exports = User;

User.getByUsr = function(usr, passw, cb)
{
    var params = [usr, passw];
    db.selectOne("SELECT usr, nick , isadmin from dbUsers where usr=$1 and passw=$2 ",  params,
                  function(row) { 
                    return new User(row.usr, row.nick, row.isadmin); },
                 cb);
};

User.getByNick = function(nick, cb)
{
    var params = [nick];
    db.selectOne("SELECT usr, nick , isadmin from dbUsers where nick=$1 ",  params,
                  function(row) { 
                    return new User(row.usr, row.nick, row.isadmin); },
                 cb);
};

User.findAll = function(cb)
{
    db.selectAll("SELECT id, name from users order by id",
        function(row) { return new User(row.id, row.name); },
        cb);
}


User.createNew = function(useremail, password, nickname,  res, cb)
{
    var params = [useremail, password, nickname];

    db.executeQuery("INSERT into dbUsers(usr, passw, nick, isadmin) values($1, $2, $3,0)",
        params,
        function(err) { 
            console.log(err);
            cb(err, useremail) 
        }
    );
};
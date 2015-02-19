DROP TABLE IF EXISTS dbUsers;
CREATE TABLE dbUsers(
	usr VARCHAR(60) PRIMARY KEY,
	passw VARCHAR(20),
	nick VARCHAR(20),
	isAdmin INTEGER
);
INSERT INTO dbUsers VALUES ('31399@alunos.isel.ipl.pt','123456','deliaqpereira',1);
INSERT INTO dbUsers VALUES ('deliaqpereira@gmail.com','foo1234','delia',0);
INSERT INTO dbUsers VALUES ('lpeegeral@gmail.com','sal1234','joe',0);



DROP TABLE IF EXISTS dbCities;
CREATE TABLE dbCities(
	idCity INTEGER PRIMARY KEY, 
	city VARCHAR(20)
);

INSERT INTO dbCities VALUES (1,'Açores');
INSERT INTO dbCities VALUES (2,'Aveiro');
INSERT INTO dbCities VALUES (3,'Beja');
INSERT INTO dbCities VALUES (4,'Braga');
INSERT INTO dbCities VALUES (5,'Bragança');
INSERT INTO dbCities VALUES (6,'Castelo Branco');
INSERT INTO dbCities VALUES (7,'Coimbra');
INSERT INTO dbCities VALUES (8,'Évora');
INSERT INTO dbCities VALUES (9,'Faro');
INSERT INTO dbCities VALUES (10,'Guarda');
INSERT INTO dbCities VALUES (11,'Leiria');
INSERT INTO dbCities VALUES (12,'Lisboa');
INSERT INTO dbCities VALUES (13,'Madeira');
INSERT INTO dbCities VALUES (14,'Portalegre');
INSERT INTO dbCities VALUES (15,'Porto');
INSERT INTO dbCities VALUES (16,'Santarém');
INSERT INTO dbCities VALUES (17,'Setubal');
INSERT INTO dbCities VALUES (18,'Viana do Castelo');
INSERT INTO dbCities VALUES (19,'Vila Real');

DROP TABLE IF EXISTS dbLocation;
CREATE TABLE dbLocation(
	idCity INTEGER REFERENCES  dbCities,
	idLocal INTEGER PRIMARY KEY,
	local VARCHAR(20)
);

INSERT INTO dbLocation VALUES (1,1,'Angra do Heroísmo');
INSERT INTO dbLocation VALUES (1,2,'Calheta');
INSERT INTO dbLocation VALUES (1,3,'Corvo');
INSERT INTO dbLocation VALUES (1,4,'Horta');
INSERT INTO dbLocation VALUES (1,5,'Lagoa');
INSERT INTO dbLocation VALUES (1,6,'Lajes das Flores');
INSERT INTO dbLocation VALUES (1,7,'Lajes do Pico');
INSERT INTO dbLocation VALUES (1,8,'Madalena');
INSERT INTO dbLocation VALUES (1,9,'Nordeste');



DROP TABLE IF EXISTS dbQueixas;
CREATE TABLE dbQueixas(
	idQueixa  SERIAL PRIMARY KEY,
	usr VARCHAR(60),
	title VARCHAR(60),
	descr VARCHAR(140),
	dtcreate DATE,
	idCity INTEGER ,
	location INTEGER,
	votecount INTEGER,
	closed INTEGER,
	updated INTEGER
);

INSERT INTO dbQueixas VALUES(1,'deliaqpereira@gmail.com', 'Testes unitários','routinas de implementação demorada','2015-01-02',1,1,0,0,0);
INSERT INTO dbQueixas VALUES(2,'lpeegeral@gmail.com', 'Trabalho de PI','Trabalho de média complexidade de implementação','2015-01-10',1,1,0,0,0);


DROP TABLE IF EXISTS dbComentarios;
CREATE TABLE dbComentarios(
        idQueixa INTEGER REFERENCES dbQueixas(idQueixa),
	id  INTEGER PRIMARY KEY,
	descr VARCHAR(140),
	dtcreate DATE,
	usr VARCHAR(60)
);

INSERT INTO dbComentarios VALUES(1,1,'Os testes unitários são necessários para verificar se as routinas cumprem o requisito','2015-01-03','lpeegeral@gmail.com');


DROP TABLE IF EXISTS dbNotify;
CREATE TABLE dbNotify(
	usr  VARCHAR(60) REFERENCES dbUsers(usr),
	idQueixa INTEGER REFERENCES dbQueixas(idQueixa),
	notify INTEGER,
	voting INTEGER
);

INSERT INTO dbNotify VALUES ('lpeegeral@gmail.com',1,0,1);


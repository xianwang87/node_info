drop table if exists my_dbconns;
drop table if exists my_sqls;
drop table if exists my_sql_params;

create table my_dbconns (
	id int(10) not null auto_increment,
	username varchar(128) not null,
	password varchar(128),
	host varchar(64),
	dbname varchar(64),
	dbtype int(3),
	author int(10),
	addDate datetime,
	lastModifyDate datetime,
	primary key (id)
);

create table my_sqls (
	id int(10) not null auto_increment,
	name varchar(64) not null,
	mydesc varchar(256),
	mysql text,
	orisql text,
	dbtype int(3),
	author int(10),
	addDate datetime,
	lastModifyDate datetime,
	primary key (id)
);

create table my_sql_params (
	id int(10) not null auto_increment,
	name varchar(64) not null,
	myorder int(4),
	paramType varchar(16),
	defvalue varchar(128),
	sqlId int(10),
	author int(10),
	addDate datetime,
	lastModifyDate datetime,
	primary key (id),
	foreign key(sqlId) references my_sqls(id)
);
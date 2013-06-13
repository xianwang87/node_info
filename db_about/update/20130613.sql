drop table if exists my_tools;
create table my_tools (
	id int(10) not null auto_increment,
	name varchar(128) not null,
	oriName varchar(128),
	mydesc varchar(256),
	filePath varchar(256),
	author int(10),
	addDate datetime,
	lastModifyDate datetime,
	primary key (id)
);
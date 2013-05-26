drop table if exists my_menus;

create table my_menus (
	id int(10) not null auto_increment,
	menuFor varchar(32) not null,
	name varchar(64) not null,
	mydesc varchar(128),
	level int(3),
	parent int(10),
	myorder int(3),
	addDate datetime,
	lastModifyDate datetime,
	primary key (id)
);
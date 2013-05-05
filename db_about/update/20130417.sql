drop table if exists my_invite;
drop table if exists my_user;

create table my_user (
	id int(10) not null auto_increment,
	name varchar(256) not null,
	email varchar(128) not null,
	pwd varchar(128) not null,
	addDate datetime,
	locked boolean,
	primary key (id)
);

create table my_invite (
	id int(10) not null auto_increment,
	name varchar(256) not null,
	mydesc varchar(512),
	email varchar(128) not null,
	addDate datetime,
	inviterId int(10),
	primary key (id),
	foreign key(inviterId) references my_user(id)
);
drop table if exists my_sub_tasks;
drop table if exists my_tasks;

create table my_tasks (
	id int(10) not null auto_increment,
	name varchar(256) not null,
	mydesc varchar(2048),
	addDate datetime,
	lastModifyDate datetime,
	onDate date,
	fromTime time,
	toTime time,
	priority int(3),
	status int(3),
	primary key (id)
);

create table my_sub_tasks (
	id int(10) not null auto_increment,
	name varchar(256) not null,
	mydesc varchar(2048),
	addDate datetime,
	lastModifyDate datetime,
	status int(3),
	parentTask int(10),
	primary key (id),
	foreign key(parentTask) references my_tasks(id)
);
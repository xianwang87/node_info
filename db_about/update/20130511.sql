drop table if exists my_work_done;

create table my_work_done (
	id int(10) not null auto_increment,
	title varchar(256) not null,
	mydesc text,
	onDate date,
	addDate datetime,
	lastModifyDate datetime,
	primary key (id)
);
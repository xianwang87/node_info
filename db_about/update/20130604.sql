drop table if exists my_tag_object;
drop table if exists my_tags;

create table my_tags (
	id int(10) not null auto_increment,
	tagName varchar(64) not null,
	addDate datetime,
	lastModifyDate datetime,
	primary key (id)
);

create table my_menu_article (
	id int(10) not null auto_increment,
	tagId int(10) not null,
	objectId int(10) not null,
	objectType varchar(32) not null,
	primary key (id),
	foreign key(tagId) references my_tags(id)
);
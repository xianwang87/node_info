drop table if exists my_articles;
drop table if exists my_menu_article;

create table my_articles (
	id int(10) not null auto_increment,
	title varchar(128) not null,
	summary varchar(256),
	content text,
	author int(10),
	addDate datetime,
	lastModifyDate datetime,
	primary key (id)
);

create table my_menu_article (
	id int(10) not null auto_increment,
	menuId int(10),
	articleId int(10),
	primary key (id),
	foreign key(menuId) references my_menus(id),
	foreign key(articleId) references my_articles(id)
);
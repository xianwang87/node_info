delete from my_menus;
insert into my_menus (id, menuFor, name, level, parent, myorder) values(1, "Resource", "Node1", 1, 0, 1);
insert into my_menus (id, menuFor, name, level, parent, myorder) values(2, "Resource", "Node1-1", 2, 1, 2);
insert into my_menus (id, menuFor, name, level, parent, myorder) values(3, "Resource", "Node1-2", 2, 1, 3);
insert into my_menus (id, menuFor, name, level, parent, myorder) values(4, "Resource", "Node2", 1, 0, 4);
insert into my_menus (id, menuFor, name, level, parent, myorder) values(5, "Resource", "Node2-1", 2, 4, 5);
insert into my_menus (id, menuFor, name, level, parent, myorder) values(6, "Resource", "Node2-1-1", 3, 5, 6);
insert into my_menus (id, menuFor, name, level, parent, myorder) values(7, "Resource", "Node2-1-2", 3, 5, 7);
insert into my_menus (id, menuFor, name, level, parent, myorder) values(8, "Resource", "Node2-1-1-1", 4, 6, 8);
insert into my_menus (id, menuFor, name, level, parent, myorder) values(9, "Resource", "Node1-2-1", 3, 3, 9);
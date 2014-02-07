# node_info
>This project is built with Node.js(0.10), database used is MySQL, only tested on Linux(Ubuntu and CentOS).

## Todo
1. Home
	
	List todo items will be done today.
	
	![Todo home page](./docs/screenshots/todo-home.png)
2. Add a todo item
	![Add todo item](./docs/screenshots/todo-add.png)
3. When hover over a todo item
	![When hover a todo item](./docs/screenshots/todo-hover.png)
4. Double click priority field to modify priority of a certain todo item

	The same to Status field.

	![Double click to modify priority](./docs/screenshots/todo-doubleclicktochangepriority.png)
5. View all finished todos
	![View finished todo items](./docs/screenshots/todo-finished.png)
	
## Resource
1. Home
	
	List recently added items or items in a certain category.
	
	![Resource home page](./docs/screenshots/resource-home.png)
2. Hover over left navigator to modify categories

	![Hover over left navigator to modify categories](./docs/screenshots/resource-hovertomodifycategories.png)
	
3. Edit categories
	![Edit categories](./docs/screenshots/resource-editcategories.png)
4. View certain resource item detail
	![Resource detail](./docs/screenshots/resource-detail.png)
5. Edit a resource item
	![Edit resource item](./docs/screenshots/resource-edit.png)
	
## Work Done

This is used to record work which are done, grouped by date, so we can easily to find what has been done at a certain day.

1. Home
	
	Note that the bug id in title is linkable.
	
	![Work Done home](./docs/screenshots/mywork.png)
2. Edit a work done item
	
	Note that "mybug(123)" in title field, this will be shown as a link on home page.
	
	![Edit work done item](./docs/screenshots/mywork-edit.png)
	
## Tool
### Tool - HTML page

We can write some HTML pages for simple functions, e.g. list color set, or use javascript to supply some funny applications.

1. Home
	![HTML page home](./docs/screenshots/tool-html.png)
2. Add a HTML page
	![Add HTML page](./docs/screenshots/tool-html-addcustomhtmlpage.png)
3. View Result

	Click the title from home to view result.

	![View HTML page result](./docs/screenshots/tool-html-colorsetresult.png)

### Tool - DB sql

This is designed to store SQLs which are used frequently, and support adding custom parameters in sql sentence, these parameters will be shown as HTML widget on page.

1. Home
	![DB sql home](./docs/screenshots/tool-dbsql.png)
2. Edit DB sql

	Note those characters like "{{Name}}"	in SQL Content field, these will be parsed as parameters.

	![Edit DB sql](./docs/screenshots/tool-dbsql-edit.png)
3. DB sql running page

	You must supply DB connection criteria, they will be stored in a session.

	![DB sql running page](./docs/screenshots/tool-dbsql-detail.png)
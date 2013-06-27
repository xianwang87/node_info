$(function() {	
	var renderResultItems = function(sqlId, items) {
		var $resultContainer = $(".sql-detail-run-result-container[sql-id=" + sqlId + "]");
		var fields = [];
		var html = "";
		if (items && items.length > 0) {
			fields = _.sortBy(_.keys(items[0]), function(field) { return field; });
			html += '<table class="table table-hover">';
			html += "<thead><tr>";
			_.each(fields, function(field) {
				html += "<th>" + field + "</th>";
			});
			html += "</tr></thead>";
			html += "<tbody>";
			_.each(items, function(item) {
				html += "<tr>";
				_.each(fields, function(field) {
					html += "<td>" + item[field] + "</td>";
				});
				html += "</tr>";
			});
			html += "</tbody>";
			_.each()
		}
		
		if (!html) {
			html = '<div class="alert alert-error">No Result was found!</div>';
		}
		
		html = "<h2>Result: </h2>" + html;
		$resultContainer.html(html);
	};
	
	var runASql = function(sqlId) {
		var params = {};
		
		$(".sql-params-container[param-for-sql-id="+sqlId+"] [for-sql-param]").each(function(){
			var $this = $(this);
			params[$this.attr("param-order")] = $this.val();
		});
		
		$.post('/mytool/db/sql/runit',
			$.param({
				sqlId: sqlId,
				params: params,
				connDB: {
					user: $("#db-conn-user").val(),
					password: $("#db-conn-password").val(),
					host: $("#db-conn-host").val(),
					database: $("#db-conn-database").val()
				}
			}), function(data, textStatus) {
				renderResultItems(sqlId, data.items);
			}, 'json');
	};
	
	$(".btn-run-sql").click(function(e) {
		runASql($(this).attr("sql-id"));
	});
});

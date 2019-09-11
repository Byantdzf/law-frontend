layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;

			_t.loadCateList();
		},

		loadCateList: function () {
			var _t = this;
			utils.getSync(URL.select.getCate, function (res) {
				var list = res.data;
				var html = '';
				$.each(list, function (i, t) {
					html += '<input type="checkbox" name="likes" lay-skin="primary" value="' + t.id + '" title="'+t.name+'" lay-filter="likesChange">';
				})
				$('.checkboxList').html(html);
				form.render('checkbox');
			});

			form.on('checkbox(likesChange)', function (elem) {
				var len = $('.checkboxList input[type="checkbox"]:checked').length;
				if (len > 6) {
					elem.elem.checked = false;
					form.render('checkbox');
					utils.alert('最多只可选择6项');
				}
			})
		},
	}

	// 点击事件
	gather.init();
});
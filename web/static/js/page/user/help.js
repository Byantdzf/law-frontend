layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;

			_t.loadPage();
		},

		loadPage: function () {
			var _t = this;
			var data = {};
			var html = utils.getTemp('/page/user/help.html', data);
			$('.userPageCon').html(html);
		}
	}

	// 点击事件
	gather.init();
});
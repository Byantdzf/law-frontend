layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;

			_t.loadPage();
		},

		loadPage: function () {
			var _t = this;
			var data = global.userInfo || {};
			utils.get(URL.lawyerObj.myData, {isLawyer: 1}, function (res) {
				data = $.extend(true, {}, data, res.data);
				var html = utils.getTemp('/page/lawyer/user/index.html', data);
				$('.userPageCon').html(html);
			});
		}
	}

	// 点击事件
	gather.init();
});
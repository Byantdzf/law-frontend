layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;

			_t.loadPage();
		},

		loadPage: function () {
			var _t = this;
			var data = {};
			var html = utils.getTemp('/page/lawyer/user/attention.html', data);
			$('.userPageCon').html(html);
			
			_t.queryList();
			// $('.countTimes').each(function () {
			// 	utils.countTimes($(this));
			// });
		},

		queryList: function () {
			var qlps = {
				url: URL.lawyerObj.attention,
				box: '.systemPush_box',
				temp: '/lawyer/temp/common/orderList.html'
			}
			utils.queryTempList(qlps);
		}
	}

	// 点击事件
	gather.init();
});
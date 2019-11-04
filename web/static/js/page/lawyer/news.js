layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;

			_t.queryList();

			base.getLawyerOrderList();
		},

		queryList: function () {
			var qlps = {
				url: URL.lawyerObj.news.query,
				box: '.art_list_box',
				temp: '/page/news/newsList.html'
			}
			utils.queryTempList(qlps);
		}
	}

	// 点击事件
	gather.init();
});
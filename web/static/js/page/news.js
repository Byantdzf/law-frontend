layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			// _t.type = utils.getQueryString('type').toString();

			// var box = $('.newsRight');
			// var rightTop = box.offset().top;

			// $(window).scroll(function () {
			// 	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			// 	if (scrollTop >= rightTop) {
			// 		box.addClass('fixed')
			// 	} else {
			// 		box.removeClass('fixed')
			// 	}
			// })

			_t.queryList();

			_t.getLawyerList();
		},

		queryList: function () {
			var qlps = {
				url: URL.news.query,
				box: '.art_list_box',
				temp: '/page/news/newsList.html'
			}
			utils.queryTempList(qlps);
		},

		getLawyerList: function () {
			var areas = utils.cookie(global.areaCookie);
			if (areas) {
				areas = JSON.parse(areas) || {};
			} else {
				areas = global.defaultArea;
			}
			var params = {}
			params[global.rows] = 5;
			params[global.page] = 1;
			params.city = areas.name;
			params.noAuth = 1;
			utils.get(URL.lawyer.query, params, function (res) {
				var data = res.data.list || []
				var html = utils.getTemp('/page/common/reclawyerList.html', data)
				$('.newsRight ul').html(html);
			})
		}
	}

	// 点击事件
	gather.init();
});
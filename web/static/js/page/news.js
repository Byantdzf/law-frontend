layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.type = utils.getQueryString('type');

			_t.getBranch();
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
			var _t = this;
			var qlps = {
				url: URL.news.query,
				searchData: {
					type: _t.type
				},
				box: '.art_list_box',
				temp: '/page/news/newsList.html'
			}
			utils.queryTempList(qlps, function () {
				$('.art_list_box a').each(function () {
					var url = $(this).attr('href');
					$(this).attr('href', url + '&type=' + _t.type)
				})
			});
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
		},

		getBranch: function () {
			var _t = this;
			var location = '';
			switch (_t.type) {
				case "1":
					location = '<a href="javascript:;">法律文章精选</a>';
					break;
				case "2":
					location = '<a href="javascript:;">最新法律速递</a>';
					break;
				case "3":
					location = '<a href="javascript:;">公司新闻</a>';
					break;
			}
			if (location) {
				$('.bread_tips').append(location);
				$('.clm_tt_l').html(location);
			}
		}
	}

	// 点击事件
	gather.init();
});
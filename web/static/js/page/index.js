layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.c = utils.getQueryString('c');

			carousel.render({
				elem: '#indexBanner'
				, width: '1200px'
				, height: '376px'
			});

			// base.openRedPacket();

			var areas = utils.cookie(global.areaCookie);

			!_t.c && !areas && _t.getLocation()

			_t.getLawyer()

			_t.getQuestionType()

			// 获取地区
			base.hotCity();

			$.get('/static/js/plugin/jquery.SuperSlide.2.1.3.js', function () {
				// 法律文章精选
				_t.getLegalNews()

				// 最新法律速递
				_t.getNewLegal()

				// 公司新闻
				_t.getCompanyNews()
			})
		},

		getLocation: function () {
			$.getScript('https://apis.map.qq.com/ws/location/v1/ip?callback=showLocation&key=LW5BZ-ZTFA4-QXNUJ-XWKTM-5VAB5-J6BTM&output=jsonp');
		},

		getQuestionType: function () {
			var data = base.getQuestionType()
			var html = utils.getTemp('/page/home/questionType.html', data)
			$('.clm_3_1 ul').html(html);
		},

		getLawyer: function () {
			var _t = this;
			var areas = utils.cookie(global.areaCookie);
			if (areas) {
				areas = JSON.parse(areas) || {};
			} else {
				areas = global.defaultArea;
			}
			var params = {}
			params[global.rows] = 5;
			params[global.page] = 1;
			params.city = areas[1] || areas[0];
			params.noAuth = 1;
			utils.get(URL.lawyer.query, params, function (res) {
				var data = res.data.list || []
				var html = utils.getTemp('/page/home/lawyerList.html', data)
				$('.lawyerList').html(html);

				// 关注
				$('.collect').off().on('click', function () {
					var id = $(this).closest('li').data('id');
					var params = {
					businessId: id,
					operateBusiness: 2,  // 操作对象1-订单 2-律师 3-文章 4-系统
					operateType: 4,      // 1-阅读 2-转发 3-点赞 4-关注 10-取消阅读 20-取消转发 30-取消点赞 40-取消关注
					}
					utils.get(URL.user.cancelattention, params, function () {
						utils.msg('操作成功');
						_t.getLawyer()
					})
				})
				// 取消关注
				$('.cancelCollect').off().on('click', function () {
					var id = $(this).closest('li').data('id');
					var params = {
					businessId: id,
					operateBusiness: 2,  // 操作对象1-订单 2-律师 3-文章 4-系统
					operateType: 40,      // 1-阅读 2-转发 3-点赞 4-关注 10-取消阅读 20-取消转发 30-取消点赞 40-取消关注
					}
					utils.get(URL.user.cancelattention, params, function () {
						utils.msg('操作成功');
						_t.getLawyer()
					})
				})
			})
		},

		getLegalNews: function () {
			var params = {}
			params[global.rows] = 10;
			params[global.page] = 1;
			params.noAuth = 1;
			utils.get(URL.news.query, params, function (res) {
				var data = res.data.list || []
				var html = utils.getTemp('/page/home/newsList.html', data)
				$('.index_legalNewsList .picList').html(html);
				
				$(".index_legalNewsList .picMarquee-left").slide({mainCell:".bd ul",autoPlay:true,effect:"leftMarquee",vis:5,interTime:50});
			})
		},

		getNewLegal: function () {
			var params = {}
			params[global.rows] = 10;
			params[global.page] = 1;
			params.noAuth = 1;
			utils.get(URL.news.query, params, function (res) {
				var data = res.data.list || []
				var html = utils.getTemp('/page/home/newsList.html', data)
				$('.index_newLegalList .picList').html(html);
				
				$(".index_newLegalList .picMarquee-left").slide({mainCell:".bd ul",autoPlay:true,effect:"leftMarquee",vis:5,interTime:50});
			})
		},

		getCompanyNews: function () {
			var params = {}
			params[global.rows] = 10;
			params[global.page] = 1;
			params.noAuth = 1;
			utils.get(URL.news.query, params, function (res) {
				var data = res.data.list || []
				var html = utils.getTemp('/page/home/companyNewsList.html', data)
				$('.index_company_news .picList').html(html);
				
				$(".index_company_news .picMarquee-left").slide({mainCell:".bd ul",autoPlay:true,effect:"leftMarquee",vis:4,interTime:50});
			})
		},
	}

	// 点击事件
	gather.init();

	exports('index', gather);
});

function showLocation(data) {
	var province = data.result.ad_info.province || ''
	var city = data.result.ad_info.city || ''
	var district = data.result.ad_info.district || ''
	if (province) {
		province = province.replace('省', '')
	}
	if (city) {
		city = city.replace('市', '')
	}
	if (district) {
		district = district.replace('区', '')
	}
	var areas = [province, city, district]
	utils.setCookie(global.areaCookie, JSON.stringify(areas));
	var index = layui.index;
	index.getLawyer()
}
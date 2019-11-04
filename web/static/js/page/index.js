layui.define(function (exports) {

	var gather = {
		init: function () {

			carousel.render({
				elem: '#indexBanner'
				, width: '1200px'
				, height: '376px'
			});

			// base.openRedPacket();

			this.getLocation()

			this.getLawyer()

			this.getQuestionType()

			// 法律文章精选
			this.getLegalNews()

			// 最新法律速递
			this.getNewLegal()

			// 公司新闻
			this.getCompanyNews()

			// 获取地区
			base.hotCity();
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
			params.city = areas.name;
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
				$('.index_legalNewsList .swiper-wrapper').html(html);

				new Swiper('.index_legalNewsList .swiper-container', {
					slidesPerView: 4.5,
					spaceBetween: 30,
					freeMode: true
				});
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
				$('.index_newLegalList .swiper-wrapper').html(html);

				new Swiper('.index_newLegalList .swiper-container', {
					slidesPerView: 4.5,
					spaceBetween: 30,
					freeMode: true
				});
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
				$('.index_company_news .swiper-wrapper').html(html);

				new Swiper('.index_company_news .swiper-container', {
					slidesPerView: 3,
					spaceBetween: 30,
					slidesPerGroup: 3,
					loop: true,
					loopFillGroupWithBlank: true,
					pagination: {
					  el: '.swiper-pagination',
					  clickable: true,
					},
				});
			})
		},
	}

	// 点击事件
	gather.init();

	exports('index', gather);
});

function showLocation(data) {
	var city = data.result.ad_info.city || ''
	if (city) {
		city = city.replace('市', '')
	}
	var items = {"id":'',"name":city}
	utils.cookie(global.areaCookie, JSON.stringify());
	var index = layui.index;
	index.getLawyer()
}
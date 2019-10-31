layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;

			carousel.render({
				elem: '#indexBanner'
				, width: '1200px'
				, height: '376px'
			});

			this.getQuestionType();

			// 法律文章精选
			this.getLegalNews()

			// 公司新闻
			this.getCompanyNews()

			this.getOrderList(1, 'systemPush')
			this.getOrderList(2, 'orderList')
			this.getOrderList(4, 'customerAssign')

			$('.countTimes').each(function () {
				utils.countTimes($(this));
			});

			_t.actions();
		},

		getQuestionType: function () {
			var _t = this;
			var box = $('.clm_3_1')
			var data = base.getQuestionType()
			_t.questionType = data;
			box.each(function () {
				var _this = $(this);
				$.each(data, function (i, t) {
					t.url = _this.data('url');
				})
				var html = utils.getTemp('/page/home/questionType.html', data)
				$(this).find('ul').html(html);
			})
		},

		getOrderList: function (orderSource, box) {
			var _t = this;
			// 获取本地律师
			var params = {}
			params[global.rows] = 5;
			params[global.page] = 1;
			params.orderSource = orderSource
			utils.get(URL.lawyerObj.order.query, params, function (res) {
				let list = res.data.list || []

				$.each(list, function (index, item) {
					$.each(global.rs.orderStatus, function (i, t) {
						if (t.id == item.orderStatus) {
							item.statusName = t.name;
						}
					})
					$.each(global.rs.orderType, function (i, t) {
						if (t.id == item.orderType) {
							item.typeName = t.name;
						}
					})
					$.each(global.rs.orderCategory, function (i, t) {
						if (t.id == item.orderCategory) {
							item.categoryName = t.name;
						}
					})
					$.each(_t.questionType, function (i, t) {
						if (t.id == item.questionType) {
							item.questionTypeName = t.name;
						}
					})
				})
				var html = utils.getTemp('/lawyer/temp/home/' + box + '.html', list)
				$('.' + box).find('ul').html(html);
			})
		},

		getLegalNews: function () {
			var params = {}
			params[global.rows] = 10;
			params[global.page] = 1;
			params.noAuth = 1;
			utils.get(URL.lawyerObj.news.query, params, function (res) {
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

		getCompanyNews: function () {
			var params = {}
			params[global.rows] = 10;
			params[global.page] = 1;
			params.noAuth = 1;
			utils.get(URL.lawyerObj.news.query, params, function (res) {
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

		actions: function () {
			var _t = this;
		}
	}

	// 点击事件
	gather.init();
});
layui.define(function (exports) {

	var gather = {
		init: function () {

			carousel.render({
				elem: '#indexBanner'
				, width: '1200px'
				, height: '376px'
			});

			// base.openRedPacket();

			this.getLawyer()

			this.getQuestionType()

			// 法律文章精选
			this.getLegalNews()

			// 最新法律速递
			this.getNewLegal()

			// 公司新闻
			this.getCompanyNews()
		},

		getQuestionType: function () {
			var data = base.getQuestionType()
			var html = utils.getTemp('/page/home/questionType.html', data)
			$('.clm_3_1 ul').html(html);
		},

		getLawyer: function () {
			var areas = utils.cookie(global.areaCookie);
			var params = {}
			params[global.rows] = 5;
			params[global.page] = 1;
			params.city = areas.name;
			params.noAuth = 1;
			utils.get(URL.lawyer.query, params, function (res) {
				var data = res.data.list || []
				var html = utils.getTemp('/page/home/lawyerList.html', data)
				$('.index_ccbox2_1').html(html);
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
});
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

			$.get('/static/js/plugin/jquery.SuperSlide.2.1.3.js', function () {
				// 法律文章精选
				_t.getLegalNews()

				// 最新法律速递
				_t.getNewLegal()

				// 公司新闻
				_t.getCompanyNews()
			})

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
			params.orderStatus = 20;
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
				$('.' + box).find('.index_ccbox2_1').html(html);
			})
		},

		getLegalNews: function () {
			var params = {}
			params[global.rows] = 10;
			params[global.page] = 1;
			params.type = 1;
			params.noAuth = 1;
			utils.get(URL.lawyerObj.news.query, params, function (res) {
				var data = {}
				data.list = res.data.list || []
				data.type = params.type
				var html = utils.getTemp('/page/home/newsList.html', data)
				$('.index_legalNewsList .picList').html(html);
				
				$(".index_legalNewsList .picMarquee-left").slide({mainCell:".bd ul",autoPlay:true,effect:"leftMarquee",vis:5,interTime:50});
			})
		},

		getNewLegal: function () {
			var params = {}
			params[global.rows] = 10;
			params[global.page] = 1;
			params.type = 2;
			params.noAuth = 1;
			utils.get(URL.lawyerObj.news.query, params, function (res) {
				var data = {}
				data.list = res.data.list || []
				data.type = params.type
				var html = utils.getTemp('/page/home/newsList.html', data)
				$('.index_newLegalList .picList').html(html);
				
				$(".index_newLegalList .picMarquee-left").slide({mainCell:".bd ul",autoPlay:true,effect:"leftMarquee",vis:5,interTime:50});
			})
		},

		getCompanyNews: function () {
			var params = {}
			params[global.rows] = 10;
			params[global.page] = 1;
			params.type = 3;
			params.noAuth = 1;
			utils.get(URL.lawyerObj.news.query, params, function (res) {
				var data = {}
				data.list = res.data.list || []
				data.type = params.type
				var html = utils.getTemp('/page/home/companyNewsList.html', data)
				$('.index_company_news .picList').html(html);
				
				$(".index_company_news .picMarquee-left").slide({mainCell:".bd ul",autoPlay:true,effect:"leftMarquee",vis:4,interTime:50});
			})
		},

		actions: function () {
			var _t = this;

			//接受订单
			$('body').on('click', '.handleReceive', function () {
				var a = $(this);
				utils.confirm('确定接单？', function () {
					var id = a.closest('li').data('id')
					var params = {
						orderId: id
					}
					utils.get(URL.lawyerObj.order.accept, params, function () {
						utils.msg('操作成功');
	
						_t.getOrderList(1, 'systemPush')
						_t.getOrderList(2, 'orderList')
						_t.getOrderList(4, 'customerAssign')
					})
				})
			});

			// 拒绝接单 
			$('body').on('click', '.handleRefuse', function () {
				var a = $(this);
				utils.confirm('确定拒绝接单？', function () {
					var id = a.closest('li').data('id')
					var params = {
						orderId: id
					}
					utils.get(URL.lawyerObj.order.refuse, params, function () {
						utils.msg('操作成功');
	
						_t.getOrderList(1, 'systemPush')
						_t.getOrderList(2, 'orderList')
						_t.getOrderList(4, 'customerAssign')
					})
				})
			});
		}
	}

	// 点击事件
	gather.init();
});
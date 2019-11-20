layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.type = utils.getQueryString('type');

			_t.getBranch();

			_t.queryList();

			base.getLawyerOrderList();

			//接受订单
			$('body').on('click', '.handleReceive', function () {
				var a = $(this);
				var id = a.closest('li').data('id')
				var params = {
					orderId: id
				}
				utils.get(URL.lawyerObj.order.accept, params, function () {
					utils.msg('操作成功');
					base.getLawyerOrderList();
				})
			});

			// 拒绝接单 
			$('body').on('click', '.handleRefuse', function () {
				var a = $(this);
				var id = a.closest('li').data('id')
				var params = {
					orderId: id
				}
				utils.get(URL.lawyerObj.order.refuse, params, function () {
					utils.msg('操作成功');
					base.getLawyerOrderList();
				})
			});
		},

		queryList: function () {
			var _t = this;
			var qlps = {
				url: URL.lawyerObj.news.query,
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
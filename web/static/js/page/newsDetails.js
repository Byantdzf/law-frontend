layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.id = utils.getQueryString('id');


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
			_t.getData();

			_t.getLawyerList();

			$('.handleZan').off().on('click', function () {
				var params = {
				  businessId: _t.id,
				  operateBusiness: 3,  // 操作对象1-订单 2-律师 3-文章 4-系统
				  operateType: 3,      // 1-阅读 2-转发 3-点赞 4-关注 10-取消阅读 20-取消转发 30-取消点赞 40-取消关注
				}
				utils.get(URL.user.cancelattention, params, function () {
					utils.msg('操作成功');
					_t.getData();
				})
			})
		},

		getData: function () {
			var _t = this;
			utils.get(URL.news.getById + _t.id, function (res) {
				var data = res.data;
				$('.ccbox_sectiton .tt').html(data.title);
				$('.time').html(data.createTime);
				$('.ccbox_sectiton .icon-read').next().html(data.readCount);
				$('.ccbox_sectiton .icon-share').next().html(data.forwardCount);
				$('.ccbox_sectiton .icon-zan').next().html(data.thumbsUpCount);
				$('.newsContent').html(data.content);
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
		}

	}

	// 点击事件
	gather.init();
});
layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.id = utils.getQueryString('id');
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
			_t.getData();

			_t.getLawyerList();

			$('.handleZan').off().on('click', function () {
				if (utils.cookie(global.token)) {
					var params = {
					  businessId: _t.id,
					  operateBusiness: 3,  // 操作对象1-订单 2-律师 3-文章 4-系统
					  operateType: 3,      // 1-阅读 2-转发 3-点赞 4-关注 10-取消阅读 20-取消转发 30-取消点赞 40-取消关注
					}
					utils.get(URL.user.cancelattention, params, function () {
						utils.msg('操作成功');
						_t.getData();
					})
				} else {
					utils.confirm('登录以后才可以操作，是否登录？', function () {
						base.wxLogin(function (data) {
							window.location.reload();
						})
					})
				}
			});

			$('.handleShare').off().on('click', function () {
				var html = '<div class="shareBox">';
				html += '<p>复制文章链接：' + window.location.href + '</p>';
				html += '</div>';
	
				var ops = {
					type: 1,
					title: '转发',
					area: '600px',
					center: 1,
					content: html
				};
				utils.dialog(ops);
			});
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
				var html = utils.getTemp('/page/common/reclawyerTemp.html', data)
				$('.newsRight ul').html(html);
			})
		},

		getBranch: function () {
			var _t = this;
			var location = '';
			switch (_t.type) {
				case "1":
					location = '<a href="/news.html?type=' + _t.type + '">法律文章精选</a>';
					break;
				case "2":
					location = '<a href="/news.html?type=' + _t.type + '">最新法律速递</a>';
					break;
				case "3":
					location = '<a href="/news.html?type=' + _t.type + '">公司新闻</a>';
					break;
			}
			if (location) {
				$('.bread_tips').append(location);
			}
		}

	}

	// 点击事件
	gather.init();
});
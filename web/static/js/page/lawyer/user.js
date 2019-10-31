layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.defaultPic = '/static/images/default.jpg';
			_t.userMenu = [
				{ "id": 10, "name": "我的主页", "code": "home", "url": "/page/lawyer/user/index.js" },
				{ "id": 1, "name": "个人资料", "code": "info", "url": "/page/lawyer/user/info.js" },
				{ "id": 2, "name": "我的关注", "code": "attention", "url": "/page/lawyer/user/attention.js" },
				{ "id": 3, "name": "我的订单", "code": "order", "url": "/page/lawyer/user/order.js" },
				{ "id": 5, "name": "消息中心", "code": "notice", "url": "/page/lawyer/user/notice.js" },
				{ "id": 6, "name": "关于我们", "code": "about", "url": "/about.html" },
				{ "id": 7, "name": "帮助中心", "code": "help", "url": "/page/lawyer/user/help.js" },
				{ "id": 8, "name": "用户协议", "code": "agreement", "url": "/page/lawyer/user/agreement.js" },
				{ "id": 9, "name": "意见反馈", "code": "feedback", "url": "/page/lawyer/user/feedback.js" },
				{ "id": 10, "name": "退出登录", "code": "logout" }
			];
			
			$(function () {
				_t.code = hash.get('c') || _t.userMenu[0].code;

				_t.loadUserPage();
				$('.userPage').removeClass('noMinHeight');
			});
		},

		loadUserPage: function () {
			var _t = this;
			var data = _t;
			data.userInfo = global.userInfo || {};
			data.menu = _t.userMenu || [];
			var html = utils.getTemp('/page/user/userPage.html', data);
			$('.userPage').html(html);

			var score = data.userInfo.score || 0;
			$('.userHead').append('<em class="userScore">' + score + '分</em>');

			// 默认跳转到哪个页面
			_t.getPageByCode();
			$('.userMenu').on('click', 'a', function () {
				_t.code = $(this).data('code');
				if (_t.code != 'about') {
					$(this).addClass('curr').closest('li').siblings().find('a').removeClass('curr');
					var hashObj = {};
					hashObj.c = _t.code;
					hash.add(hashObj);
				}
				_t.getPageByCode();
			})
		},

		getPageByCode: function () {
			var _t = this;
			if (_t.code == 'logout') {
				base.logout();
				return;
			} else if (_t.code == 'about') {
				return;
			}
			var item = {};
			$.each(_t.userMenu, function (i, t) {
				if (t.code == _t.code) {
					item = t;
				}
			});
			var url = item.url;

			$('.userPageTit h3').html(item.name);

			$.getScript('/static/js' + url);

			$('body,html').animate({ scrollTop:0  }, 0);
		}
	}

	// 点击事件
	gather.init();
});
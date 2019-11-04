layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.defaultPic = '/static/images/default.jpg';
			_t.userMenu = [
				{ "id": 1, "name": "我的关注", "code": "attention", "url": "/page/user/attention.js" },
				{ "id": 2, "name": "我的优惠券", "code": "coupon", "url": "/page/user/coupon.js" },
				{ "id": 3, "name": "我的订单", "code": "order", "url": "/page/user/order.js" },
				{ "id": 4, "name": "消息中心", "code": "notice", "url": "/page/user/notice.js" },
				{ "id": 5, "name": "关于我们", "code": "about", "url": "/about.html" },
				{ "id": 6, "name": "帮助中心", "code": "help", "url": "/page/user/help.js" },
				{ "id": 7, "name": "用户协议", "code": "agreement", "url": "/page/user/agreement.js" },
				{ "id": 8, "name": "意见反馈", "code": "feedback", "url": "/page/user/feedback.js" },
				{ "id": 9, "name": "退出登录", "code": "logout" }
			];

			$(function () {
				_t.code = hash.get('c') || _t.userMenu[0].code;

				if ($.isEmptyObject(utils.cookie(global.token))) {
					// 如果没有本地用户
					_t.loadChooseUserType();
					$('.userPage').addClass('noMinHeight');
				} else {
					// 如果有本地用户
					_t.loadUserPage();
					$('.userPage').removeClass('noMinHeight');
				}
			})
		},

		loadChooseUserType: function () {
			var _t = this;
			var html = utils.getTemp('/page/user/chooseUserType.html');
			$('.userPage').html(html);

			$('body').on('click', '.user', function () {
				var params = {
					accessPage: 'http://localhost:9999/user.html'
				};
				utils.get(URL.user.wxLogin, params, function (res) {
					console.log(res);
				});
				// utils.get(pcHost + '/pc/user/loginByAccount', {account: '13600001111', pwd: '123456', from: 1}, function (res) {
				// 	utils.setCookie('account', '13600001111');
				// 	utils.setCookie(global.token, res.data.sessionId);
				// 	utils.get(URL.user.info, function (res) {
				// 		utils.setCookie(global.userInfoToken, JSON.stringify(res.data));
				// 		_t.loadUserPage();
				// 	})
				// 	_t.loadUserPage();
				// })
				// base.login(function () {
				// 	utils.setCookie(global.userInfoToken, global.userInfo);
				// 	_t.loadUserPage();
				// });
			});

			$('body').on('click', '.lawyer', function () {
				window.location = '/login.html';
			});
		},

		loadUserPage: function () {
			var _t = this;
			var data = _t;
			data.userInfo = global.userInfo || {};
			data.menu = _t.userMenu || [];
			var html = utils.getTemp('/page/user/userPage.html', data);
			$('.userPage').html(html);

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
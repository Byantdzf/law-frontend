layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;

			form.on('submit(loginSubmit)', function (res) {
				var params = res.field;
				params.from = 2;
				utils.get(URL.lawyerObj.login, params, function (res) {
					utils.setCookie(global.token, res.data.sessionId);
					utils.get(URL.lawyerObj.info, params, function (res) {
						utils.setCookie(global.userInfoToken, JSON.stringify(res.data));
						window.location = '/lawyer/index.html'
					})
				})
				// utils.alert('还未绑定微信，立即绑定', {}, function () {
				// 	utils.msg('绑定成功');
				// 	utils.setCookie(global.userInfoToken, global.userInfo);
				// 	setTimeout(function () {
				// 		window.location = '/lawyer/auth.html';
				// 	}, 1000);
				// });
			})

			$('.wechatLogin').click(function () {
				utils.alert('扫码登录成功，点击确定，跳转到绑定手机页面', {}, function () {
					utils.setCookie(global.userInfoToken, global.userInfo);
					window.location = '/lawyer/bind.html';
				});
			});
		}
	}

	// 点击事件
	gather.init();
});
layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;

			form.on('submit(loginSubmit)', function () {
				utils.alert('还未绑定微信，立即绑定', {}, function () {
					utils.msg('绑定成功');
					setTimeout(function () {
						window.location = '/lawyer/auth.html';
					}, 1000);
				});
			})

			$('.wechatLogin').click(function () {
				
			});
		}
	}

	// 点击事件
	gather.init();
});
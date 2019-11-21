layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;


			$('body').on('click', '.getSmsCode', function () {
				var mobile = $.trim($('.mobile').val())
				if (base.checkMobile(mobile)) {
					utils.msg('请输入正确的手机号码');
					return
				}
				if (!$(this).attr('disabled')) {
					base.timeCount('.getSmsCode', global.smsTime)
					utils.get(URL.common.getSmsCode, {phone: mobile, noAuth: 1}, function (res) {
					})
				}
			})

			form.on('submit(bindSubmit)', function (res) {
				var params = res.field;
				params.noAuth = 1;
				params.state = utils.cookie(global.lawyerToken);

				utils.post(URL.lawyerObj.bindMobile, params, function (res) {
					utils.setCookie(global.userInfoToken, JSON.stringify(res.data));
					utils.alert('恭喜，您已绑定成功！', {}, function () {
						window.location = '/lawyer/index.html';
					})
				})
			});
		}
	}

	// 点击事件
	gather.init();
});
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
					utils.get(URL.common.getSmsCode, {phone: mobile}, function (res) {
					})
				}
			})

			form.on('submit(forgetSubmit)', function (res) {
				var params = res.field;
				console.log(params);

				utils.get(URL.lawyerObj.findPass, params, function(res) {
					utils.alert('重置密码成功，点确定登录', '', function () {
						window.location = '/lawyer/login.html';
					});
				})
			})
		}
	}

	// 点击事件
	gather.init();
});
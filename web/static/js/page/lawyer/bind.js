layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;

			$('.nav').find('a').attr('href', 'javascrtip:;');

			form.on('submit(bindSubmit)', function () {
				utils.alert('恭喜，您已绑定成功！', {}, function () {
					window.location = '/lawyer/auth.html';
				})
			});
		}
	}

	// 点击事件
	gather.init();
});
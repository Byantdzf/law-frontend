layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;

			_t.loadPage();
		},

		loadPage: function () {
			var _t = this;
			var data = {};
			var html = utils.getTemp('/page/user/feedback.html', data);
			$('.userPageCon').html(html);
			form.render();

			form.on('submit(feedbackSubmit)', function (res) {
				var params = res.field
				utils.post(URL.user.feedback, params, function (res) {
					utils.alert('提交成功');
					$('textarea').val('');
				})
			})
		}
	}

	// 点击事件
	gather.init();
});
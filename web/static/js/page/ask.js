layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.id = utils.getQueryString('id');
			_t.hasLawyer = _t.id ? 1 : '';

			if (_t.id) {
				$('.oto_form_header').removeClass('hidden');
			}

			_t.getUserStatus()

			form.on('submit(questionSubmit)', function (res) {
				var params = res.field;
				window.location = 'order.html?id=1&type=1&hasLawyer=' + _t.hasLawyer;
			})
		},

		getUserStatus: function () {
			utils.get(URL.common.isRegister, function (res) {
				console.log(res);
			})
		}
	}

	// 点击事件
	gather.init();
});
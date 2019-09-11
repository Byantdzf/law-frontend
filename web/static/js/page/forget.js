layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;

			form.on('submit(forgetNext)', function () {
				$('.step1').addClass('hidden');
				$('.step2').removeClass('hidden');
			})

			form.on('submit(forgetSubmit)', function () {
				$('.step2').addClass('hidden');
				$('.step3').removeClass('hidden');
			})
		}
	}

	// 点击事件
	gather.init();
});
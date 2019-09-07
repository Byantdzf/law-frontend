layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			
			$('body').find('textarea').each(function () {
				var max = $(this).attr('maxlength');
				$(this).next().find('em').html(max);
			});

			$('body').on('keyup', 'textarea', function () {
				var min = $(this).attr('minlength');
				var max = $(this).attr('maxlength');
				var value = $(this).val();
				value = value.replace(/\n|\r/gi,"");
				var len = value.length;
				var box = $(this).next();
				box.find('span').html(len);
				if (len < min || len > max) {
					box.addClass('fontRed');
				} else {
					box.removeClass('fontRed');
				}
			})

			form.on('submit(questionSubmit)', function (res) {
				var params = res.field;
				_t.gotoStepTwo();
			})
		},

		gotoStepTwo: function () {
			var _t = this;
			$('.questions').addClass('hidden');
			$('.setPay').removeClass('hidden');


			form.on('submit(paySubmit)', function (res) {
				var params = res.field;
				_t.gotoPay();
			})
			
		},

		gotoPay: function () {
			var _t = this;
			
			utils.msg('支付中...');
			setTimeout(() => {
				utils.msg('支付完成');
				_t.gotoPaySuccess();
			}, 1000);
		},

		gotoPaySuccess: function () {
			var _t = this;
			$('.setPay').addClass('hidden');
			$('.paySuccess').removeClass('hidden');


			form.on('submit(returnFirst)', function (res) {
				var params = res.field;
				window.location = '/';
			})
		}
	}

	// 点击事件
	gather.init();
});
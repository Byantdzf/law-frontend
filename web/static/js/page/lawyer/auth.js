layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;

			$('.nav').find('a').attr('href', 'javascrtip:;');

			form.on('submit(authSubmit)', function () {
				window.location = '/lawyer/waitAuth.html';
			});

			if ($('.showTestCount').length) {
				var t = 3;
				var timer = null;
				timer = window.setInterval(function () {
					t--;
					$('.showTestCount em').html(t);
					if ( t == 0) {
						window.clearInterval(timer);
						window.location = '/lawyer/index.html';
						layer.close(index);
					}
				}, 1000);
			}
		}
	}

	// 点击事件
	gather.init();
});
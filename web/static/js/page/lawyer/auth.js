layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;

			$('.nav').find('a').attr('href', 'javascrtip:;');

			_t.initUpload('.uploadIdCard');
			_t.initUpload('.uploadBusinessCard');

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
		},
    
		// 初始化图片上传功能
		initUpload: function (btn, callback) {
			// 上传图片
			var p = {};
			p.btn = btn;
			p.accept = {
				extensions: 'jpg,jpeg,png,gif',
				mimeTypes: '.jpg,.jpeg,.png,.gif'
			};
			utils.uploadFiles(p, function(res) {
				var url = res.data;
				$(btn).html('<img src="' + url + '" />');
			});
		},
	}

	// 点击事件
	gather.init();
});
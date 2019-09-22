layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.isEdit = false;
			_t.reUpload = false;

			_t.loadPage();
		},

		loadPage: function () {
			var _t = this;
			var data = {};
			data.isEdit = _t.isEdit;
			data.reUpload = _t.reUpload;
			var html = utils.getTemp('/page/lawyer/user/info.html', data);
			$('.userPageCon').html(html);
			form.render();

			$('body').find('textarea').each(function () {
				base.setTextarea($(this));
			});

			_t.initUpload('.uploadAvatar');
			
			_t.initUpload('.uploadIdCard');
			_t.initUpload('.uploadBusinessCard');
			_t.initUpload('.uploadOtherCard');

			_t.loadCateList();

			$('.editLawyerInfo').off().on('click', function () {
				_t.isEdit = true;
				_t.loadPage();
			})

			$('.reUpload').off().on('click', function () {
				_t.reUpload = true;
				_t.loadPage();
			})

			form.on('submit(authSubmit)', function (res) {
				window.location = 'waitAuth.html';
			});

			form.on('submit(updateBaseSubmit)', function (res) {
				utils.msg('保存成功');
				_t.isEdit = false;
				_t.loadPage();
			});
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
				$('.avatar img').attr('src', url);
			});
		},

		loadCateList: function () {
			var _t = this;
			utils.getSync(URL.select.getCate, function (res) {
				var list = res.data;
				var html = '';
				$.each(list, function (i, t) {
					html += '<input type="checkbox" name="likes" lay-skin="primary" value="' + t.id + '" title="'+t.name+'" lay-filter="likesChange">';
				})
				$('.checkboxList').html(html);
				form.render('checkbox');
			});

			form.on('checkbox(likesChange)', function (elem) {
				var len = $('.checkboxList input[type="checkbox"]:checked').length;
				if (len > 6) {
					elem.elem.checked = false;
					form.render('checkbox');
					utils.alert('最多只可选择6项');
				}
			});
		},
	}

	// 点击事件
	gather.init();
});
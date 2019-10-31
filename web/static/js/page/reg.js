layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.hasZone = 1;

			_t.loadCateList();
			base.loadArea(_t);

			_t.initUpload('.uploadIdCard1');
			_t.initUpload('.uploadIdCard2');
			_t.initUpload('.uploadBusinessCard');

			$('body').on('click', '.getSmsCode', function () {
				var mobile = $.trim($('.mobile').val())
				if (base.checkMobile(mobile)) {
					utils.msg('请输入正确的手机号码');
					return
				}
				if (!$(this).attr('disabled')) {
					utils.get(URL.common.getSmsCode, {phone: mobile}, function (res) {
						base.timeCount('.getSmsCode', global.smsTime)
					})
				}
			})

			form.on('submit(regSubmit)', function (elem) {
				var params = elem.field;
				if (params.pwd != params.rePwd) {
					utils.msg('再次密码输入不一致，请重试')
					return
				}
				if (params.pwd != params.rePwd) {
					utils.msg('再次密码输入不一致，请重试')
					return
				}

				var ids = [];
				$('.checkboxList').find('input:checked').each(function () {
					ids.push($(this).val());
				})
				params.provice = $('.provice').find('option:selected').html();
				params.city = $('.city').find('option:selected').html();
				params.zone = $('.zone').find('option:selected').html();
				params.goodAt = ids.join(',')

				var imgArr = [
					{
						businessType: 1,
						fileName: $('.idCard1').attr('src') != '/static/images/idcard1.jpg' ? $('.idCard1').attr('src') : ''
					},
					{
						businessType: 10,
						fileName: $('.idCard2').attr('src') != '/static/images/idcard2.jpg' ? $('.idCard2').attr('src') : ''
					},
					{
						businessType: 2,
						fileName: $('.idCard3').attr('src') != '/static/images/businessCard.jpg' ? $('.idCard3').attr('src') : ''
					}
				]
				params.uploadFiles = imgArr
				utils.postJson(URL.lawyerObj.reg, params, function (res) {
					utils.alert('注册成功，点击登录', {}, function () {
						window.location = '/login.html';
					})
				})
			});
		},

		loadCateList: function () {
			var _t = this;
			var data = base.getQuestionType()
			var html = '';
			$.each(data, function (i, t) {
				html += '<input type="checkbox" name="likes" lay-skin="primary" value="' + t.id + '" title="'+t.name+'" lay-filter="likesChange">';
			})
			$('.checkboxList').html(html);
			form.render('checkbox');

			form.on('checkbox(likesChange)', function (elem) {
				var len = $('.checkboxList input[type="checkbox"]:checked').length;
				if (len > 6) {
					elem.elem.checked = false;
					form.render('checkbox');
					utils.alert('最多只可选择6项');
				}
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
				$(btn).find('img').attr('src', url);
			});
		},
	}

	// 点击事件
	gather.init();
});
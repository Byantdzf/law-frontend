layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.isEdit = false;
			_t.reUpload = false;

			utils.getSync(URL.select.getProvCity, function (res) {
				_t.areaList = res.data;
			});
			_t.loadData();
		},

		loadData: function () {
			var _t = this;
			utils.get(URL.lawyerObj.info, function (res) {
				res.data.province = res.data.province ? res.data.province.replace('省', '') : '';
				res.data.city = res.data.city ? res.data.city.replace('市', '') : '';
				res.data.zone = res.data.zone ? res.data.zone.replace('区', '') : '';
				_t.data = res.data;
				_t.loadPage();
			});
		},

		loadPage: function () {
			var _t = this;

			var data = _t.data || {};
			data.isEdit = _t.isEdit;
			data.reUpload = _t.reUpload;
			var html = utils.getTemp('/page/lawyer/user/info.html', data);
			$('.userPageCon').html(html);
			form.render();
			
			// 编辑省市县
			$.each(_t.areaList, function (i, t) {
				t.id = t.name
			});
			utils.getSelect(_t.areaList, '.province', '请选择省', data.province);
			if (data.city) {
				var cityData = []
				$.each(_t.areaList, function (i, t) {
					if (t.name == data.province) {
						cityData = t.city
						$.each(cityData, function (i2, t2) {
							t2.id = t2.name;
						});
					}
				});
				utils.getSelect(cityData, '.city', '请选择市', data.city);
			}
			form.on('select(changeprovince)', function (res) {
				var code = res.value
				
				var cityData = []
				$.each(_t.areaList, function (i, t) {
					if (t.name == code) {
						cityData = t.city
						$.each(cityData, function (i2, t2) {
							t2.id = t2.name;
						});
					}
				});
				utils.getSelect(cityData, '.city', '请选择市', data.city);
			})
			form.on('select(changeCity)', function (res) {
				var code = res.value
				var prov = $('.province').val();
				var cityData = []
				var zoneData = []
				$.each(_t.areaList, function (i, t) {
					if (t.name == prov) {
						cityData = t.city
						$.each(cityData, function (i2, t2) {
							if (t2.name == code) {
								zoneData = t2.area || []
								$.each(zoneData, function (i3, t3) {
									t3.id = t3.name;
								});
							}
						});
					}
				});
				utils.getSelect(zoneData, '.zone', '请选择区', data.zone);
			})

			$('body').find('textarea').each(function () {
				base.setTextarea($(this));
			});

			_t.initUpload('.uploadAvatar');
			
			_t.initUpload('.uploadIdCard');

			_t.initUpload('.uploadIdCard1');
			_t.initUpload('.uploadIdCard2');
			_t.initUpload('.uploadIdCard3');
			_t.initUpload('.uploadBusinessCard');
			_t.initUpload('.uploadOtherCard');

			_t.loadCateList(data.goodAt);

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
				var params = res.field || {};

				params.id = _t.data.id;
				
				var mobile = $.trim(params.contactMobile)
				if (base.checkMobile(mobile)) {
					utils.msg('请输入正确的手机号码');
					return
				}
				var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
				if (!reg.test(params.email)) {
					utils.msg('请输入正确的邮箱地址');
					return
				}
				var ids = [];
				$('.checkboxList').find('input:checked').each(function () {
					ids.push($(this).val());
				})
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
					// {
					// 	businessType: 20,
					// 	fileName: $('.idCard4').attr('src') != '/static/images/idcard3.jpg' ? $('.idCard4').attr('src') : ''
					// },
					{
						businessType: 2,
						fileName: $('.idCard3').attr('src') != '/static/images/businessCard.jpg' ? $('.idCard3').attr('src') : ''
					}
				]
				params.uploadFiles = imgArr
				console.log(params);
				utils.postJson(URL.lawyerObj.update, params, function (res) {
					utils.msg('保存成功');
					_t.isEdit = false;
					_t.loadData();
				})
			});
		},
    
		// 初始化图片上传功能
		initUpload: function (btn) {
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

		loadCateList: function (goodAt) {
			var _t = this;

			var arr = goodAt ? goodAt.split(',') : [];
			var data = base.getQuestionType()
			var html = '';
			$.each(data, function (i, t) {
				t.id = t.name;
				var clz = ''
				if ($.inArray(t.name, arr) > -1) {
					clz = 'checked';
				}
				html += '<input type="checkbox" name="likes" ' + clz + ' lay-skin="primary" value="' + t.id + '" title="'+t.name+'" lay-filter="likesChange">';
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
	}

	// 点击事件
	gather.init();
});
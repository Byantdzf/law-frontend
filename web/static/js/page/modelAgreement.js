layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;

			_t.loadRecommend();
			_t.queryList();
			_t.getQuestionType();

			$('body').on('click', '.showDetail', function() {
				_t.editBox($(this).closest('li').data('id'));
			});

			$('body').on('click', '.buyNow', function () {
				var data = $(this).closest('li')[0].data;
				var params = {}
				params.chooseService = data.id
				params.fileType = data.businessTypeName
				params.from = 2
				params.orderCategory = 41
				params.amount = data.price
				params.token = utils.cookie(global.token)
				utils.put(URL.issue.postTemplate, params, function (res) {
					var token = res.data.token;
					utils.setCookie(global.token, token);
					window.location = 'order.html?id=' + res.data.orderId + '&type=6';
				})
			});
		},

		loadRecommend: function () {
			var params = {}
			params.dictCode = 4;
			utils.getSync(URL.common.common, params, function (res) {
				var data = res.data || {}
				var src = data.image || '/static/images/nopic.jpg'
				$('.services_header img').removeClass('hidden').attr('src', src)
				$('.services_header p').html(data.brief || '')
				
			})
		},

		queryList: function () {
			var businessType = $('.modelAgreement_cate .on').data('id');
			var searchData = {};
			if (businessType) {
				searchData.businessTypes = businessType;
			}
			var qlps = {
				searchData: searchData,
				url: URL.template.query,
				box: '.modelAgreementListBox',
				temp: '/page/template/list.html'
			}
			utils.queryTempList(qlps);
		},

		getQuestionType: function () {
			var _t = this;
			var list = base.getQuestionType()
			var html = '<a href="javascript:;" class="on">全部</a>';
			$.each(list, function (i, t) {
				t.id = t.code
				var on = t.on ? ' class="on"' : '';
				html += '<a href="javascript:;" data-id="' + t.id + '"' + on + '>' + t.name + '</a>';
			})
			$('.modelAgreement_cate').html(html);
			$('.modelAgreement_cate').find('a').off().on('click', function () {
				$(this).addClass('on').siblings().removeClass('on')
				_t.queryList();
			})
		},

		editBox: function (id) {
			utils.get(URL.template.details + id, function (res) {
				var data = res.data;
				var list = base.getQuestionType()
				$.each(list, function (i, t) {
					if (t.id == data.businessType) {
						data.businessTypeName = t.name;
					}
				});
				data.price = data.price || 0;
				var formitem = [
					{
						title: "文件名称",
						label: data.fileName || '',
						cols: 12
					}, {
						title: "所属分类",
						label: data.businessTypeName || '',
						cols: 12
					}, {
						title: "更新时间",
						label: data.updateTime || '',
						cols: 12
					}, {
						title: "销量",
						label: data.sales || '',
						cols: 12
					}, {
						title: "价格",
						label: data.price + "元",
						cols: 12
					}, {
						title: "文件简介",
						type: 'html',
						html: data.brief || '',
						cols: 12
					}, {
						title: "适用范围",
						label: data.serviceRange || '',
						cols: 12
					}
				]
				var ops = {
					title: data.fileName || '',
					btn: ["立即购买"],
					class: "servicesRemark",
					success: function (layero) {
						$('.layui-layer-btn1').addClass('hidden');
						var obj = {};
						if (data) {
							if (utils.isType(data) == 'object') {
								utils.loadUpdateForm(layero, formitem, data);
							} else {
								utils.get(URL.select.getById, { id: data }, function (res) {
									obj = res.data || {};
									utils.loadUpdateForm(layero, formitem, obj);
								});
							}
						} else {
							utils.loadUpdateForm(layero, formitem);
						}
					},
					yes: function (index) {
						var params = {}
						params.chooseService = id
						params.fileType = data.businessType
						params.from = 2
						params.orderCategory = 41
						params.amount = data.price
						params.token = utils.cookie(global.token)
						utils.put(URL.issue.postTemplate, params, function (res) {
							var token = res.data.token;
							utils.setCookie(global.token, token);
							window.location = 'order.html?id=' + res.data.orderId + '&type=6';
						})
						layer.close(index);
					}
				};
				utils.openForm(ops);
			})
		}
	}

	// 点击事件
	gather.init();
});
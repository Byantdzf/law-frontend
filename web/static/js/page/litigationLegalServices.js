layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;

			_t.loadRecommend();
			_t.queryList();

			$('body').on('click', '.showDetail', function() {
				var id = $(this).closest('li').data('id')
				_t.editBox(id);
			});

			$('body').on('click', '.buyNow', function () {
				window.location = 'litigationLegalServicesAsk.html?id=' + $(this).closest('li').data('id');
			});
		},

		loadRecommend: function () {
			var params = {}
			params[global.rows] = 1;
			params[global.page] = 1;
			params.noAuth = 1;
			utils.getSync(URL.legal.queryLitigationLegalServices, params, function (res) {
				var data = res.data.list || []
				data = data[0] || {}
				var src = data.instructionPic || '//static/images/nopic.jpg'
				$('.services_header img').attr('src', src)
				$('.services_header p').html(data.instruction || '')
				
			})
		},

		queryList: function () {
			var qlps = {
				url: URL.legal.queryLitigationLegalServices,
				box: '.services_list',
				temp: '/page/legal/list.html'
			}
			utils.queryTempList(qlps);
		},

		editBox: function (id) {
			if (id) {
				utils.get(URL.legal.getById + id, function (res) {
					var data = res.data
					var formitem = [
						{
							title: "价格",
							label: data.price + "元",
							cols: 12
						}, {
							title: "销售量",
							label: data.salesCount,
							cols: 12
						}, {
							title: "服务说明",
							type: "html",
							html: data.instruction || '',
							cols: 12
						}, {
							title: "适用范围",
							type: "html",
							html: data.serviceRange || '',
							cols: 12
						}
					]
					var ops = {
						title: "服务说明",
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
							window.location = 'litigationLegalServicesAsk.html?id=' + id;
							layer.close(index);
						}
					};
					utils.openForm(ops);
				})
			}
		}
	}

	// 点击事件
	gather.init();
});
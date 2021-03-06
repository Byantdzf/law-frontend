﻿layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.type = utils.getQueryString('id');

			_t.loadRecommend(_t.type);
			_t.queryList();

			$('body').on('click', '.showDetail', function() {
				var id = $(this).closest('li').data('id')
				_t.editBox(id);
			});

			$('body').on('click', '.buyNow', function () {
				window.location = 'getLawyerAsk.html?id=' + $(this).closest('li').data('id');
			});
		},

		loadRecommend: function (t) {
			var params = {}
			params.dictCode = t;
			utils.getSync(URL.common.common, params, function (res) {
				var data = res.data || {}
				var src = data.image || '/static/images/nopic.jpg'
				$('.services_header img').removeClass('hidden').attr('src', src)
				$('.services_header p').html(data.brief || '')
				
			})
		},

		queryList: function () {
			var _t = this;
			var qlps = {
				url: URL.legal.queryLawyer,
				searchData: {
					serviceType: _t.type
				},
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
							label: data.priceRange + "元",
							cols: 12
						}, {
							title: "代理说明",
							type: "html",
							html: data.instruction || '',
							cols: 12
						}, {
							title: "适用范围",
							type: "html",
							html: data.serviceRange || '',
							cols: 12
						}, {
							title: "服务流程",
							type: "html",
							html: data.serviceSteps || '',
							cols: 12
						}
					]
					var ops = {
						title: "服务说明",
						btn: ["立即下单"],
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
							window.location = 'getLawyerAsk.html?id=' + id;
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
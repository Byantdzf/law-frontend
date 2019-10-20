layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;

			_t.loadRecommend();
			_t.queryList();

			$('body').on('click', '.showDetial', function() {
				_t.editBox();
			});

			$('body').on('click', '.buyNow', function () {
				window.location = 'order.html?id=1&type=3';
			});
		},

		loadRecommend: function () {
			var params = {}
			params[global.rows] = 1;
			params[global.page] = 1;
			params.noAuth = 1;
			utils.get(URL.legal.queryNonlitigationLegalServices, params, function (res) {
				var data = res.data.list || []
				console.log(data)
			})
		},

		queryList: function () {

		},

		editBox: function (data) {
			var formitem = [
				{
					title: "价格",
					label: "100元",
					cols: 12
				}, {
					title: "销售量",
					label: "1000",
					cols: 12
				}, {
					title: "服务说明",
					type: "html",
					html: "这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明。",
					cols: 12
				}, {
					title: "适用范围",
					type: "html",
					html: "这是该服务的使用范围说明，这是该服务的使用范围说明，这是该服务的使用范围说明，这是该服务的使用范围说明，这是该服务的使用范围说明，这是该服务的使用范围说明，这是该服务的使用范围说明，这是该服务的使用范围说明。",
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
					window.location = 'order.html?id=1&type=3';
					layer.close(index);
				}
			};
			utils.openForm(ops);
		}
	}

	// 点击事件
	gather.init();
});
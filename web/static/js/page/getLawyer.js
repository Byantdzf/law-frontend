layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;

			$('body').on('click', '.showDetial', function() {
				_t.editBox();
			});

			$('body').on('click', '.buyNow', function () {
				window.location = 'order.html?id=1&type=5';
			});
		},

		editBox: function (data) {
			var formitem = [
				{
					title: "价格",
					label: "100元~1000元",
					cols: 12
				}, {
					title: "代理说明",
					type: "html",
					html: "这是关于纯风险代理服务的说明，这是关于纯风险代理服务的说明，这是关于纯风险代理服务的说明，这是关于纯风险代理服务的说明，这是关于纯风险代理服务的说明，这是关于纯风险代理服务的说明，这是关于纯风险代理服务的说明，这是关于纯风险代理服务的说明，这是关于纯风险代理服务的说明，这是关于纯风险代理服务的说明。",
					cols: 12
				}, {
					title: "适用范围",
					type: "html",
					html: "这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明。",
					cols: 12
				}, {
					title: "服务流程",
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
					window.location = 'order.html?id=1&type=5';
					layer.close(index);
				}
			};
			utils.openForm(ops);
		}
	}

	// 点击事件
	gather.init();
});
layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;

			_t.loadCateList();

			$('body').on('click', '.showDetail', function() {
				_t.editBox();
			});

			$('body').on('click', '.buyNow', function () {
				window.location = 'order.html?id=1&type=6';
			});
		},

		loadCateList: function () {
			var _t = this;
			utils.get(URL.select.getCate, function (res) {
				var list = res.data;
				var html = '<a href="javascript:;" class="on">全部</a>';
				$.each(list, function (i, t) {
					var on = t.on ? ' class="on"' : '';
					html += '<a href="javascript:;" data-id="' + t.id + '"' + on + '>' + t.name + '</a>';
				})
				$('.modelAgreement_cate').html(html);
			});
		},

		editBox: function (data) {
			var formitem = [
				{
					title: "文件名称",
					label: "这是文件名称",
					cols: 12
				}, {
					title: "所属分类",
					label: "劳务纠纷",
					cols: 12
				}, {
					title: "更新时间",
					label: "2019年8月20日",
					cols: 12
				}, {
					title: "销量",
					label: "1000",
					cols: 12
				}, {
					title: "价格",
					label: "100元",
					cols: 12
				}, {
					title: "文件简介",
					type: "html",
					html: "这是这份文件的简介，这是这份文件的简介，这是这份文件的简介，这是这份文件的简介，这是这份文件的简介，这是这份文件的简介，这是这份文件的简介，这是这份文件的简介，这是这份文件的简介，这是这份文件的简介，这是这份文件的简介，这是这份文件的简介，这是这份文件的简介，这是这份文件的简介，这是这份文件的简介。",
					cols: 12
				}, {
					title: "适用范围",
					type: "html",
					html: "这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明。",
					cols: 12
				}
			]
			var ops = {
				title: "模板说明",
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
					window.location = 'order.html?id=1&type=6';
					layer.close(index);
				}
			};
			utils.openForm(ops);
		}
	}

	// 点击事件
	gather.init();
});
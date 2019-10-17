layui.define(function (exports) {


	var tableParams = [
		[
			{title: "序号", type: "numbers"},
			{title: "订单编号", field: "orderNo"},
			{title: "订单时间", field: "createTime"}, 
			{title: "订单类型", field: "rootCategory", width:"100"}, 
			{title: "订单种类", field: "childCategory"}, 
			{title: "订单状态", field: "status", width:"100"}, 
			{title: "订单金额", field: "amount", width:"100"}, 
			{
				title: "操作",
				width: "80",
				actions: [
					{ "id": "view", "name": global.btn.viewBtn },
				]
			}
		]
	];

	var gather = {
		init: function () {
			var _t = this;
			_t.rootCategory = [
				{"id": 1, "name": "咨询订单", "child": [{"id": 1, "name": "在线律师咨询"},{"id": 2, "name": "指定律师咨询"}]},
				{"id": 2, "name": "分块法律服务订单", "child": [{"id": 3, "name": "日常法律服务"},{"id": 4, "name": "分块法律服务"}]},
				{"id": 3, "name": "委托律师订单", "child": [{"id": 5, "name": "收费代理"},{"id": 6, "name": "风险代理"}]},
				{"id": 4, "name": "法律文件订单", "child": []}
			]

			_t.loadPage();
		},

		loadPage: function () {
			var _t = this;
			var data = {};
			var html = utils.getTemp('/page/user/order.html', data);
			$('.userPageCon').html(html);

			utils.getSelect(_t.rootCategory, '.rootCategory', global.text.all);
			
			var ips = {
				filters: [
					{ id: "0", name: "全部" },
					{ id: "1", name: "待接单" },
					{ id: "2", name: "已接单" },
					{ id: "3", name: "完成待确认" },
					{ id: "4", name: "待评价" },
					{ id: "5", name: "已完成" }
				],
				field: "status"
			};
			utils.initPage(ips, '.orderList');

			_t.queryList();

			_t.actions();
		},

		queryList: function () {
			var qlps = {
				box: '.orderList',
				url: URL.order.list,
				cols: tableParams
			}
			utils.queryList(qlps);
		},

		viewBox: function () {
			utils.msg('查看订单详细');
		},

		actions: function () {
			var _t = this;
			form.on('select(rootCategory)', function (e) {
				var item = {};
				$.each(_t.rootCategory, function (i, t) {
					t.id == e.value && (item = t);
				});
				
				if (item.child && item.child.length > 0) {
					utils.getSelect(item.child, '.childCategory', global.text.all);
					$('.orderSearchBox .child').removeClass('hidden');
				} else {
					$('.orderSearchBox .child').addClass('hidden');
				}
				// 更改筛选
				$('.app-table-tab li:eq(0)').click();
				element.render();
			});
			
			$('body').off().on('click', '.actions button', function () {
				var type = $(this).attr('data-type');
				var data = $(this).closest('.layui-table-box').find('tbody tr:eq(' + $(this).closest('tr').index() + ')')[0].data || {};
				switch (type) {
					case "view":
						_t.viewBox(data);
						break;
				}
			});
		},
	}

	// 点击事件
	gather.init();
});
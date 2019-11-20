layui.define(function (exports) {

	var normalTableParams = [
		[
			{title: "序号", type: "numbers"},
			{title: "订单编号", field: "orderNo"},
			{title: "订单时间", field: "createTime", width:"150"}, 
			{ title: "客户", field: "name", width: "100" },
			{title: "订单来源", field: "orderSource", width:"100", rs: global.rs.orderSource}, 
			{title: "订单类型", field: "orderType", width:"130", rs: global.rs.orderType}, 
			{title: "订单种类", field: "orderCategory", width:"110", rs: global.rs.orderCategory}, 
			{title: "状态", field: "orderStatus", width:"100", rs: global.rs.orderStatus}, 
			{title: "金额", field: "amount", width:"80"}, 
			{
				title: "操作",
				width: "80",
				actions: [
					{ "id": "view", "name": global.btn.viewBtn },
				]
			}
		]
	];

	var filesTableParams = [
		[
			{ title: "序号", type: "numbers" },
			{ title: "订单编号", field: "orderNo" },
			{ title: "订单类型", field: "orderType", width: "150", rs: global.rs.orderType },
			{ title: "订单状态", field: "orderStatus", width: "100", rs: global.rs.orderStatus },
			{ title: "订单金额", field: "amount", width: "100" },
			{ title: "文件类型", field: "fileType", width: "100" },
			{
				title: "操作",
				width: "110",
				actions: [
					{ "id": "view", "name": global.btn.viewBtn },
					{ "id": "download", "name": global.btn.downloadBtn, type: "warm" },
					// { "id": "download", "name": global.btn.downloadBtn, type: "warm", "filter": "orderStatus", "filterVal": "60"},
				]
			}
		]
	];

	var gather = {
		init: function () {
			var _t = this;
			_t.tableParams = $.extend(true, [], normalTableParams);

			_t.rootCategory = [
				{ "id": 1, "name": "咨询订单", "child": [{ "id": 11, "name": "在线律师咨询" }, { "id": 12, "name": "指定律师咨询" }] },
				{ "id": 2, "name": "分块法律服务订单", "child": [{ "id": 21, "name": "日常法律服务" }, { "id": 22, "name": "分块法律服务" }] },
				{ "id": 3, "name": "代理律师服务订单", "child": [{ "id": 31, "name": "收费代理" }, { "id": 32, "name": "风险代理" }] }
			]
			_t.source = global.rs.orderSource;

			_t.loadPage();
		},

		loadPage: function () {
			var _t = this;
			var data = {};
			var html = utils.getTemp('/page/lawyer/user/order.html', data);
			$('.userPageCon').html(html);

			utils.getSelect(_t.rootCategory, '.rootCategory', global.text.all);
			utils.getSelect(_t.source, '.source', global.text.all);

			var orderStatus = $.extend(true, [], global.rs.lawyerOrderStatus);

			orderStatus.unshift({ id: '', name: '全部' });
			
			var ips = {
				filters: orderStatus,
				field: "orderStatus"
			};
			utils.initPage(ips, '.orderList');

			_t.queryList();

			_t.actions();
		},

		queryList: function (page) {
			var _t = this;
			var searchData = utils.formData('.orderSearchBox');
			searchData.onlyLawyerOwner = 'Y';
			var qlps = {
				box: '.orderList',
				url: URL.lawyerObj.order.query,
				searchData: searchData,
				page: page,
				cols: _t.tableParams
			}
			utils.queryList(qlps, function (curr, tr, item) {
				_t.currPage = curr
			});
		},

		viewBox: function (item) {
			var _t = this;
			window.open('/lawyer/orderDetails.html?id=' + item.id)


		},

		actions: function () {
			var _t = this;

			form.on('select(rootCategory)', function (e) {
				var item = {};
				$.each(_t.rootCategory, function (i, t) {
					t.id == e.value && (item = t);
				});

				if (e.value == 4) {
					_t.tableParams = $.extend(true, [], filesTableParams);
				} else {
					_t.tableParams = $.extend(true, [], normalTableParams);
				}

				if (item.child && item.child.length > 0) {
					utils.getSelect(item.child, '.childCategory', global.text.all);
					$('.orderSearchBox .child').removeClass('hidden');
				} else {
					$('.orderSearchBox .child').addClass('hidden');
				}
				// 更改筛选
				// $('.app-table-tab li:eq(0)').click();
				$('.app-table-tab').find('li').removeClass('layui-this')
				$('.app-table-tab li:eq(0)').addClass('layui-this')
				element.render();
				_t.queryList();
			});
			
			form.on('select(childCategory)', function (e) {
				_t.queryList();
			})
			form.on('select(source)', function (e) {
				_t.queryList();
			})

			$('body').off().on('click', '.actions button', function () {
				var type = $(this).attr('data-type');
				var data = $(this).closest('.layui-table-box').find('tbody tr:eq(' + $(this).closest('tr').index() + ')')[0].data || {};
				switch (type) {
					case "view":
						_t.viewBox(data);
						break;
					case "download":
						_t.downloadFiles(data);
						break;
				}
			});
		},
	}

	// 点击事件
	gather.init();
});
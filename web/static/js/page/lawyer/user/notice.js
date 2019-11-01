layui.define(function (exports) {

	var tableParams = [
		[
			{title: "来自", align: "left", width:"200", templet: function (d) {
				var clz = d.unRead == 1 ? 'fontRed' : 'fontGrey';
				return '<a href="javascript:;" class="' + clz + '">' + d.sender + '</a>';
			}}, 
			{title: "内容", field: "content", align: "left"},
			{title: "通知时间", field: "sentTime", width:"180"}, 
		]
	];

	var tableDetailParams = [
		[
			{title: "来自", align: "left", width:"200", templet: function (d) {
				return '<a href="javascript:;">' + d.sender + '</a>';
			}}, 
			{title: "内容", field: "content", align: "left"},
			{title: "通知时间", field: "sentTime", width:"180"}, 
		]
	];

	var gather = {
		init: function () {
			var _t = this;
			_t.box = '.userPageCon';
			_t.type = 0;
			var html = '<div class="app-list"></div><div class="app-page-box"></div>';
			$(_t.box).html(html);

			_t.loadPage();

			_t.actions();
		},

		loadPage: function () {
			var _t = this;
			
			var ips = {
			};
			utils.initPage(ips, '.userPageCon');

			_t.queryList();
		},

		queryList: function () {
			var _t = this;
			var qlps = {
				"lay-skin": "nob",
				box: '.userPageCon',
				url: URL.lawyerObj.notice.list,
				cols: tableParams
			}
			utils.queryList(qlps, function (curr,tr, item) {
				tr.off().on('click', function () {
					_t.viewNotice(item.senderId)
				})
			});
		},
		
		viewNotice: function (id) {
			var _t = this;
			var html = '<div class="noticeDetails"></div>';
			var ops = {
				type: 1,
				area: '1000px',
				title: "我的消息",
				shadeClose: true,
				scrollbar: false,
				content: html,
				success: function (layero, index) {
					var ips = {
					};
					utils.initPage(ips, '.noticeDetails');
		
					_t.queryDetailList(id);
				}
			};
			utils.dialog(ops);
		},

		queryDetailList: function (id) {
			var _t = this;
			var qlps = {
				"lay-skin": "nob",
				box: '.noticeDetails',
				url: URL.lawyerObj.notice.details + id,
				cols: tableDetailParams
			}
			utils.queryList(qlps, function (curr,tr, item) {
				
			});
		},

		actions: function () {
			var _t = this;

			$('body').on('click', '.noticeList a', function () {
				var item = $(this).closest('tr')[0].data;
				
				$(this).removeClass('fontRed').addClass('fontGrey');

				_t.viewNotice(item);
			});
		},
	}

	// 点击事件
	gather.init();
});
layui.define(function (exports) {


	var tableParams = [
		[
			{title: "标题", align: "left", templet: function (d) {
				var clz = d.status == 1 ? 'fontRed' : 'fontGrey';
				return '<a href="javascript:;" class="' + clz + '">' + d.title + '</a>';
			}}, 
			{title: "通知时间", field: "createTime", width:"180"}, 
		]
	];

	var gather = {
		init: function () {
			var _t = this;

			_t.loadPage();
		},

		loadPage: function () {
			var _t = this;
			var data = {};
			var html = utils.getTemp('/page/user/notice.html', data);
			$('.userPageCon').html(html);
			
			var ips = {
			};
			utils.initPage(ips, '.noticeList');

			_t.queryList();

			_t.actions();
		},

		queryList: function () {
			var qlps = {
				"lay-skin": "nob",
				box: '.noticeList',
				url: URL.notice.list,
				cols: tableParams
			}
			utils.queryList(qlps);
		},
		
		viewNotice: function (obj) {
			var html = '<div class="noticeTit">' + obj.title + '<p>' + obj.createTime + '</p></div><div class="noticeCon">' + obj.content + '</div>';
			var ops = {
				type: 1,
				area: ['1000px', '80%'],
				title: "我的消息",
				shadeClose: true,
				content: html
			};
			utils.dialog(ops);
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
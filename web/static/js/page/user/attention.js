layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.box = '.userPageCon';
			$(_t.box).html('<div class="app-list"></div><div class="app-page-box"></div>');

			_t.queryList();

			$(_t.box).off().on('click', '.conbtn06', function () {
				var id = $(this).closest('li').data('id');
				var params = {
					operateType: 40,
					operateBusiness: 2,
					businessId: id
				};
				utils.get(URL.user.cancelattention, params, function (res) {
					utils.msg('操作成功');
					_t.queryList(_t.currPage);
				});
			});
		},

		queryList: function (page) {
			var _t = this;
			var qlps = {
				url: URL.user.attention,
				searchData: {
					operateBusiness: 2, 
					operateType: 4,
				},
				page: page,
				box: _t.box,
				temp: '/page/user/attention.html'
			}
			utils.queryTempList(qlps, function (curr) {
				_t.currPage = curr;
			});
		},
	}

	// 点击事件
	gather.init();
});
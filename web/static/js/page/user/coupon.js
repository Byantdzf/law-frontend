layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.box = '.userPageCon';
			_t.type = 0;
			var html = '<div class="layui-tab couponTab" lay-filter="couponType">';
			html += '<ul class="layui-tab-title">';
			html += '<li class="layui-this">待使用</li>';
			html += '<li>已使用</li>';
			html += '<li>已过期</li>';
			html += '</ul>';
			html += '</div><div class="app-list"></div><div class="app-page-box"></div>';
			$(_t.box).html(html);

			_t.queryList();

			element.on('tab(couponType)', function (res) {
				_t.type = res.index;
				_t.queryList();
			})
		},

		queryList: function (page) {
			var _t = this;
			// console.log(page)
			var qlps = {
				url: URL.user.coupon,
				page: page,
				searchData: {
					useStatus: _t.type,
				},
				box: _t.box,
				temp: '/page/user/coupon.html'
			}
			utils.queryTempList(qlps, function (curr) {
				_t.currPage = curr;
			});
		},

		// loadPage: function () {
		// 	var _t = this;
		// 	var data = {};
		// 	utils.get(URL.user.coupon, function (res) {
		// 		console.log(res)
		// 	});
		// 	data.list = [
		// 		{"id": 1, "name": "抵扣券", "price": "50", "getDate": "2019-09-09", "validDate": "2919-12-09", "status": "1", "info": "这是优惠券的使用说明，这里最多只能放两行文字，如果超出了的话那么就显示不了了"},
		// 		{"id": 2, "name": "抵扣券", "price": "150", "getDate": "2019-09-09", "validDate": "2919-12-09", "status": "2", "info": "这是优惠券的使用说明，这里最多只能放两行文字，如果超出了的话那么就显示不了了这是优惠券的使用说明，这里最多只能放两行文字，如果超出了的话那么就显示不了了"},
		// 		{"id": 3, "name": "抵扣券", "price": "30", "getDate": "2019-09-09", "validDate": "2919-12-09", "status": "3", "info": "这是优惠券的使用说明，这里最多只能放两行文字，如果超出了的话那么就显示不了了"},
		// 		{"id": 4, "name": "抵扣券", "price": "10", "getDate": "2019-09-09", "validDate": "2919-12-09", "status": "3", "info": "这是优惠券的使用说明，这里最多只能放两行文字，如果超出了的话那么就显示不了了"},
		// 		{"id": 5, "name": "抵扣券", "price": "20", "getDate": "2019-09-09", "validDate": "2919-12-09", "status": "2", "info": "这是优惠券的使用说明，这里最多只能放两行文字，如果超出了的话那么就显示不了了"},
		// 		{"id": 6, "name": "抵扣券", "price": "5", "getDate": "2019-09-09", "validDate": "2919-12-09", "status": "1", "info": "这是优惠券的使用说明，这里最多只能放两行文字，如果超出了的话那么就显示不了了"}
		// 	]
		// 	var html = utils.getTemp('/page/user/coupon.html', data);
		// 	$('.userPageCon').html(html);
		// 	element.on('tab(couponType)', function (e) {
		// 		console.log(e);
		// 	})
		// }
	}

	// 点击事件
	gather.init();
});
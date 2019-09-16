layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;


			_t.loadPage();
		},

		loadPage: function () {
			var _t = this;
			var data = {};
			data.list = [
				{"id": 1, "name": "抵扣券", "price": "50", "getDate": "2019-09-09", "validDate": "2919-12-09", "status": "1", "info": "这是优惠券的使用说明，这里最多只能放两行文字，如果超出了的话那么就显示不了了"},
				{"id": 2, "name": "抵扣券", "price": "150", "getDate": "2019-09-09", "validDate": "2919-12-09", "status": "2", "info": "这是优惠券的使用说明，这里最多只能放两行文字，如果超出了的话那么就显示不了了这是优惠券的使用说明，这里最多只能放两行文字，如果超出了的话那么就显示不了了"},
				{"id": 3, "name": "抵扣券", "price": "30", "getDate": "2019-09-09", "validDate": "2919-12-09", "status": "3", "info": "这是优惠券的使用说明，这里最多只能放两行文字，如果超出了的话那么就显示不了了"},
				{"id": 4, "name": "抵扣券", "price": "10", "getDate": "2019-09-09", "validDate": "2919-12-09", "status": "3", "info": "这是优惠券的使用说明，这里最多只能放两行文字，如果超出了的话那么就显示不了了"},
				{"id": 5, "name": "抵扣券", "price": "20", "getDate": "2019-09-09", "validDate": "2919-12-09", "status": "2", "info": "这是优惠券的使用说明，这里最多只能放两行文字，如果超出了的话那么就显示不了了"},
				{"id": 6, "name": "抵扣券", "price": "5", "getDate": "2019-09-09", "validDate": "2919-12-09", "status": "1", "info": "这是优惠券的使用说明，这里最多只能放两行文字，如果超出了的话那么就显示不了了"}
			]
			var html = utils.getTemp('/page/user/coupon.html', data);
			$('.userPageCon').html(html);
			element.on('tab(couponType)', function (e) {
				console.log(e);
			})
		}
	}

	// 点击事件
	gather.init();
});
layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;

			$('body').on('click', '.switchCity a[data-code]', function () {
				var prov = $(this).closest('dl').find('dt').text()
				var city = $(this).text();
				var list = [prov, city]
				utils.setCookie(global.areaCookie, JSON.stringify(list));
				window.location = '/index.html';
			})
		},
	}

	// 点击事件
	gather.init();
});
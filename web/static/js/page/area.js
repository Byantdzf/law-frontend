layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;

			$('body').on('click', '.switchCity a[data-code]', function () {
				var thisCity = {};
				thisCity.id = $(this).attr('data-code');
				thisCity.name = $(this).text();
				utils.setCookie(global.areaCookie, thisCity, { expires: 30 });
				window.location = '/index.html';
			})
		},
	}

	// 点击事件
	gather.init();
});
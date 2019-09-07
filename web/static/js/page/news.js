layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.type = utils.getQueryString('type').toString();

			_t.getBranch();

			var box = $('.newsRight');
			var rightTop = box.offset().top;

			$(window).scroll(function () {
				var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
				if (scrollTop >= rightTop) {
					box.addClass('fixed')
				} else {
					box.removeClass('fixed')
				}
			})
		},
		getBranch: function () {
			var _t = this;
			var location = '';
			switch (_t.type) {
				case "1":
					location = '<a href="javascript:;">精选文章</a>';
					break;
				case "2":
					location = '<a href="javascript:;">公司新闻</a>';
					break;
			}
			if (location) {
				$('.bread_tips').append(location);
				$('.clm_tt_l').html(location);
			}
		}
	}

	// 点击事件
	gather.init();
});
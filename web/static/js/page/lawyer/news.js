layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.type = utils.getQueryString('type').toString();

			_t.getBranch();

			$('.countTimes').each(function () {
				utils.countTimes($(this));
			});
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
layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.type = "1";

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
					location = '<a href="news.html?type=1">精选文章</a>';
					break;
				case "2":
					location = '<a href="news.html?type=2">公司新闻</a>';
					break;
			}
			location += ' &gt; <a href="javascript:;">惊！劳动合同"解除"写成"终止"被法院判败诉！</a>'
			if (location) {
				$('.bread_tips').append(location);
				$('.clm_tt_l').html(location);
			}
		}
	}

	// 点击事件
	gather.init();
});
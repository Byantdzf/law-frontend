layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.id = utils.getQueryString('id');

			_t.getData();

			base.getLawyerOrderList();
		},

		getData: function () {
			var _t = this;
			utils.get(URL.news.getById + _t.id, function (res) {
				var data = res.data;
				$('.ccbox_sectiton .tt').html(data.title);
				$('.time').html(data.createTime);
				$('.ccbox_sectiton .icon-read').next().html(data.readCount);
				$('.ccbox_sectiton .icon-share').next().html(data.forwardCount);
				$('.ccbox_sectiton .icon-zan').next().html(data.thumbsUpCount);
				$('.newsContent').html(data.content);
			});
		}
	}

	// 点击事件
	gather.init();
});
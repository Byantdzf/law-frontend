layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.id = utils.getQueryString('id');

			_t.getData();

			_t.getLawyerList();
		},

		getData: function () {
			var _t = this;
			utils.get(URL.lawyer.getById + _t.id, function (res) {
				var data = res.data;
      
				var score = data.score > 5 ? 5 : data.score < 0 ? 0 : data.score
				data.persent = Math.floor(score / 5 * 100)

				_t.getLawyerInfo(data);
				_t.getLawyerData(data);
			});
		},

		getLawyerInfo: function (data) {
			var html = utils.getTemp('/page/lawyer/temp/lawyerInfo.html', data)
			$('.lawyerInfo').html(html);
		},

		getLawyerData: function (data) {
			// var html = utils.getTemp('/page/lawyer/temp/lawyerData.html', data)
			// $('.commentsCon').html(html);
		},

		getLawyerList: function () {
			var areas = utils.cookie(global.areaCookie);
			if (areas) {
				areas = JSON.parse(areas) || {};
			} else {
				areas = global.defaultArea;
			}
			var params = {}
			params[global.rows] = 5;
			params[global.page] = 1;
			params.city = areas.name;
			params.noAuth = 1;
			utils.get(URL.lawyer.query, params, function (res) {
				var data = res.data.list || []
				var html = utils.getTemp('/page/common/reclawyerList.html', data)
				$('.newsRight ul').html(html);
			})
		}

	}

	// 点击事件
	gather.init();
});
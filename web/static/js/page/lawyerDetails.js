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
			var _t = this;
			var html = utils.getTemp('/page/lawyer/temp/lawyerInfo.html', data)
			$('.lawyerInfo').html(html);

			// 关注
			$('.collect').off().on('click', function () {
				var params = {
				  businessId: _t.id,
				  operateBusiness: 2,  // 操作对象1-订单 2-律师 3-文章 4-系统
				  operateType: 4,      // 1-阅读 2-转发 3-点赞 4-关注 10-取消阅读 20-取消转发 30-取消点赞 40-取消关注
				}
				utils.get(URL.user.cancelattention, params, function () {
					utils.msg('操作成功');
					_t.getData();
				})
			})
			// 取消关注
			$('.cancelCollect').off().on('click', function () {
				var params = {
				  businessId: _t.id,
				  operateBusiness: 2,  // 操作对象1-订单 2-律师 3-文章 4-系统
				  operateType: 40,      // 1-阅读 2-转发 3-点赞 4-关注 10-取消阅读 20-取消转发 30-取消点赞 40-取消关注
				}
				utils.get(URL.user.cancelattention, params, function () {
					utils.msg('操作成功');
					_t.getData();
				})
			})
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
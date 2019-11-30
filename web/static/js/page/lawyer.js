layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.defaultStr = '<a href="javascript:;" class="curr">全部</a>';

			_t.loadArea();
			_t.getQuestionType();
			_t.queryList();
			_t.getLawyerList();

			// var box = $('.newsRight');
			// var rightTop = box.offset().top;
			// $(window).scroll(function () {
			// 	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			// 	if (scrollTop >= rightTop) {
			// 		box.addClass('fixed')
			// 	} else {
			// 		box.removeClass('fixed')
			// 	}
			// });

			$('body').on('click', '.searchBox a', function () {
				$(this).addClass('curr').siblings().removeClass('curr');
				if ($(this).closest('.prov')) {
					var code = $(this).data('id');
					$.each(_t.list, function (i, t) {
						if (t.code == code) {
							var html = _t.defaultStr;
							$.each(t.city, function (i, t) {
								html += '<a href="javascript:;" data-id="' + t.code + '">' + t.name + '</a>';
							});
							$('.cityList').html(html);
						}
					});
				}
				_t.queryList();
			});

			// 关注
			$('body').on('click', '.collect', function () {
				if (utils.cookie(global.token)) {
					var id = $(this).closest('li').data('id');
					var params = {
					businessId: id,
					operateBusiness: 2,  // 操作对象1-订单 2-律师 3-文章 4-系统
					operateType: 4,      // 1-阅读 2-转发 3-点赞 4-关注 10-取消阅读 20-取消转发 30-取消点赞 40-取消关注
					}
					utils.get(URL.user.cancelattention, params, function () {
						utils.msg('操作成功');
						_t.getLawyer()
					})
				} else {
					utils.confirm('登录以后才可以操作，是否登录？', function () {
						base.wxLogin(function (data) {
							window.location.reload();
						})
					})
				}
			})
			// 取消关注
			$('body').on('click', '.cancelCollect', function () {
				var id = $(this).closest('li').data('id');
				var params = {
				businessId: id,
				operateBusiness: 2,  // 操作对象1-订单 2-律师 3-文章 4-系统
				operateType: 40,      // 1-阅读 2-转发 3-点赞 4-关注 10-取消阅读 20-取消转发 30-取消点赞 40-取消关注
				}
				utils.get(URL.user.cancelattention, params, function () {
					utils.msg('操作成功');
					_t.getLawyer()
				})
			})
		},

		loadArea: function () {
			var _t = this;
			utils.get(URL.select.getProvCity, function (res) {
				_t.list = res.data;
				
				var html = _t.defaultStr;
				$.each(_t.list, function (i, t) {
					html += '<a href="javascript:;" data-id="' + t.code + '">' + t.name + '</a>';
				});
				$('.provList').html(html);
				$('.cityList').html(_t.defaultStr);
			});
		}, 

		getQuestionType: function () {
			var _t = this;
			var data = base.getQuestionType()
			var html = _t.defaultStr;
			$.each(data, function (i, t) {
				html += '<a href="javascript:;" data-id="' + t.code + '">' + t.name + '</a>';
			})
			$('.specialityList').html(html);
		},

		queryList: function () {
			var searchData = {};
			var province = $('.provList .curr').data('id') ? $('.provList .curr').html() : '';
			var city = $('.cityList .curr').data('id') ? $('.cityList .curr').html() : '';
			var goodAt = $('.specialityList .curr').data('id') ? $('.specialityList .curr').html() : '';
			province && (searchData.province = province);
			city && (searchData.city = city);
			goodAt && (searchData.goodAt = goodAt);
			var qlps = {
				url: URL.lawyer.query,
				searchData: searchData,
				box: '.lawyerList',
				temp: '/page/home/lawyerList.html'
			}
			utils.queryTempList(qlps);
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
			params.keyWord = utils.getQueryString('keyword');
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
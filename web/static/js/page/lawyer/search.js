﻿layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.defaultStr = '<a href="javascript:;" class="curr">全部</a>';

			_t.getQuestionType();

			_t.loadArea();
			_t.loadSpeciality();

			_t.queryList();

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
				if (!$(this).closest('li').hasClass('filterBox')) {
					$(this).addClass('curr').siblings().removeClass('curr');
				}
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

			$('body').on('click', '.filterBox a i', function (e) {
				$('.filterBox i').removeClass('curr');
				$(this).addClass('curr');
				_t.queryList();
				e.stopPropagation();
			});

			$('body').on('click', '.cateList li', function (e) {
				$(this).addClass('curr').siblings().removeClass('curr');
				_t.queryList();
			});
			
			// $('.countTimes').each(function () {
			// 	utils.countTimes($(this));
			// });
		},

		getQuestionType: function () {
			var _t = this;
			var box = $('.clm_3_1')
			var data = base.getQuestionType()
			_t.questionType = data;
			box.each(function () {
				var _this = $(this);
				$.each(data, function (i, t) {
					t.url = 'javascript:;';
				})
				var html = utils.getTemp('/page/home/questionType.html', data)
				$(this).find('ul').html(html);
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

		loadSpeciality: function () {
			var _t = this;
			var list = _t.questionType;
			var html = _t.defaultStr;
			$.each(list, function (i, t) {
				html += '<a href="javascript:;" data-id="' + t.code + '">' + t.name + '</a>';
			})
			$('.specialityList').html(html);
		},

		queryList: function () {
			var qlps = {
				url: URL.lawyerObj.order.query,
				box: '.systemPush_box',
				temp: '/lawyer/temp/common/systemPush.html'
			}
			var searchData = {
				// orderSource: 1,
			};
			if ($('.provList .curr').data('id')) {
				searchData.province = $.trim($('.provList .curr').html());
			}
			if ($('.cityList .curr').data('id')) {
				searchData.city = $.trim($('.cityList .curr').html());
			}
			if ($('.specialityList .curr').data('id')) {
				searchData.questionType = $('.specialityList .curr').data('id');
			}
			if ($('.filterList .curr').data('id')) {
				searchData.orderBy = $('.filterList .curr').data('id');
			}
			if ($('.cateList .curr a').data('id')) {
				searchData.orderCategory = $('.cateList .curr a').data('id');
			}
			var keyworkds = $.trim(utils.getQueryString('keyword'));
			if (keyworkds) {
				searchData.keyWord = keyworkds;
			}
			qlps.searchData = searchData;
			utils.queryTempList(qlps);
		}
		
	}

	// 点击事件
	gather.init();
});
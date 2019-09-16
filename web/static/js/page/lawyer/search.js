layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.defaultStr = '<a href="javascript:;" class="curr">全部</a>';

			_t.loadArea();
			_t.loadSpeciality();

			var box = $('.newsRight');
			var rightTop = box.offset().top;
			$(window).scroll(function () {
				var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
				if (scrollTop >= rightTop) {
					box.addClass('fixed')
				} else {
					box.removeClass('fixed')
				}
			});

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
			});
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
			utils.get(URL.select.getCate, function (res) {
				var list = res.data;
				var html = _t.defaultStr;
				$.each(list, function (i, t) {
					html += '<a href="javascript:;" data-id="' + t.id + '">' + t.name + '</a>';
				})
				$('.specialityList').html(html);
			});
		}
		
	}

	// 点击事件
	gather.init();
});
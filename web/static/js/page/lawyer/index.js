layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;

			carousel.render({
				elem: '#indexBanner'
				, width: '1200px'
				, height: '376px'
			});

			var swiper = new Swiper('.index_newsList .swiper-container', {
				slidesPerView: 4.5,
				spaceBetween: 30,
				freeMode: true
			});

			var swiper = new Swiper('.index_company_news .swiper-container', {
				slidesPerView: 3,
				spaceBetween: 30,
				slidesPerGroup: 3,
				loop: true,
				loopFillGroupWithBlank: true,
				pagination: {
				  el: '.swiper-pagination',
				  clickable: true,
				},
			});

			$('.countTimes').each(function () {
				_t.countTimes($(this));
			});
		},

		countTimes: function (obj) {
			var timer = window.setInterval(function () {
				var times = obj.html();
				var timeArr = times.split(':');
				var s = parseInt(timeArr[0]) * 60 * 60 + parseInt(timeArr[1]) * 60 + parseInt(timeArr[2]);
				s--;
				if (s == 0) {
					window.clearInterval(timer);
					obj.closest('li').remove();
				} else {
					var h = Math.floor(s / (60*60));//整数部分代表小时；
					s %= 3600; //余数代表 剩下的秒数；
					var m = Math.floor(s / 60);
					s %= 60;
					obj.html(lay.digit(h) + ':' + lay.digit(m) + ':' + lay.digit(s))
					if (h < 1 && !obj.hasClass('notice')) {
						obj.addClass('notice');
					}
				}
			}, 1000);
		}

	}

	// 点击事件
	gather.init();
});
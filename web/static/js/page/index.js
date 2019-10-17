layui.define(function (exports) {

	var gather = {
		init: function () {

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

			// base.openRedPacket();
		}
	}

	// 点击事件
	gather.init();
});
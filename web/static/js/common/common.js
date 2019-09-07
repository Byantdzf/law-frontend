layui.define(function (exports) {

	var gahter = {
		init: function () {
			// 获取用户登录信息
			utils.localusers();

			// 获取语言包
			utils.lang();

			gahter.actions();
		},

		getMyRoles: function () {
			if (!global.menus.length) {
				utils.getSync(URL.select.menu, function (res) {
					global.menus = res.data || [];
				});
			}
			return global.menus;
		},

		getMenu: function (router) {
			var data = base.getMyRoles();
			var isOpenItem = 0;
			if (router) {
				layui.each(data, function (index, item) {
					item.isOpen = 0;
					var hashUrl = router ? decodeURIComponent(router) : '';
					if (hashUrl == item.menuUrl) {
						item.isOpen = 1;
						isOpenItem = 1;
					}
				});
			}
			var data = utils.getTree(data);
			var obj = {};
			obj.list = data;
			obj.isOpenItem = isOpenItem;
			var html = utils.getTemp('/page/common/menu.html', obj);
			$('#APP-system-side-menu').html(html);
			element.init();

			// 点击切换导航
			element.on('nav(APP-system-side-menu)', function (elem) {
				var url = elem.attr('data-url');
				url && utils.router(encodeURIComponent(url));
			});
		},

		getHeader: function () {
			var obj = {};
			obj.userInfo = global.userInfo || {};
			var html = utils.getTemp('/page/common/header.html', obj);
			$('#APP-system-header').html(html);
			element.init();

			$('#APP_flexible').off().on('click', function () {
				var app = $('#APP');
				var btn = $(this);
				var x = utils.screen();
				if (x >= 2) {
					app.toggleClass('layadmin-side-shrink');
				} else {
					app.toggleClass('layadmin-side-spread-sm');
				}
				btn.toggleClass('layui-icon-spread-left').toggleClass('layui-icon-shrink-right');
			});

			// 移动版隐藏目录
			$('#APP-system-shade').off().on('click', function () {
				var app = $('#APP');
				app.removeClass('layadmin-side-spread-sm');
			});

			// 退出登录
			$('.logout').off().on('click', function () {
				utils.setCookie(global.userInfoToken, '');
				utils.setCookie(global.token, '');
				utils.setCookie(global.backToken, '');
				setTimeout(function () {
					window.location = '/index.html';
				}, 10);
				base.post(URL.account.logout);
			});
		},

		actions: function () {
			var _t = this;
			$('body').on('click', '.searchBtn', function () {
				_t.topSearch();
			});

			$('body').on('click', '.eqlogin', function () {
				_t.login();
			});

			$('body').on('click', '.eqcodew', function () {
				_t.eqcodew();
			});

			_t.hotCity();
		},

		topSearch: function () {
			var search = $.trim($("#search").val());
			!search ? utils.msg('请输入搜索关键词') : window.location.href="/Search/Home/index.html?keyword="+search;
		},
		login: function () {
			var html = '<div class="eqcodebox"><p>请用微信扫描下方二维码进行操作<b class="layui-layer-close">X</b></p><img src="https://static.faniuwenda.com/pc/images/eqcode_240.png" width="244"></div>';
			
			var ops = {
				type: 1,
				area: ['370px', '362px'],
				title: false,
				shadeClose: true,
				closeBtn: 0,
				content: html
			};
			utils.dialog(ops);
		},
		eqcodew: function () {
			var html = '<div class="eqcodebox"><p style="font-size:12px;">关注虎甲问答，立即获取100元法律咨询优惠券<b class="layui-layer-close">X</b></p><img src="https://static.faniuwenda.com/pc/images/eqcode_240.png" width="244"><h4>扫码立即微信咨询</h4></div>';
			
			var ops = {
				type: 1,
                area: ['370px', '362px'],
				title: false,
				shadeClose: true,
				closeBtn: 0,
				content: html
			};
			utils.dialog(ops);
		},
		hotCity: function () {
			$(".region_con").eq(0).show();
			$(".region_list span").hover(function () {
				$(this).show().addClass('region_on').siblings().removeClass('region_on')
				$('.region_conList .region_con:eq(' + $(this).index() + ')').show().siblings().hide()
			})
			$('.region_box a[data-code]').click(function(){
				window.location = 'area.html?switchCity='+$(this).data('code')+'&forward='+encodeURIComponent(window.location.href);
			});
		}
	}

	gahter.init();

	exports('base', gahter);
});
var base = layui.base;
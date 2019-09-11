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
			var _t = this;
			var obj = {};
			obj = global.userInfo || {};
			var html = utils.getTemp('/page/common/header.html', obj);
			$('.appTop').html(html);
			element.init();

			// 退出登录
			$('.logout').off().on('click', function () {
				_t.logout();
			});
		},

		logout: function () {
			utils.setCookie(global.userInfoToken, '');
			utils.setCookie(global.token, '');
			utils.setCookie(global.backToken, '');
			setTimeout(function () {
				window.location = '/index.html';
			}, 10);
			base.post(URL.account.logout);
		},

		actions: function () {
			var _t = this;

			_t.getHeader();

			$('body').on('click', '.searchBtn', function () {
				_t.topSearch();
			});

			$('body').on('click', '.eqlogin', function () {
				$(this).closest('dd').removeClass('layui-this');
				_t.login();
			});

			$('body').on('click', '.eqcodew', function () {
				_t.eqcodew();
			});

			$('body').on('click', '.eqReg', function () {
				window.location = '/reg.html';
			});

			$('body').on('click', '.eqService', function () {
				_t.eqService();
			});

			// 选择城市
			$('body').on('click', '.region_box a[data-code]', function () {
				var thisCity = {};
				thisCity.id = $(this).data('code');
				thisCity.name = $(this).text();
				utils.setCookie(global.areaCookie, thisCity, {expires: 30});
				window.location = '/index.html';
			});

			// 读取当前默认城市
			var areas = utils.cookie(global.areaCookie);
			if (areas) {
				areas = JSON.parse(areas) || {};
			} else {
				areas = global.defaultArea;
			}
			$('.showAreaName').html(areas.name)

			$(function () {
				$('body').find('textarea').each(function () {
					var max = $(this).attr('maxlength');
					$(this).next().find('em').html(max);
				});

				$('body').on('keyup', 'textarea', function () {
					var min = $(this).attr('minlength');
					var max = $(this).attr('maxlength');
					var value = $(this).val();
					value = value.replace(/\n|\r/gi, "");
					var len = value.length;
					var box = $(this).next();
					box.find('span').html(len);
					if (len < min || len > max) {
						box.addClass('fontRed');
					} else {
						box.removeClass('fontRed');
					}
				})
			})

			_t.hotCity();
		},

		topSearch: function () {
			var search = $.trim($("#search").val());
			!search ? utils.msg('请输入搜索关键词') : window.location.href = "/search.html?keyword=" + search;
		},
		login: function (eb) {
			var html = '<div class="eqcodebox"><p>请用微信扫码登录，测试版，实际上会跳到微信的二维码页面<b class="layui-layer-close">X</b></p><img src="https:///static/images/eqcode_240.png" width="244"></div><p style="text-align:center; margin-top:10px;" class="showTestCount">登录倒计时：3</p>';

			var ops = {
				type: 1,
				area: ['450px', '362px'],
				title: false,
				shadeClose: true,
				closeBtn: 0,
				content: html,
				success: function (layero, index) {
					// 测试登录效果代码
					var t = 3;
					var timer = null;
					var href = window.location.href;
					utils.setCookie(global.userInfoToken, global.testUserInfo);
					timer = window.setInterval(function () {
						t--;
						$('.showTestCount').html('登录倒计时：' + t);
						if ( t == 0) {
							window.clearInterval(timer);
							if (eb) {
								eb();
							} else {
								if (href.indexOf('user.html') == -1) {
									window.location = '/user.html';
								}
							}
							layer.close(index);
						}
					}, 1000);
				}
			};
			utils.dialog(ops);
		},
		eqcodew: function () {
			var html = '<div class="eqcodebox"><p style="font-size:12px;">关注虎甲问答，立即获取100元法律咨询优惠券<b class="layui-layer-close">X</b></p><img src="https:///static/images/eqcode_240.png" width="244"><h4>扫码立即微信咨询</h4></div>';

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
		eqService: function () {
			var html = '<div class="eqcodebox"><p style="font-size:18px;">客服电话：' + global.tel + '<b class="layui-layer-close" style=" font-size:12px;">X</b></p><img src="https:///static/images/eqcode_240.png" width="244"><h4>扫码添加客服微信咨询</h4></div>';

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
			var _t = this;
			$(".region_con").eq(0).show();
			_t.regionConList(0);

			$(".region_list span").hover(function () {
				$(this).show().addClass('region_on').siblings().removeClass('region_on')
				$('.region_conList .region_con').html('')
				_t.regionConList($(this).index())
				// $('.region_conList .region_con:eq(' + $(this).index() + ')').show().siblings().hide()
			})
		},
		regionConList: function (index) {
			var _t = this;

			if (!_t.areaList) {
				utils.getSync(URL.select.getArea, function (res) {
					_t.areaList = res.data;
				});
			}
			var list = _t.areaList[index];
			var html = '';
			$.each(list, function (i, t) {
				html += '<li><a href="javascript:;" data-code="' + t.id + '">' + t.name + '</a></li>';
			});
			html += '<li><a href="/area.html">更多&gt;&gt;</a></li>';
			$('.region_conList .region_con').html(html)
		}
	}

	gahter.init();

	exports('base', gahter);
});
var base = layui.base;
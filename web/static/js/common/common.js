layui.define(function (exports) {

	var gather = {
		init: function () {
			// 获取用户登录信息
			utils.localusers();

			// 获取语言包
			utils.lang();

			gather.actions();
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
			obj = global.userInfo || {};
			
			var keyworkds = $.trim(utils.getQueryString('keyword'));
			if (keyworkds) {
				obj.keyWord = keyworkds;
			}
			if (window.location.href.indexOf('/lawyer/') > -1) {
				obj.isLawyer = 1;
			}
			var html = utils.getTemp('/page/common/header.html', obj);
			$('.appTop').html(html);
			element.init();

			// 退出登录
			$('.logout').off().on('click', function () {
				gather.logout();
			});
		},

		getFoot: function () {
			var obj = {};
			var temp = '/page/common/foot.html';
			if (window.location.href.indexOf('/lawyer/') > -1) {
				temp = '/page/common/lawyerFoot.html'
			}
			var html = utils.getTemp(temp);
			$('.btm').html(html);
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

		getQuestionType: function () {
			var data = []
			utils.getSync(URL.common.questionType, {noAuth: 1}, function (res) {
				data = res.data
			});
			return data;
		},

		wxLogin: function (cb) {
			var params = {
				accessCode: 'http://' + window.location.host + window.location.pathname
			};
			utils.get(URL.user.wxLogin, params, function (res) {
				var test = window.open(res.data.url)
				var timer = null;
				timer = window.setInterval(function () {
					utils.get(URL.user.wxLoginStatus, {state: res.data.state}, function (res) {
						if (res.code == '000000') {
							utils.setCookie(global.token, res.data);
							window.clearInterval(timer);
							test.close()
							cb && cb(res.data)
						}
					});
				}, 1000)
			});
		},

		actions: function () {
			gather.getHeader();
			gather.getFoot();

			$('body').on('click', '.searchBtn', function () {
				gather.topSearch();
			});

			// 用户微信登录
			$('body').on('click', '.eqlogin', function () {
				base.wxLogin(function (data) {
					window.location = '/user.html';
				})
			});

			$('body').on('click', '.eqcodew', function () {
				gather.eqcodew();
			});

			$('body').on('click', '.eqReg', function () {
				window.location = '/reg.html';
			});

			$('body').on('click', '.eqService', function () {
				gather.eqService();
			});

			// 选择城市
			$('body').on('click', '.region_box a[data-code]', function () {
				var thisCity = {};
				thisCity.id = $(this).data('code');
				thisCity.name = $(this).text();
				utils.setCookie(global.areaCookie, thisCity, { expires: 30 });
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
					gather.setTextarea($(this));
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

				$('body').on('click', '.reTop', function () {
					$('html, body').animate({ scrollTop: 0 }, 300);
				})
			})

			// if (window.location.href.indexOf('/lawyer/') == -1) {
			// 	gather.setFixBar();
			// }

			// 律师订单操作
			// 关注
			$('body').on('click', '.focusd', function () {
				var a = $(this);
				var id = a.closest('li').data('id')
				var params = {
				  businessId: id,
				  operateBusiness: 1,  // 操作对象1-订单 2-律师 3-文章 4-系统
				  operateType: 4      // 1-阅读 2-转发 3-点赞 4-关注 10-取消阅读 20-取消转发 30-取消点赞 40-取消关注
				}
				utils.get(URL.lawyerObj.order.operate, params, function () {
					utils.msg('操作成功');
					a.removeClass('focusd').addClass('cancelFocus').html('取消关注')
				})
			});
			
			// 取消关注
			$('body').on('click', '.cancelFocus', function () {
				var a = $(this);
				var id = a.closest('li').data('id')
				var params = {
				  businessId: id,
				  operateBusiness: 1,  // 操作对象1-订单 2-律师 3-文章 4-系统
				  operateType: 40      // 1-阅读 2-转发 3-点赞 4-关注 10-取消阅读 20-取消转发 30-取消点赞 40-取消关注
				}
				utils.get(URL.lawyerObj.order.operate, params, function () {
					utils.msg('操作成功');
					a.removeClass('cancelFocus').addClass('focusd').html('关注订单')
				})
			});

			//接受订单
			$('body').on('click', '.handleReceive', function () {
				var a = $(this);
				var id = a.closest('li').data('id')
				var params = {
					orderId: id
				}
				utils.get(URL.lawyerObj.order.accept, params, function () {
					utils.msg('操作成功');
					a.removeClass('handleReceive').removeClass('layui-btn-red').addClass('layui-btn-disabled').html('立即接单')
				})
			});

			// 拒绝接单 
			$('body').on('click', '.handleRefuse', function () {
				var a = $(this);
				var id = a.closest('li').data('id')
				var params = {
					orderId: id
				}
				utils.get(URL.lawyerObj.order.refuse, params, function () {
					utils.msg('操作成功');
					a.removeClass('handleRefuse').removeClass('layui-btn-primary').addClass('layui-btn-disabled').html('已拒绝')
				})
			});
		},

		setTextarea: function (obj) {
			var max = obj.attr('maxlength');
			obj.next().find('em').html(max);
		},

		setFixBar: function () {
			//固定块
			util.fixbar({
				bar1: " "
				, bar2: " "
				, css: { right: 50, bottom: 100 }
				, bgcolor: '#9F9F9F'
			});
			var box = $('.layui-fixbar');
			var topBtn = box.find('.layui-fixbar-top');
			topBtn.before('<li class="layui-icon" lay-type="bar3" style="background-color:#9F9F9F"> </li><li class="layui-icon" lay-type="bar4" style="background-color:#9F9F9F"> </li>');	// 添加第三，四个图标
			var list = [
				{"title": "", "name": "icon-radio" },
				{"title": "用户登录", "name": "icon-user1" },
				{"title": "联系客服", "name": "icon-kefu" },
				{"title": "关于我们", "name": "icon-guanyuwomen"}
			]
			box.find('li').each(function () {
				var li = $(this);
				if (li.attr('lay-type').indexOf('bar') > -1) {
					var t = list[li.index()];
					li.html('<i class="iconfont ' + t.name + '" title="' + t.title + '"></i>');
					if (li.find('i').hasClass('icon-radio')) {
						var html = utils.getTemp('/page/common/fixAsk.html');
						li.append(html);
					}
				}
			});

			box.on('click', 'li', function () {
				var i = $(this).find('i');
				if (i.hasClass('icon-user1')) {
					gather.login();
				} else if (i.hasClass('icon-kefu')) {
					gather.eqService();
				} else if (i.hasClass('icon-guanyuwomen')) {
					window.location = '/about.html';
				}
			})
		},

		topSearch: function () {
			var search = $.trim($("#search").val());
			if (!search) {
				utils.msg('请输入搜索关键词');
			} else {
				var url = "/lawyer.html?keyword=" + search;
				if (window.location.href.indexOf('/lawyer/') > -1) {
					url = '/lawyer/search.html?keyword=' + search
				}
				window.location = url;
			}
		},
		login: function (eb) {
			var html = '<div class="eqcodebox"><p>请用微信扫码登录，测试版，实际上会跳到微信的二维码页面<b class="layui-layer-close">X</b></p><img src="/static/images/eqcode_240.png" width="244"></div><p style="text-align:center; margin-top:10px;" class="showTestCount">登录倒计时：3</p>';

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
						if (t == 0) {
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
			var html = '<div class="eqcodebox"><p style="font-size:12px;">关注虎甲问答，立即获取100元法律咨询优惠券<b class="layui-layer-close">X</b></p><img src="/static/images/eqcode_240.png" width="244"><h4>扫码立即微信咨询</h4></div>';

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
			var html = '<div class="eqcodebox"><p style="font-size:18px;">客服电话：' + global.tel + '<b class="layui-layer-close" style=" font-size:12px;">X</b></p><img src="/static/images/eqcode_240.png" width="244"><h4>扫码添加客服微信咨询</h4></div>';

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
			gather.regionConList(0);

			$(".region_list span").hover(function () {
				$(this).show().addClass('region_on').siblings().removeClass('region_on')
				$('.region_conList .region_con').html('')
				gather.regionConList($(this).index())
				// $('.region_conList .region_con:eq(' + $(this).index() + ')').show().siblings().hide()
			})
		},
		regionConList: function (index) {
			if (!gather.areaList) {
				utils.getSync(URL.select.getArea, function (res) {
					gather.areaList = res.data;
				});
			}
			var list = gather.areaList[index];
			var html = '';
			$.each(list, function (i, t) {
				html += '<li><a href="javascript:;" data-code="' + t.id + '">' + t.name + '</a></li>';
			});
			html += '<li><a href="/area.html">更多&gt;&gt;</a></li>';
			$('.region_conList .region_con').html(html)
		},
		openRedPacket: function () {
			var html = '<div class="redPackageBox"><p>平台赠送了您一张新人优惠券<br />快去扫码登录领取吧</p></div>';

			var ops = {
				type: 1,
				title: false,
				shadeClose: true,
				area: ["300px", "420px"],
				skin: 'showRedPacket',
				content: html,
				success: function (layero, index) {
					$('.redPackageBox').off().on('click', function () {
						// layer.close(index);
						// base.login();
						window.location = 'user.html';
					});
				}
			};
			utils.dialog(ops);
		},
		timeCount: function (box, time) {
			$(box).attr('disabled', true);
			$(box).html('重新获取(' +　time + ')');
			var timer = window.setInterval(function () {
				time--;
				$(box).html('重新获取(' +　time + ')');
				if (time == 0) {
					window.clearInterval(timer);
					$(box).attr('disabled', false).html('获取验证码');
				}
			}, 1000);
		},
		checkMobile: function (mobile) {
			var flag = false;
			if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(mobile)){
				flag = true
			}
			return flag
		},
		loadArea: function (_t) {
			utils.get(URL.select.getProvCity, function (res) {
				var data = res.data;
				_t.area = data;
				$.each(data, function (i, t) {
					t.id = t.code
				});
				utils.getSelect(data, '.provice', '请选择省');
				
				form.on('select(changeProvice)', function (res) {
					var code = res.value
					
					var cityData = []
					$.each(data, function (i, t) {
						if (t.code == code) {
							cityData = t.city
							$.each(cityData, function (i2, t2) {
								t2.id = t2.code;
							});
						}
					});
					utils.getSelect(cityData, '.city', '请选择市');
				})

				if (_t.hasZone == 1) {
					form.on('select(changeCity)', function (res) {
						var code = res.value
						var prov = $('.provice').val();
						var cityData = []
						var zoneData = []
						$.each(data, function (i, t) {
							if (t.code == prov) {
								cityData = t.city
								$.each(cityData, function (i2, t2) {
									if (t2.code == code) {
										zoneData = t2.area || []
										$.each(zoneData, function (i3, t3) {
											t3.id = t3.code;
										});
									}
								});
							}
						});
						utils.getSelect(zoneData, '.zone', '请选择区');
					})
				}

			});
		},

		playAudio: function (url) {
			if(!audioCanPlay){
				return;
			}
			
			var borswer = window.navigator.userAgent.toLowerCase();
			var op = null;
			if (borswer.indexOf("trident") >= 0) {
				op = '<embed id="audio" src="' + url + '" autostart="true" hidden="true" loop="false"></embed>';
			} else {
				var op = document.createElement("audio");
				op.autoplay = true;
				op.style = 'display:none;';
				op.id = 'audio';
				op.src = url;
			}
			if ($('#audio').length > 0) {	
				var audio = document.getElementById('audio');
				audio.pause();			
				$('#audio').remove();
			}
			
			$('body').append(op);
			audioCanPlay = false;

			setTimeout(function(){
				audioCanPlay = true;
			},1000)
				
		},

		getLawyerOrderList: function () {
			var _t = this;
			// 获取本地律师
			var params = {}
			params[global.rows] = 4;
			params[global.page] = 1;
			params.orderSource = 2;
			utils.get(URL.lawyerObj.order.query, params, function (res) {
				let list = res.data.list || []

				$.each(list, function (index, item) {
					$.each(global.rs.orderStatus, function (i, t) {
						if (t.id == item.orderStatus) {
							item.statusName = t.name;
						}
					})
					$.each(global.rs.orderType, function (i, t) {
						if (t.id == item.orderType) {
							item.typeName = t.name;
						}
					})
					$.each(global.rs.orderCategory, function (i, t) {
						if (t.id == item.orderCategory) {
							item.categoryName = t.name;
						}
					})
					var questionType = _t.getQuestionType();
					$.each(questionType, function (i, t) {
						if (t.id == item.questionType) {
							item.questionTypeName = t.name;
						}
					})
				})
				var html = utils.getTemp('/lawyer/temp/common/orderItem.html', list)
				$('.newsRight').find('ul').html(html);
			})
		},
	}

	gather.init();

	exports('base', gather);
});
var base = layui.base;
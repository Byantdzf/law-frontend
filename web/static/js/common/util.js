/**
 * hash 插件：
 * add         hash.add({id: 1, name: 'test'})
 * get         hash.get('id')
 * remove      hash.remove('id')
 * clear       hash.clear()
 */
$(function () { (function (a, b) { "use strict"; var c = function () { var b = function () { var b = a.location.hash ? a.location.hash.substr(1).split("&") : [], c = {}; for (var d = 0; d < b.length; d++) { var e = b[d].split("="); c[e[0]] = decodeURIComponent(e[1]) } return c }; var c = function (b) { var c = []; for (var d in b) { c.push(d + "=" + encodeURIComponent(b[d])) } a.location.hash = c.join("&") }; return { get: function (a) { var c = b(); if (a) { return c[a] } else { return c } }, add: function (a) { var d = b(); for (var e in a) { d[e] = a[e] } c(d) }, remove: function (a) { a = typeof a == "string" ? [a] : a; var d = b(); for (var e = 0; e < a.length; e++) { delete d[a[e]] } c(d) }, clear: function () { c({}) } } }(); a.hash = c })(window) });

/**
 * md5 插件
 * hex_md5('password')
*/
var hexcase = 0; var b64pad = ""; var chrsz = 8; function hex_md5(a) { return binl2hex(core_md5(str2binl(a), a.length * chrsz)) } function b64_md5(a) { return binl2b64(core_md5(str2binl(a), a.length * chrsz)) } function str_md5(a) { return binl2str(core_md5(str2binl(a), a.length * chrsz)) } function hex_hmac_md5(a, b) { return binl2hex(core_hmac_md5(a, b)) } function b64_hmac_md5(a, b) { return binl2b64(core_hmac_md5(a, b)) } function str_hmac_md5(a, b) { return binl2str(core_hmac_md5(a, b)) } function md5_vm_test() { return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72" } function core_md5(p, k) { p[k >> 5] |= 128 << ((k) % 32); p[(((k + 64) >>> 9) << 4) + 14] = k; var o = 1732584193; var n = -271733879; var m = -1732584194; var l = 271733878; for (var g = 0; g < p.length; g += 16) { var j = o; var h = n; var f = m; var e = l; o = md5_ff(o, n, m, l, p[g + 0], 7, -680876936); l = md5_ff(l, o, n, m, p[g + 1], 12, -389564586); m = md5_ff(m, l, o, n, p[g + 2], 17, 606105819); n = md5_ff(n, m, l, o, p[g + 3], 22, -1044525330); o = md5_ff(o, n, m, l, p[g + 4], 7, -176418897); l = md5_ff(l, o, n, m, p[g + 5], 12, 1200080426); m = md5_ff(m, l, o, n, p[g + 6], 17, -1473231341); n = md5_ff(n, m, l, o, p[g + 7], 22, -45705983); o = md5_ff(o, n, m, l, p[g + 8], 7, 1770035416); l = md5_ff(l, o, n, m, p[g + 9], 12, -1958414417); m = md5_ff(m, l, o, n, p[g + 10], 17, -42063); n = md5_ff(n, m, l, o, p[g + 11], 22, -1990404162); o = md5_ff(o, n, m, l, p[g + 12], 7, 1804603682); l = md5_ff(l, o, n, m, p[g + 13], 12, -40341101); m = md5_ff(m, l, o, n, p[g + 14], 17, -1502002290); n = md5_ff(n, m, l, o, p[g + 15], 22, 1236535329); o = md5_gg(o, n, m, l, p[g + 1], 5, -165796510); l = md5_gg(l, o, n, m, p[g + 6], 9, -1069501632); m = md5_gg(m, l, o, n, p[g + 11], 14, 643717713); n = md5_gg(n, m, l, o, p[g + 0], 20, -373897302); o = md5_gg(o, n, m, l, p[g + 5], 5, -701558691); l = md5_gg(l, o, n, m, p[g + 10], 9, 38016083); m = md5_gg(m, l, o, n, p[g + 15], 14, -660478335); n = md5_gg(n, m, l, o, p[g + 4], 20, -405537848); o = md5_gg(o, n, m, l, p[g + 9], 5, 568446438); l = md5_gg(l, o, n, m, p[g + 14], 9, -1019803690); m = md5_gg(m, l, o, n, p[g + 3], 14, -187363961); n = md5_gg(n, m, l, o, p[g + 8], 20, 1163531501); o = md5_gg(o, n, m, l, p[g + 13], 5, -1444681467); l = md5_gg(l, o, n, m, p[g + 2], 9, -51403784); m = md5_gg(m, l, o, n, p[g + 7], 14, 1735328473); n = md5_gg(n, m, l, o, p[g + 12], 20, -1926607734); o = md5_hh(o, n, m, l, p[g + 5], 4, -378558); l = md5_hh(l, o, n, m, p[g + 8], 11, -2022574463); m = md5_hh(m, l, o, n, p[g + 11], 16, 1839030562); n = md5_hh(n, m, l, o, p[g + 14], 23, -35309556); o = md5_hh(o, n, m, l, p[g + 1], 4, -1530992060); l = md5_hh(l, o, n, m, p[g + 4], 11, 1272893353); m = md5_hh(m, l, o, n, p[g + 7], 16, -155497632); n = md5_hh(n, m, l, o, p[g + 10], 23, -1094730640); o = md5_hh(o, n, m, l, p[g + 13], 4, 681279174); l = md5_hh(l, o, n, m, p[g + 0], 11, -358537222); m = md5_hh(m, l, o, n, p[g + 3], 16, -722521979); n = md5_hh(n, m, l, o, p[g + 6], 23, 76029189); o = md5_hh(o, n, m, l, p[g + 9], 4, -640364487); l = md5_hh(l, o, n, m, p[g + 12], 11, -421815835); m = md5_hh(m, l, o, n, p[g + 15], 16, 530742520); n = md5_hh(n, m, l, o, p[g + 2], 23, -995338651); o = md5_ii(o, n, m, l, p[g + 0], 6, -198630844); l = md5_ii(l, o, n, m, p[g + 7], 10, 1126891415); m = md5_ii(m, l, o, n, p[g + 14], 15, -1416354905); n = md5_ii(n, m, l, o, p[g + 5], 21, -57434055); o = md5_ii(o, n, m, l, p[g + 12], 6, 1700485571); l = md5_ii(l, o, n, m, p[g + 3], 10, -1894986606); m = md5_ii(m, l, o, n, p[g + 10], 15, -1051523); n = md5_ii(n, m, l, o, p[g + 1], 21, -2054922799); o = md5_ii(o, n, m, l, p[g + 8], 6, 1873313359); l = md5_ii(l, o, n, m, p[g + 15], 10, -30611744); m = md5_ii(m, l, o, n, p[g + 6], 15, -1560198380); n = md5_ii(n, m, l, o, p[g + 13], 21, 1309151649); o = md5_ii(o, n, m, l, p[g + 4], 6, -145523070); l = md5_ii(l, o, n, m, p[g + 11], 10, -1120210379); m = md5_ii(m, l, o, n, p[g + 2], 15, 718787259); n = md5_ii(n, m, l, o, p[g + 9], 21, -343485551); o = safe_add(o, j); n = safe_add(n, h); m = safe_add(m, f); l = safe_add(l, e) } return Array(o, n, m, l) } function md5_cmn(h, e, d, c, g, f) { return safe_add(bit_rol(safe_add(safe_add(e, h), safe_add(c, f)), g), d) } function md5_ff(g, f, k, j, e, i, h) { return md5_cmn((f & k) | ((~f) & j), g, f, e, i, h) } function md5_gg(g, f, k, j, e, i, h) { return md5_cmn((f & j) | (k & (~j)), g, f, e, i, h) } function md5_hh(g, f, k, j, e, i, h) { return md5_cmn(f ^ k ^ j, g, f, e, i, h) } function md5_ii(g, f, k, j, e, i, h) { return md5_cmn(k ^ (f | (~j)), g, f, e, i, h) } function core_hmac_md5(c, f) { var e = str2binl(c); if (e.length > 16) { e = core_md5(e, c.length * chrsz) } var a = Array(16), d = Array(16); for (var b = 0; b < 16; b++) { a[b] = e[b] ^ 909522486; d[b] = e[b] ^ 1549556828 } var g = core_md5(a.concat(str2binl(f)), 512 + f.length * chrsz); return core_md5(d.concat(g), 512 + 128) } function safe_add(a, d) { var c = (a & 65535) + (d & 65535); var b = (a >> 16) + (d >> 16) + (c >> 16); return (b << 16) | (c & 65535) } function bit_rol(a, b) { return (a << b) | (a >>> (32 - b)) } function str2binl(d) { var c = Array(); var a = (1 << chrsz) - 1; for (var b = 0; b < d.length * chrsz; b += chrsz) { c[b >> 5] |= (d.charCodeAt(b / chrsz) & a) << (b % 32) } return c } function binl2str(c) { var d = ""; var a = (1 << chrsz) - 1; for (var b = 0; b < c.length * 32; b += chrsz) { d += String.fromCharCode((c[b >> 5] >>> (b % 32)) & a) } return d } function binl2hex(c) { var b = hexcase ? "0123456789ABCDEF" : "0123456789abcdef"; var d = ""; for (var a = 0; a < c.length * 4; a++) { d += b.charAt((c[a >> 2] >> ((a % 4) * 8 + 4)) & 15) + b.charAt((c[a >> 2] >> ((a % 4) * 8)) & 15) } return d } function binl2b64(d) { var c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"; var f = ""; for (var b = 0; b < d.length * 4; b += 3) { var e = (((d[b >> 2] >> 8 * (b % 4)) & 255) << 16) | (((d[b + 1 >> 2] >> 8 * ((b + 1) % 4)) & 255) << 8) | ((d[b + 2 >> 2] >> 8 * ((b + 2) % 4)) & 255); for (var a = 0; a < 4; a++) { if (b * 8 + a * 6 > d.length * 32) { f += b64pad } else { f += c.charAt((e >> 6 * (3 - a)) & 63) } } } return f };

/**
 * cookie 插件
 * cookie('COOKIE-NAME', data, { path: '/', expires: 30 }
*/
function cookie(e, o, t) { e = e || ""; var n, i, r, a, c, p, s, d, u; if ("undefined" == typeof o) { if (p = null, document.cookie && "" != document.cookie) for (s = document.cookie.split(";"), d = 0; d < s.length; d++)if (u = $.trim(s[d]), u.substring(0, e.length + 1) == e + "=") { p = decodeURIComponent(u.substring(e.length + 1)); break } return p } t = t || {}, null === o && (o = "", t.expires = -1), n = "", t.expires && ("number" == typeof t.expires || t.expires.toUTCString) && ("number" == typeof t.expires ? (i = new Date, i.setTime(i.getTime() + 864e5 * t.expires)) : i = t.expires, n = "; expires=" + i.toUTCString()), r = t.path ? "; path=" + t.path : "", a = t.domain ? "; domain=" + t.domain : "", c = t.secure ? "; secure" : "", document.cookie = [e, "=", encodeURIComponent(o), n, r, a, c].join(""); }

/**
 * 继承layui.util以下方法，然后扩展自己的方法
 * countdown
 * digit
 * escape
 * fixbar
 * timeAgo
 * toDateString
 * 
 * 自定义：
 * setCookie    设置cookie,   name, data, params(path,路径，默认根目录，expires,有效期，默认浏览器有效期)
 * cookie       读取cookie,   name
 */
layui.define(function (exports) {
	var gahter = {
		// 异步 get
		get: function (url, param, callback) {
			this.ajax(url, param, callback, { "type": "GET", "asyn": true });
		},

		// 同步 get
		getSync: function (url, param, callback) {
			this.ajax(url, param, callback, { "type": "GET", "asyn": false });
		},

		// post 表单
		post: function (url, param, callback) {
			this.ajax(url, param, callback, { "type": "POST", "asyn": true }); // POST
		},

		// put 表单
		put: function (url, param, callback) {
			var ct = 'application/json;charset=utf-8';
			this.ajax(url, JSON.stringify(param), callback, { "type": "PUT", "ct": ct, "asyn": true });
		},

		// del 表单
		del: function (url, param, callback) {
			this.ajax(url, param, callback, { "type": "DELETE", "asyn": true }); // POST
		},

		// post JSON
		postJson: function (url, param, callback) {
			var ct = 'application/json;charset=utf-8';
			this.ajax(url, JSON.stringify(param), callback, { "type": "POST", "ct": ct, "asyn": true });
		},

		//Ajax
		ajax: function (url, data, callback, options) {
			if (options.type == 'POST') {
				if (global.LOADING_URL[url]) {
					return;
				}
			}

			if (typeof data === 'function') {
				callback = data;
				data = '';
			}

			options = options || {};
			data = data || {};

			var isLoading = !data.notLoading;	// 如果接口不需要loading效果
			delete (data.notLoading);

			// 判断接口是否需要授权，处理授权相关信息
			var headers = {}
			// var isAuth = !data.noAuth;
			// delete (data.noAuth);
			if (gather.cookie(global.token)) {
				var headers = {
					Authorization: 'Bearer ' + gather.cookie(global.token)
				};
				// data.account = gahter.cookie('account');
			}

			// 读取当前默认城市
			var areas = utils.cookie(global.areaCookie);
			if (areas) {
				areas = JSON.parse(areas) || {};
			} else {
				areas = global.defaultArea;
			}

			gather.setCookie(global.requestAreaCookie, areas.id);

			if (url && url.indexOf('?') > -1) {
				url = url + '&_=' + Math.random()
			} else {
				url = url + '?_=' + Math.random()
			}

			return $.ajax({
				headers: headers || '',
				type: options.type || 'POST',
				dataType: options.dataType || 'json',
				contentType: options.ct || 'application/x-www-form-urlencoded; charset=UTF-8',
				async: options.asyn,
				data: data,
				url: url,
				beforeSend: function () {
					$('.submit').attr("disabled", "disabled");
					// if (isLoading) {
					// 	gather.loading();
					// 	global.LOADING_URL[url] = true;
					// }
				},
				success: function (res) {
					if (!res.data) {
						res.data = {};
					}
					if (res.code === "000000" || res.code == 2) {
						if (callback) {
							callback(res);
						}
					} else if (res.code == '01') {
						// gather.setCookie(global.userInfoToken, '');	// 登录信息存入cookie
						// gather.setCookie(global.token, '');
						// gather.setCookie(global.backToken, '');
						// window.parent.location.pathname != '/user.html' && (window.location = '/user.html');
					} else if (res.code == 'E00006') {
						// gather.setCookie(global.userInfoToken, '');	// 登录信息存入cookie
						// gather.setCookie(global.token, '');
						// gather.setCookie(global.backToken, '');
						// window.parent.location.pathname != '/user.html' && (window.location = '/user.html');
					} else {
						if (url.indexOf('/pc/user/wechat/login/result') == -1) {
							gather.msg(res.data || res.msg || res.code);
						}
					}
				},
				complete: function () {
					// global.LOADING_URL[url] = false;
					// var flag = 0;
					// $.each(global.LOADING_URL, function (i, t) {
					// 	t && (flag = 1);
					// });
					// if (!flag) {
					// 	gather.removeLoading();
					// }
					$('.submit').removeAttr("disabled");
				},
				error: function (e) {
					if (e.responseJSON.message == '非法访问用户') {
						gather.setCookie(global.userInfoToken, '');	// 登录信息存入cookie
						gather.setCookie(global.token, '');
						gather.setCookie(global.backToken, '');
					}
					gather.msg(options.error || '请求异常，请重试', {
						shift: 6
					});
				}
			});
		},

		loading: function () {
			var loadingBox = '.APP-Loading';
			if (!$(loadingBox).length) {
				var html = '<div class="layui-layer-shade" style="z-index: 19899999; background-color: rgb(255, 255, 255); opacity: 0.5;"></div><div class="layui-layer layui-layer-loading" style="z-index: 19999999; top: 50%; left: 50%; margin: -16px 0 0 -16px;"><div class="layui-layer-content layui-layer-loading2"></div><span class="layui-layer-setwin"></span></div>';
				$('body').append('<div class="APP-Loading">' + html + '</div>');
			}
		},

		removeLoading: function () {
			var loadingBox = '.APP-Loading';
			$(loadingBox).remove();
		},

		// 设置 cookie
		setCookie: function (name, data, params) {
			params = params || {};
			var p = {};
			p.path = params.path || '/';
			if (params.expires) {
				p.expires = params.expires;
			}
			var setData = data;
			if (typeof (data) == 'object') {
				setData = JSON.stringify(data);
			}
			cookie(name, setData, p);
		},

		// 读取 cookie
		cookie: function (name) {
			var setData = cookie(name);
			if (typeof (setData) == 'object') {
				setData = JSON.parse(setData);
			}
			return setData;
		},

		random: function () {
			return new Date().getTime().toString() + (Math.floor(Math.random() * 90000) + 10000).toString();
		},

		//读取模板，如果有data,则先渲染模板，然后再返回html
		tempHash: {},
		getTemp: function (url, data) {
			var temp = gather.tempHash[url];
			if (!temp) {
				$.ajax({
					type: "get",
					// url: url,
					url: url + '?_=' + gather.random(),
					async: false,
					success: function (response) {
						temp = response;
					}
				});
			}
			data = data || {};
			return gather.renderTemp(temp, data);
		},
		// 渲染模板，返回html
		renderTemp: function (temp, data) {
			var render = '';
			laytpl(temp).render(data, function (html) {
				render = html;
			});
			return render;
		},

		// 获取浏览器参数
		getQueryString: function (name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return decodeURI(r[2]);
			return null;
		},

		// 格式化日期，显示为：年月日
		formatYMD: function (times) {
			var str = '';
			if (times) {
				str = times.split(' ')[0];
			}
			return str;
		},

		// 获取表单内常规控件对应的值
		formData: function (container) {
			var box = container ? $(container) : $('#APP .search-box');
			var params = {};
			box.find("input,select,textarea").each(function (i, e) {
				var val = $.trim($(e).val());
				if (!$(this).closest('.hidden').length) {
					if (e.name) {
						if (e.name.indexOf('-') > -1) {
							var nameArr = e.name.split('-');
							var valArr = val.split(' - ');
							$.each(nameArr, function (i, t) {
								params[t] = valArr[i];
							})
						} else {
							params[e.name] = $(e).attr('data-id') && val ? $(e).attr('data-id') : val;
						}
					}
				}
			});
			if (box.find('input[type="radio"]').length) {
				box.find('input[type="radio"]:checked').each(function (i, e) {
					params[e.name] = $(e).val();
				});
			}
			return params;
		},

		initDate: function (box, p) {
			var opts = p || {};
			opts.elem = box;
			opts.theme = '#3D93DB';
			return laydate.render(opts);
		},

		initDateRange: function (box, p) {
			p = p || {};
			p.range = true;
			p.showBottom = false;

			if (p.type == "datetime" || p.type == "time") {
				p.showBottom = true;
			}
			return gather.initDate(box, p);
		},

		lang: function (lan) {
			lan = lan || 'cn';
			if (!global.lang || JSON.stringify(global.lang) == '{}') {
				var url = '/static/lang/' + lan + '.json?_=' + gather.random();
				$.ajax({
					type: "get",
					url: url,
					async: false,
					success: function (res) {
						global.lang = res;
						global = $.extend(true, global, res);
					}
				});
			}
		},

		// 读取用户登录cookie
		localusers: function () {
			global.userInfo = this.cookie(global.userInfoToken) ? JSON.parse(this.cookie(global.userInfoToken)) : {};
		},

		// 跳转路由
		router: function (url, box) {
			box = box ? $(box) : $('#LAY_app_body');
			var actUrl = decodeURIComponent(url);

			var urlArr = actUrl.split('.');
			urlArr.pop();
			var jsUrl = urlArr.join('.');

			actUrl = encodeURIComponent(actUrl);

			hash.clear();
			hash.add({ p: actUrl });
			var html = '<div class="layui-fluid"></div><script src="/static/js' + jsUrl + '.js?_t' + this.random() + '"></script>';
			box.html(html);

			_t.root = $('#APP');
			_t.root.off('click');
			_t.actions && _t.actions()

			gather.setLocation(actUrl);
		},

		setLocation: function (url) {
			var currId = '';
			if (global.menus.length) {
				layui.each(global.menus, function (index, item) {
					var hashUrl = url ? decodeURIComponent(url) : '';
					if (hashUrl == item.menuUrl) {
						currId = item.id;
					}
				});
			}
			var arr = gather.getAllParents(currId) || [];
			var html = gahter.getTemp('/page/common/location.html', arr);
			$('#APP_breadcrumb').html(html);
			element.init();
		},

		getAllParents: function (id, arr) {
			arr = arr || [];
			layui.each(global.menus, function (i, t) {
				if (id == t.id) {
					currId = t.id;
					arr.push(t);
					gather.getAllParents(t.parentId, arr)
				}
			});
			arr.reverse();
			return arr;
		},

		screen: function () {
			var e = $(window).width();
			return e > 1200 ? 3 : e > 992 ? 2 : e > 768 ? 1 : 0;
		},

		getTree: function (datas) {
			var pid = 'parentId';
			var id = 'id';
			if (Object.prototype.toString.call(datas) != '[object Array]') {
				throw new Error('参数必须是Array！');
				return false;
			}
			var temptree = [];
			var tree = [];
			var items = [];
			$.each(datas, function (i, t) {
				if (!temptree[t[id]]) {
					var item = t;
					item.children = [];
					temptree[t[id]] = item;
					items.push(item);
				}
			});
			$.each(items, function (i, t) {
				if (temptree[t[pid]]) {
					temptree[t[id]].isOpen && (temptree[t[pid]].isOpen = 1);
					temptree[t[pid]]["children"].push(temptree[t[id]]);
				} else {
					tree.push(temptree[t[id]]);
				}
			});
			temptree = null;
			items = null;
			return tree;
		},

		isType: function (data) {
			var arr = {
				'[object Number]': 'number',
				'[object String]': 'string',
				'[object function]': 'function',
				'[object Undefined]': 'undefined',
				'[object Boolean]': 'boolean',
				'[object Object]': 'object',
				'[object Array]': 'array',
				'[object Null]': 'null',
			}
			return arr[Object.prototype.toString.call(data)];
		},

		msg: function (content, icon, callback) {
			layer.msg(content, {
				icon: icon,
				shade: '0.3',
				time: 1000
			}, callback)
		},

		alert: function (content, icon, callback) {
			if (typeof icon === 'function') {
				callback = icon;
				icon = {};
			}
			layer.alert(content, {
				icon: icon
			}, callback)
		},

		confirm: function (content, params, yes, no) {
			if (typeof params === 'function') {
				no = yes;
				yes = params;
				params = null;
			}
			var opts = {
				icon: 3,
				title: params.title || '提示'
			};
			params && (opts = $.extend(true, opts, params));
			layer.confirm(content, opts, yes, no);
		},

		/**
		 * 继承 layui.open 方法，
		 * 常用参数： area，success, yes
		 */
		dialog: function (params) {
			var opts = {
				id: 'APP_Dialog_' + Math.floor(Math.random() * 90000) + 10000,
				title: '提示',
				type: 1,
				shade: 0.5,
				closeBtn: 1,
				offset: '100px',
				moveType: 1,
				shadeClose: 1,
				resize: 0,
				moveOut: 1
			}
			params && (opts = $.extend(true, opts, params));
			opts.btn && (opts.btnAlign = 'c');
			layer.open(opts);
		},

		openForm: function (params) {
			var cb = params.success;
			var yes = params.yes;
			delete (params.success);
			delete (params.yes);
			var opts = {
				area: "800px",
				btn: ['保存', '关闭'],
				content: '<div class="updateBox layui-form ' + params.class + '"></div>',
				success: function (layero) {
					cb && cb(layero);
				},
				yes: function (index, layero) {
					var msgFlag = 0;
					layero.find('.items').each(function () {
						var node = $(this);
						var type = node.attr('data-type');
						var msg = '请填写' + node.find('.layui-form-label span').html();
						if (node.attr('data-required')) {
							if (type == 'checkbox') {
								var ids = [];
								node.find('input:checked').each(function () {
									ids.push($(this).val());
								});
								if (!ids.length) {
									msgFlag = 1;
									gahter.msg(msg);
									return false;
								}
							} else {
								var val = $.trim(node.find('input, select, textarea').val());
								if (!val) {
									msgFlag = 1;
									gahter.msg(msg);
									return false;
								}
							}
						}
					});
					if (msgFlag) {
						return false;
					} else {
						yes && yes(index);
					}
				}
			};
			params && (opts = $.extend(true, opts, params));
			gahter.dialog(opts);
		},

		loadUpdateForm: function (box, forms, item) {
			var parents = box.find('.updateBox');
			if (item) {
				$.each(forms, function (i, t) {
					(item[t.field] || item[t.field] == 0) && (t.value = item[t.field]);
				});
			}
			var html = gather.getTemp('/page/common/updateForm.html', forms);
			parents.html(html);
			// 如果表单中有时间控件，初始化时间控件
			parents.find('.dateIcon').each(function () {
				var elem = $(this);
				var type = $(this).attr('data-type');
				if (type == 'year' || type == 'month' || type == 'date' || type == 'time' || type == 'datetime') {
					if (elem.attr('data-range')) {
						gather.initDateRange(elem[0], { type: type });
					} else {
						gather.initDate(elem[0], { type: type });
					}
				}
			});

			$.each(forms, function (i, t) {
				if (t.type == 'select' && t.rs) {
					var defaultStr = t.default || '';
					var defaultVal = item[t.field] || '';
					gahter.getSelect(t.rs, '.edit_' + t.field, defaultStr, defaultVal);
				}
			})
		},

		getSelect: function (data, box, defaults, showId) {
			var defaultStr = defaults || global.msg.select;
			if (data.length == 0) {
				$(box).html('<option value="">' + defaultStr + '</option>');
			} else {
				$(box).html('');
				var temp = '';
				if (defaults) {
					temp += '<option value="">' + defaultStr + '</option>';
				}
				layui.each(data, function (i, t) {
					if ($.trim(t)) {
						var d = '';
						var id = '';
						var name = '';
						if (gather.isType(t) == 'object') {
							d = showId == t.id ? ' selected="selected"' : '';
							id = t.id;
							name = t.name;
						} else if (gather.isType(t) == 'array') {
							d = showId == t[0] ? ' selected="selected"' : '';
							id = t[0];
							name = t[1];
						} else {
							d = showId == i ? ' selected="selected"' : '';
							id = i;
							name = t;
						}
						temp += '<option value="' + id + '"' + d + '>' + name + '</option>';
					}
				});
				$(box).html(temp);
				try {
					form.render();
				} catch (e) {
					//TODO handle the exception
				}
			}
		},

		getRadio: function (data, box, value, notNeedDefault) {
			var fields = '';
			if (gather.isType(box) == 'string') {
				fields = $(box).data('name');
				if ($(box).data('val') && !value) {
					value = $(box).data('val');
				}
			} else {
				fields = box.data('name');
				if (box.data('val') && !value) {
					value = box.data('val');
				}
			}

			var html = '';
			layui.each(data, function (i, t) {
				if (t) {
					var keys = '';
					var val = '';
					if (gather.isType(t) == 'object') {
						keys = t.id;
						val = t.name;
					} else if (gather.isType(t) == 'array') {
						keys = t[0];
						val = t[1];
					} else {
						keys = i;
						val = t;
					}
					var ck = '';
					if (!notNeedDefault) {
						if (value || value === 0) {
							ck = value == keys ? ' checked="checked"' : '';
						} else {
							if (data[0]) {
								ck = i == 0 ? ' checked="checked"' : '';
							} else {
								ck = i == 1 ? ' checked="checked"' : '';
							}
						}
					}
					html += '<input type="radio" name="' + fields + '" value="' + keys + '"' + ck + ' lay-skin="primary" title="' + val + '" lay-filter="filter_' + fields + '">';
				}
			});
			$(box).html(html);
			form.render('radio');
		},

		getCheckbox: function (data, box, value) {
			var fields = '';
			if (gather.isType(box) == 'string') {
				fields = $(box).attr('data-name');
			} else {
				fields = box.attr('data-name');
			}
			var html = '';
			layui.each(data, function (i, t) {
				if (t) {
					var keys = '';
					var val = '';
					if (gather.isType(t) == 'object') {
						keys = t.id;
						val = t.name;
					} else if (gather.isType(t) == 'array') {
						keys = t[0];
						val = t[1];
					} else {
						keys = i;
						val = t;
					}
					var ck = '';
					if (value || value === 0) {
						var cv = ',' + value + ',';
						if (cv.indexOf(',' + keys + ',') > -1) {
							ck = ' checked="checked"';
						}
					}
					html += '<input type="checkbox" name="' + fields + '" value="' + keys + '"' + ck + ' lay-skin="primary" title="' + val + '" lay-filter="filter_' + fields + '">';
				}
			});
			$(box).html(html);
			form.render();
		},

		exportFiles: function (url, params) {
			for (var k in params) {
				if (params[k] === '') {
					delete params[k];
				}
			}
			params._ = +new Date;
			console.log(url + '?' + $.param(params));
			window.open(url + '?' + $.param(params));
		},

		// 计算弹窗高度
		setMainTableHeight: function (box) {
			var obj = $('#APP .autoFixHeight');
			var objTop = obj.offset().top;
			var winH = $(window).height();
			// var objTop = obj.position().top;
			var objH = winH - objTop - 90;
			obj.css('height', objH + 'px');
		},

		/**
		 * 
		 * @param {*} opts 
		 * @param {*} opts.noSearch  	可选，不显示搜索区域
		 * @param {*} opts.actions	 	可选，列表上面需要添加的操作按钮，array;
		 * @param {*} opts.tableClass	可选，表格样式
		 * @param {*} opts.filters	 	可选，列表上面需要添加的筛选条件, array;
		 * @param {*} opts.selected	 	可选，和 filters 关联使用，默认值
		 * @param {*} opts.field	 	可选，和 filters 关联使用，表格查询 filters 的参数名
		 * @param {*} box 
		 */
		initPage: function (opts, box) {
			opts = opts || {};
			opts.actions = opts.actions || [];
			opts.filters = opts.filters || [];
			opts.searchParams = opts.searchParams || [];
			var html = this.getTemp('/page/common/initPage.html', opts);
			var container = box ? $(box) : $('#LAY_app_body .layui-fluid');
			container.html(html);

			// autoFixHeight
			// gather.setMainTableHeight();

			// 如果有查询条件
			if (opts.searchParams.length) {
				var searchBox = container.find('.app-search-box');
				var html = this.getTemp('/page/common/initSearch.html', opts.searchParams);
				searchBox.html(html);

				// 如果搜索框中有时间，默认加载时间控件
				$.each(opts.searchParams, function (i, t) {
					if (t.type == 'date') {
						gahter.initDate(searchBox.find('.search-' + t.field)[0], {
							done: function () {
								global.autoSearch && searchBox.find('.search').click();
							}
						});
					} else if (t.type == 'dateRange') {
						gahter.initDateRange(searchBox.find('.search-' + t.field)[0], {
							done: function () {
								// 这里不加setTimeout，选择结果不会显示到页面上，被下面的操作影响掉了
								if (global.autoSearch) {
									setTimeout(function () {
										searchBox.find('.search').click();
									}, 0)
								}
							}
						});
					} else if (t.type == 'select' && t.rs) {
						gahter.getSelect(t.rs, '.search-' + t.field, global.msg.select);
					}
				})

				// 处理搜索框中下拉选择回调
				if (global.autoSearch) {
					searchBox.find('select').each(function () {
						var filter = $(this).attr('lay-filter');
						if (filter) {
							form.on('select(' + filter + ')', function () {
								searchBox.find('.search').click();
							});
						}
					})
				}
				form.render();
			}
		},

		/**
		 * 
		 * @param {*} p 
		 * @param {*} p.box 
		 * @param {*} p.page 
		 * @param {*} p.rows 
		 * @param {*} p.searchData 
		 * @param {*} p.noPage 
		 * @param {*} actions 
		 */
		queryList: function (tp, actions) {
			var p = $.extend(true, {}, tp);
			var tableId = p.id || 'APP-table-' + gahter.random();
			tp.id = tableId;

			var container = p.box ? $(p.box) : $('#LAY_app_body .layui-fluid');
			var serchBox = container.find('.app-search-box');
			var tabBox = container.find('.app-table-tab');
			var tableBox = container.find('.app-table-box');
			var pageBox = container.find('.app-page-box');

			if (tableBox.find('table').length) {
				tableId = tableBox.find('table').attr('id');
			} else {
				tableBox.html('<table class="layui-hide" id="' + tableId + '"></table>');
			}

			var params = {};
			if (p.searchData) {
				params = p.searchData
			} else {
				params = gather.formData(serchBox);
			}
			params[global.rows] = p.rows ? p.rows : global.defaultRows;
			params[global.page] = p.page ? p.page : global.defaultPage;

			// 筛选项
			if (tabBox.length) {
				var tabStr = tabBox.attr('data-id');
				tabStr && (params[tabStr] = tabBox.find('li.layui-this').attr('data-id'));
			}

			// 处理表格参数
			if (p.cols.length) {
				$.each(p.cols, function (i, t) {
					$.each(t, function (i2, t2) {
						// 根据索引显示名字，区分颜色
						if (t2.rs && t2.rs.length) {
							t2.templet = function (d) {
								var str = d[t2.field] || d[t2.field] == 0 ? d[t2.field] : '';
								if (str || str == 0) {
									var item = '';
									$.each(t2.rs, function (i3, t3) {
										t3.id == d[t2.field] && (item = t3);
									});
									item && (str = item.name);
									item.type && (str = '<span class="f-' + item.type + '">' + str + '</span>');
								}
								return str;
							}
						}

						// 转换时间为只显示日期
						if (t2.type == 'date') {
							t2.templet = function (d) {
								return gahter.formatYMD(d[t2.field]);
							}
						} else if (t2.type == 'image') {
							t2.templet = function (d) {
								var imgArr = d[t2.field] ? d[t2.field].split(',') : [];
								var html = '<div class="imgList tableImg">';
								$.each(imgArr, function (i, t) {
									html += '<div class="showImg" data-url="' + t + '" style="background-image:url(' + t + ');" data-url="' + t + '"></div>'
								})
								html += '</div>';
								return html;
							}
						}

						// 按钮部分
						if (t2.actions && t2.actions.length) {
							t2.templet = function (d) {
								var html = '<div class="actions">';
								$.each(t2.actions, function (i3, t3) {
									var type = t3.type ? 'layui-btn-' + t3.type : '';
									if ((!t3.filter && t3.filter != 0) || d[t3.filter] == t3.filterVal) {
										html += '<button class="layui-btn layui-btn-xs ' + t3.id + ' ' + type + '" data-type="' + t3.id + '">' + t3.name + '</button>'
									}
								});
								html += '</div>';
								return html;
							}
						}

						// 如果单列没有设置排列方式，默认居中排列
						!t2.align && (t2.align = 'center');

						// 如果有设置宽度
						if (t2.width) {
							// console.log(t2.width);
							if (t2.width.toString().indexOf('%') == -1) {
								t2.width = Number(t2.width);
							} else if (t2.width.toString().indexOf('px') != -1) {
								t2.width = Number(t2.width.replace('px', ''));
							}
						}
					});
				});
			}

			gahter.get(p.url, params, function (response) {
				var arr = response.data;
				var rs = arr.list || arr || [];
				var tps = {
					elem: '#' + tableId,
					data: rs,
					// size: "sm",
				};
				tps = $.extend(true, tps, p);

				delete (tps.url);
				table.render(tps);

				tableBox.find('.layui-table-main tr').each(function (i, t) {
					t.data = rs[i];
					$(t).attr('data-id', rs[i].id).addClass('tr_' + i);

					// 表格数据undefined清空
					$(t).find('td').each(function () {
						if ($(this).find('.layui-table-cell').html() == 'undefined') {
							$(this).find('.layui-table-cell').html('')
						}
					});
					gather.autoFixedHeight(tableId);
					actions && actions(params[global.page], $(t), t.data);  // currPage  tr   tr.data
				});

				// 表格上方如果有筛选项 
				element.on('tab(app-table-filter)', function (res) {
					gather.queryList(tp, actions);
				});

				// 处理分页
				if (rs.length && !p.noPage) {
					pageBox.removeClass('hidden');
					var pageParams = {
						elem: pageBox[0],
						curr: params[global.page],
						limit: params[global.rows],
						count: arr.totalRow,
					};
					gather.getPageList(pageParams, function (obj, first) {
						if (!first) {
							tp.page = obj.curr;
							tp.rows = obj.limit;
							gather.queryList(tp, actions);
						}
					});
				} else {
					pageBox.addClass('hidden');
				}
			});
		},

		/**
		 * 
		 * @param {*} p 
		 * @param {*} p.box 
		 * @param {*} p.page 
		 * @param {*} p.rows 
		 * @param {*} p.searchData 
		 * @param {*} p.noPage 
		 * @param {*} actions 
		 */
		queryTempList: function (tp, actions) {
			var p = $.extend(true, {}, tp);

			var container = $(p.box);
			var tableBox = container.find('.app-list');
			var pageBox = container.find('.app-page-box');

			var params = {};
			if (p.searchData) {
				params = p.searchData
			}
			params[global.rows] = p.rows ? p.rows : global.defaultRows;
			params[global.page] = p.page ? p.page : global.defaultPage;

			gahter.get(p.url, params, function (response) {
				var arr = response.data;
				var rs = arr.list || arr || [];
				var html = gather.getTemp(p.temp, rs);

				tableBox.html(html);

				tableBox.find('li').each(function (i, t) {
					t.data = rs[i];
				});

				actions && actions(params[global.page], arr)

				// 处理分页
				if (rs.length && !p.noPage) {
					pageBox.removeClass('hidden');
					var pageParams = {
						elem: pageBox[0],
						curr: params[global.page],
						limit: params[global.rows],
						count: arr.totalRow,
					};
					gather.getPageList(pageParams, function (obj, first) {
						if (!first) {
							tp.page = obj.curr;
							tp.rows = obj.limit;
							gather.queryTempList(tp, actions);
						}
					});
				} else {
					pageBox.addClass('hidden');
				}
			});
		},

		getPageList: function (params, callback) {
			var plp = {
				layout: ['count', 'prev', 'page', 'next', 'skip'],
				limits: [10, 20, 30, 40, 50, 100],
				jump: function (obj, first) {
					if (callback) {
						callback(obj, first);
					}
				}
			}
			plp = $.extend(true, plp, params);
			laypage.render(plp);
		},

		autoFixedHeight: function (id) {
			var elem = $('#' + id);
			var tableElem = elem.next('.layui-table-view');
			var tableId = tableElem.attr('lay-id');
			table = table || {};
			if (elem.length) {
				table.timer = table.timer || {};
				table.timer[tableId] && clearInterval(table.timer[tableId]);

				table.timer[tableId] = setInterval(function () {
					// 表头
					layui.each(tableElem.find('.layui-table-header').find('thead tr'), function (index, trElem) {
						trElem = $(trElem);
						var trFixed = tableElem.find('.layui-table-fixed thead').find('tr');
						if (trFixed.height() !== trElem.height()) {
							setTimeout(function () {
								trFixed.css('height', trElem.height() + 'px');
							}, 0);
						}
					});
					// 表格主体
					layui.each(tableElem.find('.layui-table-main').find('tbody tr'), function (index, trElem) {
						trElem = $(trElem);
						var trFixed = tableElem.find('.layui-table-fixed').find('tr[data-index="' + trElem.data('index') + '"]');
						if (trFixed.height() !== trElem.height()) {
							setTimeout(function () {
								trFixed.css('height', trElem.height() + 'px');
							}, 0);
						}
					});
					table.timer[tableId] && clearInterval(table.timer[tableId]);
				}, 5);
			} else {
				table.timer[tableId] && clearInterval(table.timer[tableId]);
			}
		},

		formatYMD: function (times) {
			var str = '';
			if (times) {
				str = times.toString().split(' ')[0];
			}
			return str;
		},

		// 获取今天
		now: function () {
			var dd = new Date();
			var y = dd.getFullYear();
			var m = dd.getMonth() + 1;
			var d = dd.getDate();
			return y + '-' + lay.digit(m) + '-' + lay.digit(d);
		},

		// 获取某天的前几天，后几天
		// nd   2017-08-08
		// AddDayCount   +7    -7
		// base.days("-7", "2017-12-01")
		days: function (AddDayCount, nd) {
			var dd = new Date(nd);
			dd.setDate(dd.getDate() + Number(AddDayCount));
			var y = dd.getFullYear();
			var m = dd.getMonth() + 1;
			var d = dd.getDate();
			return y + '-' + lay.digit(m) + '-' + lay.digit(d);
		},

		loadEditer: function (container, params) {
			var box;
			if (gather.isType(container) == 'string') {
				box = $(container);
			} else {
				box = container;
			}

			box.find('.editorBox').each(function () {
				var id = $(this).find('textarea').attr('id');
				if (!gather.loadEditFlag) {
					$.getScript('/static/js/plugin/ueditor/ueditor.config.js', function (r) {
						$.getScript('/static/js/plugin/ueditor/ueditor.all.min.js', function () {
							$.getScript('/static/js/plugin/ueditor/lang/zh-cn/zh-cn.js', function () {
								gather.loadEditFlag = 1;
								gahter.loadEditerContent(id, params);
							});
						});
					});
				} else {
					gahter.loadEditerContent(id, params);
				}
			})
		},

		loadEditerContent: function (id, params) {
			// 加try，避免IE8报错
			try {
				UE.delEditor(id);	// 打开前先销毁，否则渲染失败
			} catch (e) { }

			var ue = UE.getEditor(id, {
				//这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
				toolbars: [['fullscreen', 'Source', 'bold', 'italic', 'underline', 'forecolor', 'backcolor', 'fontborder', 'fontfamily', 'fontsize', 'Undo', 'Redo', 'Bold', 'test', '|', 'removeformat', 'formatmatch', 'autotypeset',
					'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
					'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', 'simpleupload', 'insertvideo']],
				//focus时自动清空初始化时的内容
				autoClearinitialContent: false,
				//关闭字数统计
				wordCount: false,
				//关闭elementPath
				elementPathEnabled: false,
				//超出高度出现滚动条
				autoHeightEnabled: true,
				//默认的编辑区域高度
				initialFrameHeight: params && params.height || 200,
				//更多其他参数，请参考ueditor.config.js中的配置项
				serverUrl: URL.common.editor,
				UEDITOR_HOME_URL: '/static/js/plugin/ueditor/',
				lang: "zh-cn",
				langPath: "/static/js/plugin/ueditor/lang/"
			})

			ue.ready(function () {
				if (params && params.height) {
					ue.setHeight(params.height);
				}
			});
		},

		/*
		 * params:
		 * box
		 * accept 限制文件，选填，格式如：{extensions: 'xls,xlsx',mimeTypes: 'application/vnd.ms-excel'}
		 * size 限制大小，默认100M
		 */
		uploadFiles: function (params, callback) {
			var uploading;
			var btn = params.btn ? params.btn : '#picker';
			var size = params.size ? params.size : 100 * 1024 * 1024;
			var url = params.url || URL.common.uploadImage;

			var fileUploader = WebUploader.create({
				swf: '/static/js/plugin/webuploader/Uploader.swf',		// swf文件路径
				server: url,							// 文件接收服务端。
				auto: true,
				duplicate: true,
				accept: params.accept,									//文件格式过滤
				fileSingleSizeLimit: size,    							// 单个文件最大10M
				pick: { id: btn, multiple: false },						// 选择文件的按钮
				resize: false 											//不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
			});

			// 当有文件被添加进队列的时候
			fileUploader.on('fileQueued', function (file) {
				uploading = layer.load(2, { shade: [0.5, "#fff"] });
			});

			//上传成功
			fileUploader.on('uploadSuccess', function (file, res) {
				layer.close(uploading);
				if (res.code == '000000') {
					layer.msg(global.msg.uploadSuccess);
					if (callback) {
						callback(res);
					}
				} else {
					layer.msg(global.msg.uploadFaild);
					fileUploader.removeFile(fileUploader.getFile(file.id));
				}
			});
			// fileUploader.on( 'uploadError', function( file ) {
			// 	console.log('11111111111111111111111')
			// });
			
			// fileUploader.on( 'uploadComplete', function( file ) {
			// 	console.log('22222222222222222222')
			// });
		},

		singleUpload: function (container, callback) {
			var btn;
			var box;
			if (gather.isType(container) == 'string') {
				box = $(container);
			} else {
				box = container;
			}
			btn = '#' + box.find('.addPicBox').attr('id');

			// 上传图片
			var p = {};
			p.btn = btn;
			p.url = URL.common.uploadImage;
			p.accept = {
				extensions: "jpg,jpeg,png,gif",
				mimeTypes: ".jpg,.jpeg,.png,.gif"
			};
			gather.uploadFiles(p, function (res) {
				var url = res.data;
				box.find('.prevImgs').removeClass('hidden').find('.showImg').css('background-image', 'url("'+url+'")').find('img').attr('src', url);
				box.find('.addPicBox').addClass('hidden');
				if (callback) {
					callback();
				}
			});

			// 删除图片
			$(box).off().on("click", ".delImg", function (e) {
				var obj = $(this);
				box.find('.prevImgs').addClass('hidden').find('.showImg').css('background-image', '').find('img').attr('src', '');
				box.find('.addPicBox').removeClass('hidden');
				e.stopPropagation();
			});
		},

		mutliUpload: function (container, callback) {
			var btn;
			var box;
			if (gather.isType(container) == 'string') {
				box = $(container);
			} else {
				box = container;
			}
			btn = '#' + box.find('.addPicBox').attr('id');

			// 上传图片
			var p = {};
			p.btn = btn;
			p.url = URL.common.uploadImage;
			p.accept = {
				extensions: "jpg,jpeg,png,gif",
				mimeTypes: ".jpg,.jpeg,.png,.gif"
			};
			gather.uploadFiles(p, function (res) {
				var url = res.data;
				var prev =
				  '<div class="prevImgs" draggable="true"><div class="showImg" data-url="' + url + '" style="background-image: url('+url+');"><img src="'+url+'" /></div><a href="javascript:;" class="delImg"><i class="layui-icon">&#x1006;</i></a></div>';
				$(p.btn).before(prev);
				if (callback) {
					callback();
				}
			});

			// 删除图片
			$(box).off().on("click", ".delImg", function (e) {
				var obj = $(this);
				obj.closest(".prevImgs").remove();
				e.stopPropagation();
			});
		},
		
		loadUploads: function (container, callback) {
			if (!gather.loadUploadFlag) {
				gahter.loadCss('/static/js/plugin/webuploader/css/webuploader.css');
				$.getScript('/static/js/plugin/webuploader/webuploader.js', function (r) {
					gather.loadUploadFlag = 1;
					gahter.loadUploadContent(container, callback);
				});
			} else {
				gahter.loadUploadContent(container, callback);
			}
		},

		loadUploadContent: function (container, callback) {
			var box;
			if (gather.isType(container) == 'string') {
				box = $(container);
			} else {
				box = container;
			}
			box.find('.imgList').each(function () {
				var uploadBox = $(this);
				if (uploadBox.hasClass('mutli')) {
					gather.mutliUpload(uploadBox, callback);
				} else if (uploadBox.hasClass('single')) {
					gather.singleUpload(uploadBox, callback)
				}
			});
		},
		
		loadCss: function (url) {
			$("<link>").attr({ 
				rel: "stylesheet",
				type: "text/css",
				href: url + '?_=' + Math.random()
			}).appendTo("head");
		},
		
		photos: function (params) {
			var photosId = 'photos_' + Math.floor(Math.random() * 90000) + 10000;
			var opts = {
				"title": params.title || "", //相册标题
				"id": params.id || photosId, //相册id
				"start": params.index || 0, //初始显示的图片序号，默认0
				"data": []
			};

			var arr = [];
			$.each(params.data, function (i, t) {
				var item = {};
				item.alt = t.alt || '';
				item.pid = t.pid || 'img_' + Math.floor(Math.random() * 90000) + 10000;
				item.src = t.src || '';
				item.thumb = t.thumb || '';
				arr.push(item);
			});
			opts.data = arr;

			layer.photos({
				photos: opts
				, anim: 5
			});
		}
	}

	gather = $.extend(true, gahter, layui.util);

	exports('utils', gahter);
});

var utils = layui.utils;
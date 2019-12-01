layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.id = utils.getQueryString('id');
			_t.hasLawyer = _t.id ? 1 : '';

			if (!_t.id) {
				return
			}
			utils.getSync(URL.legal.getById + _t.id, function (res) {
				_t.data = res.data || {}
			});

			_t.getTemp();
		},

		getTemp: function () {
			var _t = this;
			var html = utils.getTemp('/page/order/temp5.html', _t.data);
			$('.questions .layui-form').html(html);
			form.render();

			base.loadArea(_t);

			$('body').on('click', '.agreementBox a', function () {
				_t.showAgreement();
			})

			$('body').on('click', '.getSmsCode', function () {
				var mobile = $.trim($('.mobile').val())
				if (base.checkMobile(mobile)) {
					utils.msg('请输入正确的手机号码');
					return
				}
				if (!$(this).attr('disabled')) {
					base.timeCount('.getSmsCode', global.smsTime)
					utils.get(URL.common.getSmsCode, {phone: mobile}, function (res) {
					})
				}
			})

			form.on('submit(type3Submit)', function (res) {
				var params = res.field;
				if (!params.name) {
					utils.msg('请填写联系人')
					return
				}
				if (base.checkMobile(params.contactMobile)) {
					utils.msg('请输入正确的手机号码');
					return
				}
				if(!params.validateCode){
					utils.msg('请输入验证码');
					return;
				}
				if(!params.province || !params.city){
					utils.msg('请选择地区');
					return;
				}
				if(!params.customerRequirement){
					utils.msg('请填写我的要求');
					return;
				}
				if(!params.agreeProtocal){
					utils.msg('请确定同意虎甲平台委托服务协议');
					return;
				}
				// params.couponId = 
				params.from = 2
				params.chooseService = _t.data.id
				params.orderCategory = _t.data.serviceType
				params.token = utils.cookie(global.token)
				utils.put(URL.issue.postMandatoryLawyer, params, function (res) {
					var orderId = res.data.orderId;
					var token = res.data.token;
					utils.setCookie(global.token, token);
					window.location = 'order.html?id=' + orderId + '&type=5';
				})
			})
		},

		resetTotal: function (coupon, str) {
			var _t = this;
			var total = _t.data.price || 0;
			$('.couponInfoBox').addClass('hidden');
			$('.couponInfo').html('');
			if (coupon) {
				total -= coupon;
				$('.couponInfo').html(str);
				$('.couponInfoBox').removeClass('hidden');
			}
			$('.amount').html(total);
		},

		showAgreement: function () {
			var _t = this;
			var contents = utils.getTemp('/page/user/agreement3.html');
			var html = '<div class="agreementPage">' + contents + '</div>';

			var ops = {
				type: 1,
				area: ['1000px', '80%'],
				title: "虎甲网络科技（深圳）有限公司委托代理协议",
				content: html
			};
			utils.dialog(ops);
		},

		getCoupon: function () {
			var _t = this;
			var params = {}
			params[global.rows] = 50;
			params[global.page] = 1;
			params.noAuth = 1;
			utils.get(URL.common.coupon, params, function (res) {
				if (res.data.list && res.data.list.length) {
					utils.getSelect(res.data.list, '.coupon');
				}
			})
		},
	}

	// 点击事件
	gather.init();
});
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
			var html = utils.getTemp('/page/order/temp3.html', _t.data);
			$('.questions .layui-form').html(html);
			form.render();
			_t.resetTotal(_t.data.price);
			
			// 选择优惠券
			if (utils.cookie(global.token)) {
				var params = {}
				params[global.rows] = 1000;
				params[global.page] = 1;
				utils.get(URL.user.couponOrder, params, function (res) {
					var list = res.data || []
					_t.couponList = list;
					$.each(list, function (i, t) {
						t.name = t.couponName
					})
					utils.getSelect(list, '.coupon', '请选择优惠券')

					// 选择优惠券
					form.on('select(changeCoupon)', function (res) {
						_t.resetTotal(res.value)
					})
				});
			}

			base.loadArea(_t);

			utils.initDate('.dateIcon')

			$('.mins').on('click', function () {
				var box = $('.numsInput');
				var inputs = parseInt($.trim(box.val()));
				inputs > 1 && box.val(inputs - 1);
				box.val() == 1 && $(this).addClass('hidden');
			});

			$('.plus').on('click', function () {
				var box = $('.numsInput');
				var inputs = parseInt($.trim(box.val()));
				box.val(inputs + 1);
				box.val() > 1 && $('.mins').removeClass('hidden');
			});

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

			form.on('submit(questionSubmit)', function (res) {
				var params = res.field;
				
				if (!params.customerRequirement) {
					utils.msg('请填写我的要求')
					return
				}
				if(!params.deliveryDeadDate){
					utils.msg('请选择交付期限');
					return;
				}
				if(!params.province || !params.city){
					utils.msg('请选择地区');
					return;
				}
				if (base.checkMobile(params.contactMobile)) {
					utils.msg('请输入正确的手机号码');
					return
				}
				if(!params.validateCode){
					utils.msg('请输入验证码');
					return;
				}
				if(!params.agreeProtocal){
					utils.msg('请确定同意虎甲平台委托服务协议');
					return;
				}
				// params.couponId = 
				params.from = 2
				params.chooseService = _t.data.id
				params.orderCategory = 21
				params.token = utils.cookie(global.token)
				utils.put(URL.issue.postLegals, params, function (res) {
					var orderId = res.data.orderId;
					var token = res.data.token;
					utils.setCookie(global.token, token);
					window.location = 'order.html?id=' + orderId + '&type=3';
				})
			})
		},

		resetTotal: function (coupon) {
			var _t = this;
			var total = _t.data.price || 0;
			var obj = {};
			$.each(_t.couponList, function (i, t) {
				if (coupon == t.id) {
					obj = t;
				}
			})
			$('.couponInfoBox').addClass('hidden');
			$('.couponInfo').html('');
			if (obj.amount) {
				total -= obj.amount;
				$('.couponInfo').html(obj.amount);
				$('.couponInfoBox').removeClass('hidden');
			}
			$('.amount').html(total);
		},

		showAgreement: function () {
			var _t = this;
			var contents = utils.getTemp('/page/user/agreement2.html');
			var html = '<div class="agreementPage">' + contents + '</div>';

			var ops = {
				type: 1,
				area: ['1000px', '80%'],
				title: "虎甲平台委托服务协议",
				content: html
			};
			utils.dialog(ops);
		},
	}

	// 点击事件
	gather.init();
});
layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.id = utils.getQueryString('id');
			_t.hasLawyer = _t.id ? 1 : '';

			if (_t.id) {
				_t.getLawyerInfo()
			} else {
				_t.loadAskMoney();
			}

			_t.getQuestionType()
			base.loadArea(_t);


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
				
				if (!params.content || params.content.length < 10) {
					utils.msg('问题不能少于10个字')
					return
				}
				if(!params.questionType){
					utils.msg('请选择所属问题');
					return;
				}
				if(!params.provice || !params.city){
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
				if(!params.amount){
					utils.msg('请选择支付金额');
					return;
				}
				var proviceObj = {}
				var cityObj = {}
				$.each(_t.area, function (i, t) {
					if (t.code == params.provice) {
						proviceObj = t;
						$.each(t.city, function (i2, t2) {
							if (t2.code == params.city) {
								cityObj = t2;
							}
						})
					}
				})
				if (_t.id) {
					params.lawyerId = _t.id
				}
				params.provice = proviceObj.name
				params.city = cityObj.name
				params.from = 2
				params.orderCategory = 11
				utils.put(URL.issue.postIssue, params, function (res) {
					var orderId = res.data;
					// utils.alert('下单成功，订单号为：' + orderId)
					// console.log(res);return false;
					window.location = 'order.html?id=' + orderId + '&type=1&hasLawyer=' + _t.hasLawyer;
				})
			})
		},

		loadAskMoney: function (price) {
			utils.get(URL.common.askMoney, function (res) {
				var data = res.data;
				$.each(data, function (i, t) {
					t.id = t.code;
				})
				utils.getSelect(data, '.amount', '请选择支付金额', price)
			})
		},

		getQuestionType: function () {
			var data = base.getQuestionType()
			$.each(data, function (i, t) {
				t.id = t.code;
			})
			utils.getSelect(data, '.category', '全部');
		},

		getLawyerInfo: function () {
			var _t = this;
			utils.get(URL.lawyer.getById + _t.id, function (res) {
				var data = res.data;
      
				var score = data.score > 5 ? 5 : data.score < 0 ? 0 : data.score
				data.persent = Math.floor(score / 5 * 100)
				var html = utils.getTemp('/page/issue/lawyerInfo.html', data)
				$('.oto_form_header').html(html).removeClass('hidden');
				_t.loadAskMoney(data.price);
			})
		}
	}

	// 点击事件
	gather.init();
});
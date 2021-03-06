﻿layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.id = utils.getQueryString('id');
			_t.hasLawyer = _t.id ? 1 : '';

			if (_t.id) {
				_t.getLawyerInfo()
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
				
				if (!params.name) {
					utils.msg('请输入您的姓名')
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
				if (_t.id) {
					params.lawyerId = _t.id
				}
				params.from = 2
				params.orderCategory = 12
				params.token = utils.cookie(global.token)
				utils.put(URL.issue.postIssue, params, function (res) {
					var orderId = res.data.orderId;
					var token = res.data.token;
					utils.setCookie(global.token, token);
					// utils.alert('下单成功，订单号为：' + orderId)
					// console.log(res);return false;
					window.location = 'order.html?id=' + orderId + '&type=2&hasLawyer=' + _t.hasLawyer;
				})
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

				var price = data.price || 0;
				$('.askPrice label').html(price);
			})
		}
	}

	// 点击事件
	gather.init();
});
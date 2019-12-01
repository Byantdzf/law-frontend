﻿layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.id = utils.getQueryString('id');
			_t.ids = utils.getQueryString('ids');
			_t.ids && (_t.ids = _t.ids.split(','))

			if (!_t.id && !_t.ids) {
				return
			}
			_t.loadData();
		},

		loadData: function () {
			var _t = this;
			var data = {};
			var total = 0;
			var list = [];

			if (_t.id) {
				utils.getSync(URL.legal.getById + _t.id, function (res) {
					data = res.data;
					data.list = [{id: data.id, name: data.title}];
					_t.data = data;
				});
			} else {
				$.each(_t.ids, function (i, t) {
					utils.getSync(URL.legal.getById + t, function (res) {
						res.data.price && (total += res.data.price)
						list.push({id: res.data.id, name: res.data.title});
					});
				})
				data.price = total;
				data.list = list;
				_t.data = data;
			}

			_t.getTemp();
		},

		getTemp: function () {
			var _t = this;
			var html = utils.getTemp('/page/order/temp4.html', _t.data);
			$('.questions .layui-form').html(html);
			form.render();
			_t.resetTotal(_t.data.price);

			base.loadArea(_t);

			utils.initDate('.dateIcon')

			if ($('.serviceItem').find('a').length == 1) {
				$('.serviceItem').find('a').find('.closeItem').remove()
			}
			
			$('.closeItem').off().on('click', function () {
				$(this).closest('a').remove();
				var ids = [];
				$('.serviceItem').find('a').each(function () {
					ids.push($(this).data('id'))
				})
				_t.ids = ids;
				_t.loadData();
			})

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
			
			// 选择优惠券
			if (utils.cookie(global.token)) {
				var params = {}
				params[global.rows] = 1000;
				params[global.page] = 1;
				utils.get(URL.user.couponOrder, params, function (res) {
					var list = res.data.list || []
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
				if (_t.id) {
					params.chooseService = _t.id
				} else if (_t.ids) {
					params.chooseService = _t.ids.join(',')
				}
				params.orderCategory = 22
				params.token = utils.cookie(global.token)
				utils.put(URL.issue.postLegals, params, function (res) {
					var orderId = res.data.orderId;
					var token = res.data.token;
					utils.setCookie(global.token, token);
					window.location = 'order.html?id=' + orderId + '&type=4';
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
			var contents = ' <p> <span>法律咨询使用协议</span> </p> <p> <span>一、协议的确认和接受</span><br> &nbsp;<br> <span>欢迎光临虎甲问答法律咨询！虎甲问答法律咨询是创辉律师科技有限公司为用户提供的一个解决法律问题的平台。您应当仔细阅读本协议，在使用虎甲问答法律咨询提供的各项服务时应当同意本协议的全部内容并遵守与该项服务相关的所有规则。虎甲问答法律咨询有权随时修改本协议条款内容，并根据本协议不时发布的规则提供服务。若不同意本协议的内容或不同意虎甲问答法律咨询随时修改本协议，用户有权不使用虎甲问答法律咨询提供的服务。但是，一旦使用虎甲问答法律咨询提供的服务或者在虎甲问答法律咨询修改本协议后继续使用其服务，则视为用户完全理解和认可本协议的全部内容及其修改条款。</span><br> &nbsp;<br> &nbsp;<br> <span>二、权利声明和保护</span><br> &nbsp;<br> 1<span>、虎甲问答法律咨询对其独立咨询或委托他人咨询的信息内容，包括但不限于文字、商标、标识、版面设计、软件、声音、图片、录像、动画、图表等，享有所有权和知识产权。</span><br> &nbsp;<br> 2<span>、用户应保证对其发布的内容拥有合法授权，并保证该内容不违反任何法律法规，可以在虎甲问答法律咨询创辉律师科技有限公司内合法使用。因用户所发布的内容导致任何法律纠纷，由用户承担全部的责任，并应赔偿创辉律师科技有限公司及相关权利人由此遭受的损失。</span><br> &nbsp;<br> 3<span>、虎甲问答法律咨询不对用户发表的内容的真实性、准确性、合法性进行保证，用户发表的内容不代表虎甲问答的观点和立场。</span><br> &nbsp;<br> 4<span>、任何机构或个人对从虎甲问答法律咨询的服务中获得的信息，均应遵守该信息的权利人声明，不得擅自转载、引用及链接。未经创辉律师科技有限公司及相关权利人共同事先许可，任何机构或个人不得将虎甲问答法律咨询创辉律师科技有限公司中的任何内容用于商业、盈利目的。在不违反权利人声明的前提下用于非商业、非盈利目的时，应注明作者及出处</span>“<span>虎甲问答</span>”<span>。</span><br> &nbsp;<br> 5<span>、未经创辉律师科技有限公司同意，不得使用任何机器人、蜘蛛、其他自动设备，或手动程序来监视或复制虎甲问答法律咨询创辉律师科技有限公司网页或其所包含的任何内容。如有违反，创辉律师科技有限公司有权依法追究法律责任。</span><br> &nbsp;<br> 6<span>、对于用户发表到虎甲问答法律咨询创辉律师科技有限公司上的任何内容，用户同意虎甲问答法律咨询创辉律师科技有限公司在全世界范围内具有免费的、永久性的、不可撤销的、非独家的和完全再许可的权利和许可，以使用、复制、修改、改编、出版、翻译、据以创作衍生作品、传播、表演和展示此等内容（整体或部分），和</span>/<span>或将此等内容编入当前已知的或以后开发的其他任何形式的作品、媒体或技术中。</span><br> &nbsp;<br> <span>三、隐私保护</span><br> &nbsp;<br> <span>保护用户隐私是创辉律师科技有限公司的一项基本政策，创辉律师科技有限公司保证不对外公开或向第三方提供单个用户的注册资料及用户在使用网络服务时存储在虎甲问答法律咨询创辉律师科技有限公司中的非公开内容，但下列情况除外：</span><br> &nbsp;<br> 1<span>、事先获得用户的明确授权；</span><br> &nbsp;<br> 2<span>、根据有关的法律法规要求；</span><br> &nbsp;<br> 3<span>、按照相关政府主管部门的要求；</span><br> &nbsp;<br> 4<span>、为维护社会公众的利益；</span><br> &nbsp;<br> 5<span>、为维护虎甲问答法律咨询创辉律师科技有限公司的合法权益。</span><br> &nbsp;<br> <span>四、免责声明</span><br> &nbsp;<br> 1<span>、虎甲问答法律咨询向用户提供信息存储空间和技术服务，用户自行发布咨询内容。用户发布的内容仅代表其与相关权利人的立场和观点，与创辉律师科技有限公司无关，创辉律师科技有限公司对其不提供任何明示或暗示的担保，不能对用户发表的回答或评论的正确性进行保证，不承担任何责任。用户应自行对其使用虎甲问答法律咨询创辉律师科技有限公司服务的一切行为和后果承担全部责任。</span><br> &nbsp;<br> 2<span>、因用户注册信息不真实带来的损失，创辉律师科技有限公司不承担任何责任；创辉律师科技有限公司对用户所发布信息的删除或储存失败不承担任何责任；创辉律师科技有限公司不担保网络服务一定能满足用户的要求，也不担保网络服务不会中断，对网络服务的及时性、安全性、准确性也都不作担保。</span><br> &nbsp;<br> 3<span>、对于因电信系统或互联网网络故障、计算机故障或病毒、信息损坏或丢失、计算机系统问题或其它任何不可抗力原因而产生损失，创辉律师科技有限公司不承担任何责任，但将尽力减少因此而给用户造成的损失和影响。</span><br> &nbsp;<br> <span>五、附则</span><br> &nbsp;<br> 1<span>、本协议中的任何条款无论因何种原因完全或部分无效，该无效条款不影响本协议的其他条款的法律效力。</span><br> &nbsp;<br> 2<span>、因本协议引起的或与本协议有关的任何争议，各方应友好协商解决；协商不成的，任何一方均可将有关争议向被告住所地法院提起诉讼。</span><br> &nbsp;<br> 3<span>、创辉律师科技有限公司在法律允许的最大范围内对本协议拥有解释权与修改权。</span> </p>';
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
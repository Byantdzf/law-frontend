layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.id = utils.getQueryString('id');
			_t.type = utils.getQueryString('type');
			_t.c = utils.getQueryString('c');
			_t.hasLawyer = utils.getQueryString('hasLawyer');
			_t.success = utils.getQueryString('success');
			_t.payTitle = '支付成功';
			_t.successInfo = '';
			_t.orderInfo = {};

			var index = '';
			switch (_t.type) {
				case "1":
					index = 1;
					_t.successHtml = _t.hasLawyer ? '{{lawyer}}会在第一时间进行解答' : '系统会在第一时间给您分配律师进行解答';
					_t.returnPages = 'index.html';
					break;
				case "2":
					index = 1;
					_t.successHtml = _t.hasLawyer ? '{{lawyer}}会在第一时间进行解答' : '系统会在第一时间给您分配律师进行解答';
					_t.returnPages = 'index.html';
					break;
				case "3":
					index = 2;
					_t.successHtml = '系统会在第一时间给您分配律师进行服务';
					_t.temp = '/page/order/temp3.html';
					_t.returnPages = 'index.html';
					break;
				case "4":
					index = 3;
					_t.successHtml = '系统会在第一时间给您分配律师进行服务';
					_t.temp = '/page/order/temp4.html';
					_t.returnPages = 'index.html';
					break;
				case "5":
					index = 4;
					_t.payTitle = '提交成功';
					_t.successHtml = '客服人员会在第一时间给您跟您联系';
					_t.temp = '/page/order/temp5.html';
					_t.returnPages = 'index.html';
					break;
				case "6":
					index = 5;
					_t.successInfo = '恭喜您！您已支付成功。<a href="javascript:;" class="fontRed downloadFile">点击此处下载文件</a><br /><br />下载完成后您可在个人中心-我的法律文件中找到下载的文件。<a href="/user.html#c=order&category=4" class="fontRed">立即前往》</a><br /><br />';
					_t.temp = '/page/order/temp5.html';
					_t.returnPages = 'index.html';
					break;
			}
			if (!index) {
				return false;
			}
			$('.nav .layui-nav-item:eq(' + index + ')').addClass('layui-this').siblings().removeClass('layui-this');

			if (_t.type != 5) {
				utils.getSync(URL.user.order.getById, { orderId: _t.id }, function (res) {
					_t.orderInfo = res.data;
				});

				utils.get(URL.user.info, function (response) {
					utils.setCookie(global.userInfoToken, JSON.stringify(response.data));
				})
			}

			// if (_t.type == 3 || _t.type == 4 || _t.type == 5) {
			// 	var data = {};
			// 	if (_t.type == 3 || _t.type == 4) {
			// 		utils.getSync(URL.legal.getById + _t.id, function (res) {
			// 			data = res.data || {}
			// 		});
			// 	} else if (_t.type == 5) {

			// 	}
			// 	_t.loadTemp(data);
			// } else {
			// 	_t.gotoStepTwo();
			// }
			if (_t.success || _t.type==5) {
				_t.gotoPaySuccess();
			} else {
				_t.gotoStepTwo();
			}
		},

		loadTemp: function (data) {
			data = data || {};
			var _t = this;
			$('.orderPage').removeClass('hidden');
			var html = utils.getTemp(_t.temp, data);
			$('.orderPage .layui-form').html(html);
			form.render();
			utils.initDate('.dateIcon')

			form.on('submit(orderSubmit)', function (res) {
				var params = res.field;
				// console.log(params);return false;
				_t.gotoStepTwo();
			})

			form.on('submit(type3Submit)', function (res) {
				var params = res.field;
				_t.gotoPaySuccess();
			})

			$('body').on('click', '.serviceItem i', function () {
				var box = $(this).closest('a');
				var fonts = box.find('label').html();
				utils.confirm('确定删除“' + fonts + '”?', function (index) {
					box.remove();
					layer.close(index)
				})
			})
		},

		showAgreement: function () {
			var _t = this;
			var contents = utils.getTemp('/page/user/agreement.html');
			var html = '<div class="agreementPage">' + contents + '</div>';

			var ops = {
				type: 1,
				area: ['1000px', '80%'],
				title: "虎甲平台委托服务协议",
				content: html
			};
			utils.dialog(ops);
		},

		gotoStepTwo: function () {
			var _t = this;
			$('.orderPage').addClass('hidden');
			$('.setPay').removeClass('hidden');
			$('.setPay .amount').html(_t.orderInfo.amount)
			form.on('submit(paySubmit)', function (res) {
				var params = res.field;
				_t.gotoPay(params.payment);
			})

		},

		gotoPay: function (payment) {
			var _t = this;

			// 支付宝支付
			if (payment == 2) {
				var params = {
					orderNo: _t.orderInfo && _t.orderInfo.orderNo ? _t.orderInfo.orderNo : '',
					fee: _t.orderInfo.amount,
					subject: '咨询费',
					returnUrl: window.location.href + '&success=1'
				};

				utils.confirm(
					'支付完成前，请不要关闭此支付验证窗口。<br />支付完成后，请根据您支付的情况点击下面按钮。',
					{ 
						title: '网上支付提示',
						success: function () {
							window.open(URL.common.alipay + '?' + $.param(params));
						}
					},
					// yes
					function (index) {
						layer.close(index);
						_t.gotoPaySuccess();
					}
				)
			} else {
				var ops = {
					type: 1,
					area: ['450px', '450px'],
					title: '微信支付',
					content: '<div class="wechatPayQrCode"><div class="imgBox"></div><p>打开微信扫一扫支付订单</p></div>',
					success: function (layero, index) {
						var orderNo = _t.orderInfo && _t.orderInfo.orderNo ? _t.orderInfo.orderNo : ''
						var fee = _t.orderInfo && _t.orderInfo.amount ? _t.orderInfo.amount : ''
						if (orderNo) {
							var params = {
								orderNo: orderNo,
								fee: fee
							};
							utils.get(URL.common.wechatPay, params, function (res) {
								var url = res.data.codeUrl;
								if (url) {
									$.getScript('/static/js/plugin/jquery.qrcode.min.js', function () {
										$('.wechatPayQrCode .imgBox').qrcode(url);

										var timer = null;
										timer = window.setInterval(function () {
											utils.get(URL.common.wechatPayResult, {orderNo: orderNo}, function (res) {
												if (res.code == '000000') {
													var code = res.data.trade_state
													if (code == 'SUCCESS') {
														layer.close(index)
														window.clearInterval(timer);
														_t.gotoPaySuccess();
													}
												}
											});
										}, 1000);
									})
								} else {
									utils.msg('此订单不能使用微信支付')
									layer.close(index);
								}
							});
						}
					}
				};
				utils.dialog(ops);
			}

			// utils.msg('支付中...');
			// setTimeout(function () {
			// 	utils.msg('支付完成');
			// 	_t.gotoPaySuccess();
			// }, 1000);
		},

		downloadFiles: function (data) {
			utils.get(URL.user.order.getFilesInfo, {orderId: data.id}, function (res) {
				var files = res.data[0].filePath
				if (files) {
					window.open(URL.user.downloadFiles + '?filePath=' + files);
				} else {
					utils.alert('文件不存在');
				}
			})
		},

		gotoPaySuccess: function () {
			var _t = this;
			$('.setPay, .orderPage, .paySuccessQr img').addClass('hidden');
			utils.getSync(URL.user.order.getById, { orderId: _t.id }, function (res) {
				var orderNo = res.data.orderNo;
				if (res.data.orderStatus == 10 && _t.type != 5) {
					window.location.reload()
				} else {
					var lawyer = res.data.lawyer || '';
					_t.successHtml = _t.successHtml && _t.successHtml.replace('{{lawyer}}', lawyer)
					$('.paySuccess').removeClass('hidden').find('.lawyerHtml').html(_t.successHtml);
					$('.payTit label').html(_t.payTitle);
					if (_t.successInfo) {
						$('.successInfo').html(_t.successInfo);
					}
					$('.successInfo').removeClass('hidden');

					$('.downloadFile').off().on('click', function () {
						_t.downloadFiles(res.data);
					});
					
					utils.get(URL.common.orderQr, {orderNo: orderNo}, function (res) {
						var url = res.data;
						if (url) {
							$('.paySuccessQr img').removeClass('hidden').attr('src', url);
						} else {
							utils.msg('二维码生成失败')
						}
					});

					form.on('submit(returnFirst)', function (res) {
						var params = res.field;
						if (_t.c == 'u') {
							window.location = '/user.html#c=order'
						} else {
							window.location = _t.returnPages;
						}
					})
				}
			});
		}
	}

	// 点击事件
	gather.init();
});
layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.id = utils.getQueryString('id')

			_t.getData();
		},

		getData: function () {
			var _t = this;
			utils.get(URL.lawyerObj.order.getById, { orderId: _t.id }, function (res) {
				var data = res.data;

				var type = data.orderType;
				var category = data.orderCategory;
				var temp = '';
				if (type) {
					if (type == 1) {
						if (category == 11) {
							temp = '/lawyer/order/orderDetailVoice.html';
						} else if (category == 12) {
							temp = '/lawyer/order/orderDetailOneByOne.html';
						}
					} else if (type == 2) {
						temp = '/lawyer/order/orderDetailLegalSevices.html';
					} else if (type == 3) {
						temp = '/lawyer/order/orderDetailLawyer.html';
					} else if (type == 4) {
						temp = '/lawyer/order/orderDetailTemplate.html';
					}
				}

				$.each(global.rs.orderStatus, function (i, t) {
					if (t.id == data.orderStatus) {
						data.statusName = t.name;
					}
				})
				$.each(global.rs.orderType, function (i, t) {
					if (t.id == data.orderType) {
						data.typeName = t.name;
					}
				})
				$.each(global.rs.orderCategory, function (i, t) {
					if (t.id == data.orderCategory) {
						data.categoryName = t.name;
					}
				})
				$.each(global.rs.orderSource, function (i, t) {
					if (t.id == data.orderSource) {
						data.sourceName = t.name;
					}
				})
				var questionType = base.getQuestionType();
				$.each(questionType, function (i, t) {
					if (t.code == data.questionType) {
						data.questionTypeName = t.name;
					}
				})

				console.log(type)
				data.news = {};
				if (type == 3 || type == 2) {
					utils.getSync(URL.legal.getById + data.chooseService, function (res) {
						data.news = res.data || {};
					});
				}

				var html = utils.getTemp(temp, data);
				$('.orderDetails').html(html);

				if (data.orderStatus != 10 && data.orderStatus != 20) {
					_t.queryReply(data.id)
				}

				if ($('.uploadFiles').length) {
					_t.initUpload('.uploadFiles');
				}

				if ($('.uploadMp3Btn').length) {
					_t.initUploadMp3('.uploadMp3Btn');
				}

				// 获取评论
				var params = {}
				params[global.rows] = 10;
				params[global.page] = 1;
				params.orderId = data.id;
				utils.get(URL.lawyerObj.order.getComments, params, function (res) {
					var data = res.data.list[0]
					if (data) {
						let professionalAttitudeScore = data.professionalAttitudeScore > 5 ? 5 : data.professionalAttitudeScore < 0 ? 0 : data.professionalAttitudeScore
						let serviceAttitudeScore = data.serviceAttitudeScore > 5 ? 5 : data.serviceAttitudeScore < 0 ? 0 : data.serviceAttitudeScore
						data.score1 = Math.floor(professionalAttitudeScore / 5 * 100)
						data.score2 = Math.floor(serviceAttitudeScore / 5 * 100)
						var html = utils.getTemp('/page/user/orderMyComment.html', data)
						$('.myComment').removeClass('hidden').find('.layui-input-block').html(html);
					}
				})

				// 回复语音咨询提交
				$('.replyVoiceSubmit').off().on('click', function () {
					var mp3 = $('.uploadedUrl').length ? $('.uploadedUrl').attr('href') : ''
					var val = $.trim($('.content').val())
					if (!mp3) {
						if (!val) {
							utils.msg('请输入回复内容');
							return
						}
						if (val.length < 30 || val.length > 300) {
							utils.msg('回复内容长度为30字～300字');
							return
						}
					}
					var params = {
						orderId: data.id,
						curOrderStatus: data.orderStatus,
						operateType: 2,
						msgType: 1,
						content: val,
						sentTime: utils.nowTime()
					}
					if (mp3) {
						params.filePath = mp3;
						params.msgType = 2;
					}
					utils.confirm('确认回复并发送订单确认？', function () {
						utils.postJson(URL.lawyerObj.order.reply, params, function (res) {
							utils.msg('回复成功')
							_t.getData();
						})
					})
				})

				// 回复一对一咨询提交
				$('.replyOneByOneSubmit').off().on('click', function () {
					var params = {
						orderId: data.id,
						curOrderStatus: data.orderStatus,
						operateType: 2,
						msgType: 7,
						sentTime: utils.nowTime()
					}
					utils.confirm('确认发送订单确认？', function () {
						utils.postJson(URL.lawyerObj.order.reply, params, function (res) {
							utils.msg('回复成功')
							_t.getData();
						})
					})
				})

				// 非诉讼法律服务/诉讼法律服务咨询提交
				$('.legalSevicesSubmit').off().on('click', function () {
					var list = $('.fileList').find('span').length;
					if (list < 1) {
						utils.msg('请上传文件');
						return
					}
					var attachmentList = [];
					$('.fileList').find('span').each(function () {
						var item = {};
						item.fileType = 4;
						item.filePath = $(this).find('a').attr('href');
						attachmentList.push(item);
					});
					var params = {
						orderId: data.id,
						curOrderStatus: data.orderStatus,
						operateType: 2,
						attachmentList: attachmentList
					}
					utils.postJson(URL.lawyerObj.order.replyFiles, params, function (res) {
						utils.msg('回复成功')
						_t.getData();
					})
				})

				// 非诉讼法律服务/诉讼法律服务咨询提交
				$('.lawyerSubmit').off().on('click', function () {
					var list = $('.fileList').find('span').length;
					if (list < 1) {
						utils.msg('请上传文件');
						return
					}
					var attachmentList = [];
					$('.fileList').find('span').each(function () {
						var item = {};
						item.fileType = 4;
						item.filePath = $(this).find('a').attr('href');
						attachmentList.push(item);
					});
					var params = {
						orderId: data.id,
						curOrderStatus: data.orderStatus,
						operateType: 2,
						attachmentList: attachmentList
					}
					utils.postJson(URL.lawyerObj.order.replyFiles, params, function (res) {
						utils.msg('回复成功')
						_t.getData();
					})
				})

				// 确认订单
				$('.finishOrder').off().on('click', function () {
					utils.get(URL.lawyerObj.order.confirm + data.id, function (res) {
						utils.msg('操作成功')
						layer.close(index);
						_t.showCommentBox(data)
						_t.queryList(_t.currPage)
					})
				})

				// 评价订单
				$('.commentOrder').off().on('click', function () {
					_t.showCommentBox(data);
				})
			});
		},

		queryReply: function (orderId) {
			var _t = this;
			var qlps = {
				url: URL.lawyerObj.order.replyList,
				searchData: { orderId: orderId },
				box: '.replyList',
				temp: '/page/user/orderReplyList.html'
			}
			qlps[global.rows] = 100;
			utils.queryTempList(qlps, function (curr, obj) {
				if (obj.totalRow > 0) {
					$(qlps.box).removeClass('hidden');
					setTimeout(function () {
						if (obj.totalRow > 10) {
							$(qlps.box).find('.app-page-box').removeClass('hidden')
						} else {
							$(qlps.box).find('.app-page-box').addClass('hidden')
						}
					}, 0)
				} else {
					$(qlps.box).addClass('hidden');
				}

				$('.downloadFiles').off().on('click', function () {
					var url = $(this).data('url');
					window.open(url);
				})
			});

			$('.replyList').off().on('click', '.soundPlay', function () {
				if ($(this).hasClass('playing')) {
					$(this).removeClass('playing');
					$('#audio').remove();
				} else {
					$(this).addClass('playing');
					var url = $(this).data('url');
					base.playAudio(url);
				}
			})

			$('.replyList').on('click', '.petition', function () {
				_t.orderPetition(orderId);
			})
		},

		// 初始化图片上传功能
		initUpload: function (btn) {
			// 上传图片
			var p = {};
			p.btn = btn;
			utils.uploadFiles(p, function (res) {
				var url = res.data;
				$('.fileList').removeClass('hidden')
				$('.fileList>div').append('<span><a href="' + url + '" target="_blank"><i class="iconfont icon-wenjian"></i></a><i class="iconfont icon-close del"></i></span>');

				$('.fileList .del').off().on('click', function () {
					$(this).closest('span').remove();
					if (!$('.fileList>div').find('span').length) {
						$('.fileList').addClass('hidden')
					}
				});
			});
		},

		// 初始化图片上传功能
		initUploadMp3: function (btn) {
			// 上传图片
			var p = {};
			p.btn = btn;
			p.accept = {
				extensions: 'mp3',
				mimeTypes: '.mp3'
			};
			utils.uploadFiles(p, function (res) {
				var url = res.data;
				$('.uploadMp3Files').html('<a class="uploadedUrl" href="' + url + '" target="_blank"><img src="/static/images/mp3.jpg" /></a><i class="iconfont icon-close"></i>');
				$('.uploadMp3Btn').addClass('hidden');

				$('.icon-close').off().on('click', function (e) {
					$(this).closest('.uploadMp3Files').html('');
					$('.uploadMp3Btn').removeClass('hidden');
					e.stopPropagation()
				})
			});
		},
	}

	// 点击事件
	gather.init();
});
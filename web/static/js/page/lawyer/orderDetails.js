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
				var html = utils.getTemp(temp, data);
				$('.orderDetails').html(html);
				
				if (data.orderStatus != 10 && data.orderStatus != 20) {
					_t.queryReply(data.id)
				}

				if ($('.uploadFiles').length) {
					_t.initUpload('.uploadFiles');
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

				// 取消订单
				$('.cancelOrder').off().on('click', function () {
					utils.confirm('系统正在积极为您指派律师，您确定要取消订单？', function (i) {
						layer.close(i);
						layer.close(index);
						utils.get(URL.lawyerObj.order.cancel, { orderId: data.id }, function (res) {
							utils.msg('取消成功');
							_t.queryList(_t.currPage);
						})
					})
				})

				// 回复提交
				$('.askAgainBtn').off().on('click', function () {
					var val = $.trim($('.askAgainContent').val())
					if (!val) {
						utils.msg('请输入回复内容');
						return
					}
					if (val.length < 30 || val.length > 300) {
						utils.msg('回复内容长度为30字～300字');
						return
					}
					var params = {
						orderId: data.id,
						curOrderStatus: data.orderStatus,
						operateType: 2,
						msgType: 1,
						content: val
					}
					utils.postJson(URL.lawyerObj.order.reply, params, function (res) {
						utils.msg('回复成功')
						_t.loadOrderDetails(item)
					})
				})

				// 上传文件提交
				$('.legalSevicesSubmit').off().on('click', function () {
					var list = $('.fileList a').length;
					if (list.length < 1) {
						utils.msg('请上传文件');
						return
					}
					var attachmentList = [];
					$('.fileList a').each(function () {
						var item = {};
						item.fileType = 4;
						item.filePath = $(this).data('url');
					});
					var params = {
						orderId: data.id,
						curOrderStatus: data.orderStatus,
						operateType: 2,
						attachmentList: attachmentList
					}
					utils.postJson(URL.lawyerObj.order.replyFiles, params, function (res) {
						utils.msg('回复成功')
						_t.loadOrderDetails(item)
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
				var url = $(this).data('url');
				base.playAudio(url);
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
			p.accept = {
				extensions: 'doc,docx,pdf',
				mimeTypes: '.doc,.docx,.pdf'
			};
			utils.uploadFiles(p, function(res) {
				var url = res.data;
				$('.fileList').append('<a href="javascript:;" data-url="'+url+'"><i class="iconfont icon-wenjian"></i><i class="iconfont icon-close del"></i></a>');
				$('.fileList').find('.del').off().on('click', function () {
					$(this).closest('a').remove();
				});
			});
		},
	}

	// 点击事件
	gather.init();
});
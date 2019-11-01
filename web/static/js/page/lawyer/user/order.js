layui.define(function (exports) {

	var normalTableParams = [
		[
			{title: "序号", type: "numbers"},
			{title: "订单编号", field: "orderNo"},
			{title: "订单时间", field: "createTime", width:"150"}, 
			{title: "订单来源", field: "orderSource", width:"100", rs: global.rs.orderSource}, 
			{title: "订单类型", field: "orderType", width:"130", rs: global.rs.orderType}, 
			{title: "订单种类", field: "orderCategory", width:"110", rs: global.rs.orderCategory}, 
			{title: "状态", field: "orderStatus", width:"100", rs: global.rs.orderStatus}, 
			{title: "金额", field: "amount", width:"80"}, 
			{
				title: "操作",
				width: "80",
				actions: [
					{ "id": "view", "name": global.btn.viewBtn },
				]
			}
		]
	];

	var filesTableParams = [
		[
			{ title: "序号", type: "numbers" },
			{ title: "订单编号", field: "orderNo" },
			{ title: "订单类型", field: "orderType", width: "150", rs: global.rs.orderType },
			{ title: "订单状态", field: "orderStatus", width: "100", rs: global.rs.orderStatus },
			{ title: "订单金额", field: "amount", width: "100" },
			{ title: "文件类型", field: "fileType", width: "100" },
			{
				title: "操作",
				width: "110",
				actions: [
					{ "id": "view", "name": global.btn.viewBtn },
					{ "id": "download", "name": global.btn.downloadBtn, type: "warm" },
					// { "id": "download", "name": global.btn.downloadBtn, type: "warm", "filter": "orderStatus", "filterVal": "60"},
				]
			}
		]
	];

	var gather = {
		init: function () {
			var _t = this;
			_t.tableParams = $.extend(true, [], normalTableParams);

			_t.rootCategory = [
				{ "id": 1, "name": "咨询订单", "child": [{ "id": 11, "name": "在线律师咨询" }, { "id": 12, "name": "指定律师咨询" }] },
				{ "id": 2, "name": "分块法律服务订单", "child": [{ "id": 21, "name": "日常法律服务" }, { "id": 22, "name": "分块法律服务" }] },
				{ "id": 3, "name": "代理律师服务订单", "child": [{ "id": 31, "name": "收费代理" }, { "id": 32, "name": "风险代理" }] }
			]
			_t.source = global.rs.orderSource;

			_t.loadPage();
		},

		loadPage: function () {
			var _t = this;
			var data = {};
			var html = utils.getTemp('/page/lawyer/user/order.html', data);
			$('.userPageCon').html(html);

			utils.getSelect(_t.rootCategory, '.rootCategory', global.text.all);
			utils.getSelect(_t.source, '.source', global.text.all);

			var orderStatus = $.extend(true, [], global.rs.orderStatus);

			orderStatus.unshift({ id: '', name: '全部' });
			
			var ips = {
				filters: orderStatus,
				field: "orderStatus"
			};
			utils.initPage(ips, '.orderList');

			_t.queryList();

			_t.actions();
		},

		queryList: function (page) {
			var _t = this;
			var qlps = {
				box: '.orderList',
				url: URL.lawyerObj.order.query,
				searchData: utils.formData('.orderSearchBox'),
				page: page,
				cols: _t.tableParams
			}
			utils.queryList(qlps, function (curr, tr, item) {
				_t.currPage = curr
			});
		},

		viewBox: function (item) {
			var _t = this;

				var ops = {
					type: 1,
					area: ['1000px', '80%'],
					title: "订单详情",
					scrollbar: false,
					content: '<div class="orderDetailBox"></div>',
					success: function (layero, index) {
						_t.loadOrderDetails(item)
					}
				};
				utils.dialog(ops);
		},

		loadOrderDetails: function (item) {
			var _t = this;
			var type = item.orderType;
			var category = item.orderCategory;
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
			utils.get(URL.lawyerObj.order.getById, { orderId: item.id }, function (res) {
				var data = res.data;
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
				$('.orderDetailBox').html(html);
				
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
				$('.fileList').append('<a href="javascript:;" data-url="'+url+'"><img src="/static/images/word.png"><i class="iconfont icon-close del"></i></a>');
				$('.fileList').find('.del').off().on('click', function () {
					$(this).closest('a').remove();
				});
			});
		},

		actions: function () {
			var _t = this;

			form.on('select(rootCategory)', function (e) {
				var item = {};
				$.each(_t.rootCategory, function (i, t) {
					t.id == e.value && (item = t);
				});

				if (e.value == 4) {
					_t.tableParams = $.extend(true, [], filesTableParams);
				} else {
					_t.tableParams = $.extend(true, [], normalTableParams);
				}

				if (item.child && item.child.length > 0) {
					utils.getSelect(item.child, '.childCategory', global.text.all);
					$('.orderSearchBox .child').removeClass('hidden');
				} else {
					$('.orderSearchBox .child').addClass('hidden');
				}
				// 更改筛选
				// $('.app-table-tab li:eq(0)').click();
				$('.app-table-tab').find('li').removeClass('layui-this')
				$('.app-table-tab li:eq(0)').addClass('layui-this')
				element.render();
				_t.queryList();
			});
			
			form.on('select(childCategory)', function (e) {
				_t.queryList();
			})
			form.on('select(source)', function (e) {
				_t.queryList();
			})

			$('body').off().on('click', '.actions button', function () {
				var type = $(this).attr('data-type');
				var data = $(this).closest('.layui-table-box').find('tbody tr:eq(' + $(this).closest('tr').index() + ')')[0].data || {};
				switch (type) {
					case "view":
						_t.viewBox(data);
						break;
					case "download":
						_t.downloadFiles(data);
						break;
				}
			});
		},
	}

	// 点击事件
	gather.init();
});
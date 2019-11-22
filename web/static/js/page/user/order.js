layui.define(function (exports) {

	var normalTableParams = [
		[
			{ title: "序号", type: "numbers" },
			{ title: "订单编号", field: "orderNo" },
			{ title: "订单时间", field: "createTime", width: "180" },
			{ title: "订单类型", field: "orderType", width: "150", rs: global.rs.orderType },
			{ title: "订单种类", field: "orderCategory", width: "130", rs: global.rs.orderCategory },
			{ title: "订单状态", field: "orderStatus", width: "100", rs: global.rs.orderStatus },
			{ title: "订单金额", field: "amount", width: "100" },
			{
				title: "操作",
				width: "80",
				actions: [
					{ "id": "view", "name": global.btn.viewDetailsBtn }
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
				{ "id": 3, "name": "代理律师服务订单", "child": [{ "id": 31, "name": "收费代理" }, { "id": 32, "name": "风险代理" }] },
				{ "id": 4, "name": "法律文件订单", "child": [] }
			]
			_t.loadPage();
		},

		loadPage: function () {
			var _t = this;
			var data = {};
			var html = utils.getTemp('/page/user/order.html', data);
			$('.userPageCon').html(html);

			utils.getSelect(_t.rootCategory, '.rootCategory', global.text.all);

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
			var searchData = utils.formData('.orderSearchBox');
			searchData.onlyUserOwner = 'Y';
			var qlps = {
				box: '.orderList',
				url: URL.user.order.query,
				searchData: searchData,
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
						_t.loadOrderDetails(item, index)
					}
				};
				utils.dialog(ops);
		},

		loadOrderDetails: function (item, index) {
			var _t = this;
			var type = item.orderType;
			var category = item.orderCategory;
			var temp = '';
			if (type) {
				if (type == 1) {
					if (category == 11) {
						temp = '/page/user/orderDetailVoice.html';
					} else if (category == 12) {
						temp = '/page/user/orderDetailOneByOne.html';
					}
				} else if (type == 2) {
					temp = '/page/user/orderDetailLegalSevices.html';
				} else if (type == 3) {
					temp = '/page/user/orderDetailLawyer.html';
				} else if (type == 4) {
					temp = '/page/user/orderDetailTemplate.html';
				}
			}
			utils.get(URL.user.order.getById, { orderId: item.id }, function (res) {
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

				// 获取评论
				var params = {}
				params[global.rows] = 10;
				params[global.page] = 1;
				params.orderId = data.id;
				utils.get(URL.user.order.getComments, params, function (res) {
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
						utils.get(URL.user.order.cancel, { orderId: data.id }, function (res) {
							utils.msg('取消成功');
							_t.queryList(_t.currPage);
						})
					})
				})

				// 支付订单
				$('.payOrder').off().on('click', function () {
					var type = data.orderType;
					var category = data.orderCategory;
					var urlType = '';
					if (type) {
						if (type == 1) {
							if (category == 11) {
								urlType = 1
							} else if (category == 12) {
								urlType = 2
							}
						} else if (type == 2) {
							if (category == 21) {
								urlType = 3
							} else if (category == 22) {
								urlType = 4
							}
						} else if (type == 3) {
							urlType = 5
						} else if (type == 4) {
							urlType = 6
						}
					}
					window.location = '/order.html?id=' + data.id + '&type=' + urlType + '&c=u'
				})

				// 追问
				$('.isAskAgain').off().on('click', function () {
					$('.askAgain').removeClass('hidden')
				})

				// 追问提交
				$('.askAgainBtn').off().on('click', function () {
					var val = $.trim($('.askAgainContent').val())
					if (!val) {
						utils.msg('请输入追问内容');
						return
					}
					utils.post(URL.user.order.askAgain + data.id, { content: val }, function (res) {
						var box = $('.askAgainContent').parent();
						box.html('<div class="layui-form-mid">' + val + '</div>');
						$('.askAgainBtn').parent().addClass('hidden').remove();
					})
				})

				// 确认订单
				$('.finishOrder').off().on('click', function () {
					utils.get(URL.user.order.confirm + data.id, function (res) {
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

		showCommentBox: function (data) {
			var _t = this;
			var html = utils.getTemp('/page/user/orderComment.html', data);
			var ops = {
				type: 1,
				area: '600px',
				title: "给他评价",
				scrollbar: false,
				content: html,
				success: function (layero, index) {
					$('.starBox').off().on('click', 'span', function () {
						var index = $(this).index();
						$(this).closest('.starBox').find('span').each(function () {
							$(this).removeClass('on');
							if ($(this).index() <= index) {
								$(this).addClass('on');
							}
						})
					});

					form.on('submit(commentSubmit)', function (res) {
						var professionalAttitudeScore = $('.professionalAttitudeScore').find('.on').length
						var serviceAttitudeScore = $('.serviceAttitudeScore').find('.on').length
						var content = $.trim($('.content').val())

						if (!professionalAttitudeScore || professionalAttitudeScore < 1) {
							layer.msg('请给律师专业态度评分')
							return
						}
						if (!professionalAttitudeScore || professionalAttitudeScore < 1) {
							layer.msg('请给律师服务态度评分')
							return
						}
						console.log(professionalAttitudeScore)
						if (!content) {
							layer.msg('请填写评论内容')
							return
						}
						var params = {
							professionalAttitudeScore: professionalAttitudeScore,
							serviceAttitudeScore: serviceAttitudeScore,
							content: content
						};
						utils.post(URL.user.order.comment + data.id, params, function () {
							layer.msg('评论成功')
							layer.close(index);
							_t.loadOrderDetails(data);
						})
					});
				}
			}
			utils.dialog(ops);
		},

		queryReply: function (orderId) {
			var _t = this;
			var qlps = {
				url: URL.user.order.reply,
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

		orderPetition: function (orderId) {
			var html = utils.getTemp('/page/user/orderPetition.html');
			var ops = {
				type: 1,
				area: '600px',
				title: "订单申诉",
				content: html,
				success: function (layero, index) {
					var arr = [
						{ id: 1, name: "言语辱骂" },
						{ id: 2, name: "答非所问" },
						{ id: 3, name: "其他" }
					]
					utils.getRadio(arr, '.chooseType')

					form.on('submit(feedbackSubmit)', function (res) {
						var params = res.field

						var ids = []
						$('.chooseType').find('input[type="radio"]:checked').each(function () {
							ids.push($(this).val())
						})
						if (!ids.length) {
							utils.msg('请选择申诉类型')
							return false
						}
						params.appealType = ids.join(',')

						utils.post(URL.user.order.petition + orderId, params, function (res) {
							utils.alert('申诉成功');
							layer.close(index);
						})
					})
				}
			};
			utils.dialog(ops);
		},

		downloadFiles: function (data) {
			var files = data.chooseService
			window.open(URL.user.downloadFiles + '?filePath=https://hujia.obs.cn-south-1.myhuaweicloud.com:443/law/1574432582369sonar.docx');
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
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
			_t.tableParams = normalTableParams;
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

			var orderStatus = global.rs.orderStatus;
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
				url: URL.user.order.query,
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
			if (temp) {
				utils.get(URL.user.order.getById, {orderId: item.id}, function (res) {
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
					var html = utils.getTemp(temp, data);
					var ops = {
						type: 1,
						area: ['1000px', '80%'],
						title: "订单详情",
						scrollbar: false,
						content: html,
						success: function (layero, index) {
							if (data.orderStatus == 30) {
								_t.queryReply(data.id)
							}

							// 取消订单
							$('.cancelOrder').off().on('click', function () {
								utils.confirm('系统正在积极为您指派律师，您确定要取消订单？', function (i) {
									layer.close(i);
									layer.close(index);
									utils.get(URL.user.order.cancel, {orderId: data.id}, function (res) {
										utils.msg('取消成功');
										_t.queryList(_t.currPage);
									})
								})
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
								utils.post(URL.user.order.askAgain + data.id, {content: val}, function (res) {
									var box = $('.askAgainContent').parent();
									box.html('<div class="layui-form-mid">' + val + '</div>');
									$('.askAgainBtn').parent().addClass('hidden').remove();
								})
							})

							// 确认订单
							$('.finishOrder').off().on('click', function () {
								utils.put(URL.user.order.confirm + data.id, function (res) {
									console.log(res)
								})
							})
							
						}
					};
					utils.dialog(ops);
				});
			}
		},

		queryReply: function (orderId) {
			var _t = this;
			var qlps = {
				url: URL.user.order.reply,
				searchData: {orderId: orderId},
				box: '.replyList',
				temp: '/page/user/orderReplyList.html'
			}
			utils.queryTempList(qlps, function (curr, obj) {
				setTimeout(function () {
					if (obj.totalRow > 10) {
						$(qlps.box).find('.app-page-box').removeClass('hidden')
					} else {
						$(qlps.box).find('.app-page-box').addClass('hidden')
					}
				}, 0)
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
						{id: 1, name: "言语辱骂"},
						{id: 2, name: "答非所问"},
						{id: 3, name: "其他"}
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
			var id = data.chooseService
			if (id) {
				utils.get(URL.template.details + id, function (res) {
					utils.get(URL.template.downloadUrl, {targetName: res.data.filePath}, function (response) {
						window.open(response.data)
					})
				})
			} else {
				utils.alert('文件不存在')
			}
		},

		actions: function () {
			var _t = this;

			form.on('select(rootCategory)', function (e) {
				var item = {};
				$.each(_t.rootCategory, function (i, t) {
					t.id == e.value && (item = t);
				});

				if (e.value == 4) {
					_t.tableParams = filesTableParams;
				} else {
					_t.tableParams = normalTableParams;
				}

				if (item.child && item.child.length > 0) {
					utils.getSelect(item.child, '.childCategory', global.text.all);
					$('.orderSearchBox .child').removeClass('hidden');
				} else {
					$('.orderSearchBox .child').addClass('hidden');
				}
				// 更改筛选
				$('.app-table-tab li:eq(0)').click();
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
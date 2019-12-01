layui.define(function (exports) {

	var tableParams = [
		[
			{title: "全选", type: "checkbox", field: "id", width: "50"},
			{title: "订单ID", field: "id",}, 
			{title: "订单类型", field: "orderType", rs: global.rs.orderType}, 
			{title: "订单种类", field: "orderCategory", rs: global.rs.orderCategory}, 
			{title: "发布时间", field: "orderTime"}, 
			{title: "订单金额", field: "amount"}, 
		]
	];

	var gather = {
		init: function () {
			var _t = this;
			_t.id = utils.getQueryString('id');
			_t.ids = [];

			_t.getData();

			_t.getBanner();

			_t.getLawyerList();
		},

		getBanner: function () {
			var params = {
				terminal: 1,
				location: 2,
			};
			utils.get(URL.common.ad, params, function (res) {
				if (res.data && res.data.length) {
					var list = res.data[0] || {};
					var url = list.url || 'javascript:;';
					var html = '<a href="' + url + '"><img src="' + list.coverPhoto + '" alt=""></a>';
					$('.lawyerAd').html(html);
				}
			});
		},

		getData: function () {
			var _t = this;
			utils.get(URL.lawyer.getById + _t.id, function (res) {
				var data = res.data;
      
				var score = data.score > 5 ? 5 : data.score < 0 ? 0 : data.score
				data.persent = Math.floor(score / 5 * 100)

				_t.getLawyerInfo(data);
				_t.getLawyerData();
			});
		},

		getLawyerInfo: function (data) {
			var _t = this;
			var html = utils.getTemp('/page/lawyer/temp/lawyerInfo.html', data)
			$('.lawyerInfo').html(html);

			// 关注
			$('.collect').off().on('click', function () {
				if (utils.cookie(global.token)) {
					var params = {
					  businessId: _t.id,
					  operateBusiness: 2,  // 操作对象1-订单 2-律师 3-文章 4-系统
					  operateType: 4,      // 1-阅读 2-转发 3-点赞 4-关注 10-取消阅读 20-取消转发 30-取消点赞 40-取消关注
					}
					utils.get(URL.user.cancelattention, params, function () {
						utils.msg('操作成功');
						_t.getData();
					})
				} else {
					utils.confirm('登录以后才可以操作，是否登录？', function () {
						base.wxLogin(function (data) {
							window.location.reload();
						})
					})
				}
			})
			// 取消关注
			$('.cancelCollect').off().on('click', function () {
				var params = {
				  businessId: _t.id,
				  operateBusiness: 2,  // 操作对象1-订单 2-律师 3-文章 4-系统
				  operateType: 40,      // 1-阅读 2-转发 3-点赞 4-关注 10-取消阅读 20-取消转发 30-取消点赞 40-取消关注
				}
				utils.get(URL.user.cancelattention, params, function () {
					utils.msg('操作成功');
					_t.getData();
				})
			})

			$('.askHim').off().on('click', function () {
				if (utils.cookie(global.token)) {
					var ops = {
						type: 1,
						title: '订单列表',
						area: ['1000px', '650px'],
						shadeClose: true,
						content: '<div class="myList"></div><div class="chooseBox"><div class="clearfix"><div class="selectOrderNums">已选:<em>0</em>个订单</div><div class="btnBox"><a href="javascript:;" class="layui-btn layui-btn-sm submitSelect">发送邀请</a></div></div></div>',
						success: function (layero, index) {
							
							_t.box = '.myList';
					
							var ips = {
							};
							utils.initPage(ips, _t.box);
		
							_t.queryOrderList();
	
							form.on('checkbox(layTableAllChoose)', function (e) {
								var elem = e.elem;
								var checked = elem.checked;
								$(elem).closest('.layui-table-box').find('.layui-table-body').find('tr').each(function () {
									var data = this.data;
									if (data.choosed != 1) {
										$(this).find('input[type="checkbox"]').each(function () {
											this.checked = checked
										})
									}
								})
								form.render('checkbox');
								_t.setChoose()
							})
	
							$('.submitSelect').off().on('click', function () {
								if (!_t.ids.length) {
									utils.msg('请选择要指定的订单');
									return false;
								}
								var params = {};
								params.orderId = _t.ids.join(',');
								params.lawyerId = _t.id;
								utils.get(URL.user.pointLawyer, params, function (res) {
									utils.msg('指定成功');
									layer.close(index);
								});
							})
						}
					};
					utils.dialog(ops);
				} else {
					utils.confirm('登录以后才可以操作，是否登录？', function () {
						base.wxLogin(function (data) {
							window.location.reload();
						})
					})
				}
			})
		},

		setChoose: function () {
			var _t = this;
			$('.myList').find('.layui-table-body').find('input[type="checkbox"]').each(function () {
				var id = $(this).closest('tr').data('id').toString()
				var checked = this.checked;
				if (checked) {
					if ($.inArray(id, _t.ids) == -1) {
						_t.ids.push(id)
					}
				} else {
					if ($.inArray(id, _t.ids) != -1) {
						var newArr = []
						$.each(_t.ids, function (i, t) {
							if (id != t) {
								newArr.push(t)
							}
						})
						_t.ids = newArr;
					}
				}
			});
			var nums = _t.ids.length;	
			$('.selectOrderNums em').html(nums);
		},

		queryOrderList: function () {
			var _t = this;
			var searchData = {
				lawyerId: _t.id
			};
			var qlps = {
				box: _t.box,
				url: URL.user.pointOrderList,
				searchData: searchData,
				cols: tableParams
			}
			utils.queryList(qlps, function (curr, tr, item) {
				var id = tr.data('id').toString()
				if (item.choosed == 1) {
					tr.addClass('trDisabled')
					tr.find('input[type="checkbox"]').remove()
					tr.find('.laytable-cell-checkbox').html('')
				} else {
					if ($.inArray(id, _t.ids) != -1) {
						tr.find('input[type="checkbox"]')[0].checked = true;
					}
					tr.find('input[type="checkbox"]').attr('lay-filter', 'chooseSingle');
					form.render('checkbox');
				}
			});

			form.on('checkbox(chooseSingle)', function (e) {
				var id = $(e.elem).closest('tr').data('id').toString()
				var checked = this.checked;
				if (checked) {
					if ($.inArray(id, _t.ids) == -1) {
						_t.ids.push(id)
					}
				} else {
					if ($.inArray(id, _t.ids) != -1) {
						var newArr = []
						$.each(_t.ids, function (i, t) {
							if (id != t) {
								newArr.push(t)
							}
						})
						_t.ids = newArr;
					}
				}
				var nums = _t.ids.length;
				$('.selectOrderNums em').html(nums);
			})
		},

		getLawyerData: function (data) {
			var _t = this;

			var qlps = {
				url: URL.lawyer.comments,
				searchData: {
					id: _t.id
				},
				box: '.commentsCon',
				temp: '/page/lawyer/temp/lawyerData.html'
			}
			utils.queryTempList(qlps);
		},

		getLawyerList: function () {
			var areas = utils.cookie(global.areaCookie);
			if (areas) {
				areas = JSON.parse(areas) || {};
			} else {
				areas = global.defaultArea;
			}
			var params = {}
			params[global.rows] = 5;
			params[global.page] = 1;
			params.city = areas.name;
			params.noAuth = 1;
			utils.get(URL.lawyer.query, params, function (res) {
				var data = res.data.list || []
				var html = utils.getTemp('/page/common/reclawyerTemp.html', data)
				$('.newsRight ul').html(html);
			})
		}

	}

	// 点击事件
	gather.init();
});
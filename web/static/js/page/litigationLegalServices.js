layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.selectArr = [];
			_t.selectObjArr = {};

			_t.loadRecommend();
			_t.queryList();

			$('body').on('click', '.addCart', function () {
				_t.addCarts($(this));
			});

			$('body').on('click', '.floatCart', function () {
				_t.showSelectList($(this));
			});

			$('body').on('click', '.toSmall', function () {
				$('.floatCart .fonts').addClass('hidden')
				$('.floatCart .imgBox').removeClass('hidden')
			});

			$('body').on('click', '.toFull', function () {
				$('.floatCart .imgBox').addClass('hidden')
				$('.floatCart .fonts').removeClass('hidden')
			});

			// 我要下单
			$('body').on('click', '.floatSubmit', function () {
				var ids = _t.selectArr.join(',');
				_t.selectArr = [];
				_t.selectObjArr = {};
				window.location = 'litigationLegalServicesAsk.html?ids=' + ids;
			});

			$('body').on('click', '.showDetail', function() {
				var id = $(this).closest('li').data('id')
				_t.editBox(id);
			});

			$('body').on('click', '.buyNow', function () {
				window.location = 'litigationLegalServicesAsk.html?id=' + $(this).closest('li').data('id');
			});
		},

		loadRecommend: function () {
			var params = {}
			params[global.rows] = 1;
			params[global.page] = 1;
			params.noAuth = 1;
			params.serviceType = 22;
			utils.getSync(URL.legal.queryLitigationLegalServices, params, function (res) {
				var data = res.data.list || []
				data = data[0] || {}
				var src = data.instructionPic || '/static/images/nopic.jpg'
				$('.services_header img').attr('src', src)
				$('.services_header p').html(data.instruction || '')
			})
		},

		queryList: function () {
			var qlps = {
				url: URL.legal.queryLitigationLegalServices,
				searchData: {
					serviceType: 22
				},
				box: '.services_list',
				temp: '/page/legal/list2.html'
			}
			utils.queryTempList(qlps);
		},

		addCarts: function (btn) {
			var _t = this;

			var id = btn.closest('li').attr('data-id');
			var item = btn.closest('li')[0].data
			if ($.inArray(id, _t.selectArr) == -1) {
				_t.selectArr.push(id);
				_t.selectObjArr[id] = item;
				btn.removeClass('layui-btn-red').addClass('layui-btn-disabled').html('已加入')
			}
			_t.setFloatIcon();
		},

		setFloatIcon: function () {
			var _t = this;
			var len = _t.selectArr.length;
			var box = $('.floatCart');
			if (len) {
				_t.showSelectList();
				box.removeClass('hidden').find('.imgBox em').html(len);
			} else {
				box.addClass('hidden');
			}
		},

		showSelectList: function () {
			var _t = this;
			var html = '<table class="layui-table" lay-size="sm"><tbody>';
			var total = 0;
			$.each(_t.selectObjArr, function (i, t) {
				html += '<tr data-id="' + t.id + '"><td><div class="nowrap">' + t.title + '</div></td><td><label class="fontRed">' + t.price + '元</label></td><td><i class="iconfont icon-fail delItems"></i></td></tr>';
				total += t.price;
			})

			html += '</tbody></table>';
			$('.floatCart .list').html(html);
			$('.floatCart .floatAmount em').html(total);

			// 清空
			$('.floatCart').off().on('click', '.clearFloat', function () {
				_t.selectArr = [];
				_t.setFloatIcon();
				$('.services_list').find('li').each(function () {
					var box = $(this);
					box.find('.addCart').html('选择加入').removeClass('layui-btn-disabled').addClass('layui-btn-red');
				})
			});

			// 删除单项
			$('.floatCart').on('click', '.delItems', function () {
				var id = $(this).closest('tr').attr('data-id');
				var newArr = [];
				$.each(_t.selectArr, function (i, t) {
					if (id != t) {
						newArr.push(t)
					}
				});
				delete(_t.selectObjArr[id])
				_t.selectArr = newArr;
				$('.services_list').find('li').each(function () {
					id == $(this).attr('data-id') && $(this).find('.addCart').html('选择加入').removeClass('layui-btn-disabled').addClass('layui-btn-red');
				})
				_t.setFloatIcon();
			});
		},

		editBox: function (id) {
			if (id) {
				utils.get(URL.legal.getById + id, function (res) {
					var data = res.data
					var formitem = [
						{
							title: "价格",
							label: data.price + "元",
							cols: 12
						}, {
							title: "销售量",
							label: data.salesCount,
							cols: 12
						}, {
							title: "服务说明",
							type: "html",
							html: data.instruction || '',
							cols: 12
						}, {
							title: "适用范围",
							type: "html",
							html: data.serviceRange || '',
							cols: 12
						}
					]
					var ops = {
						title: "服务说明",
						btn: ["立即购买"],
						class: "servicesRemark",
						success: function (layero) {
							$('.layui-layer-btn1').addClass('hidden');
							var obj = {};
							if (data) {
								if (utils.isType(data) == 'object') {
									utils.loadUpdateForm(layero, formitem, data);
								} else {
									utils.get(URL.select.getById, { id: data }, function (res) {
										obj = res.data || {};
										utils.loadUpdateForm(layero, formitem, obj);
									});
								}
							} else {
								utils.loadUpdateForm(layero, formitem);
							}
						},
						yes: function (index) {
							window.location = 'litigationLegalServicesAsk.html?id=' + id;
							layer.close(index);
						}
					};
					utils.openForm(ops);
				})
			}
		}
	}

	// 点击事件
	gather.init();
});
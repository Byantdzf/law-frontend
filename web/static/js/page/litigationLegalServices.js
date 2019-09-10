layui.define(function (exports) {

	var gather = {
		init: function () {
			var _t = this;
			_t.selectArr = [];
			_t.arr = [
				{id: "1", name:"收集和整理证据材料", price: 100},
				{id: "2", name:"起草起诉书和答辩状", price: 100},
				{id: "3", name:"代理词和辩护词", price: 100},
				{id: "4", name:"申请立案", price: 100},
				{id: "5", name:"出庭", price: 100},
				{id: "6", name:"刑事会见和阅卷", price: 100}
			];

			$('body').on('click', '.showDetial', function() {
				_t.editBox();
			});

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
				window.location = 'order.html?id=1,3,4&type=4';
			});

			// 单独购买
			$('body').on('click', '.buyNow', function () {
				window.location = 'order.html?id=1&type=4';
			});
		},

		addCarts: function (btn) {
			var _t = this;

			var id = btn.closest('li').attr('data-id');
			if ($.inArray(id, _t.selectArr) == -1) {
				_t.selectArr.push(id);
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
			$.each(_t.arr, function (i, t) {
				if ($.inArray(t.id, _t.selectArr) != -1) {
					html += '<tr data-id="' + t.id + '"><td><div class="nowrap">' + t.name + '</div></td><td><label class="fontRed">' + t.price + '元</label></td><td><i class="iconfont icon-fail delItems"></i></td></tr>';
					total += t.price;
				}
			});
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
				_t.selectArr = newArr;
				$('.services_list').find('li').each(function () {
					id == $(this).attr('data-id') && $(this).find('.addCart').html('选择加入').removeClass('layui-btn-disabled').addClass('layui-btn-red');
				})
				_t.setFloatIcon();
			});
		},

		editBox: function (data) {
			var formitem = [
				{
					title: "价格",
					label: "100元",
					cols: 12
				}, {
					title: "销售量",
					label: "1000",
					cols: 12
				}, {
					title: "服务说明",
					type: "html",
					html: "这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明，这是关于服务的说明。",
					cols: 12
				}, {
					title: "适用范围",
					type: "html",
					html: "这是该服务的使用范围说明，这是该服务的使用范围说明，这是该服务的使用范围说明，这是该服务的使用范围说明，这是该服务的使用范围说明，这是该服务的使用范围说明，这是该服务的使用范围说明，这是该服务的使用范围说明。",
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
					window.location = 'order.html?id=1&type=4';
					layer.close(index);
				}
			};
			utils.openForm(ops);
		}
	}

	// 点击事件
	gather.init();
});
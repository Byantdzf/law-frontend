layui.define(function (exports) {

	var tableParams = [
		[
			{title: "内容", align: "left", width:"200", templet: function (d) {
				var arr = ['', "提现", "用户订单充值", "接订单收入", "系统拨款", "系统扣款"]
				var tit = arr[operateType] || '';
				return tit + '<br /><span class="">' + d.createTime + '</span>';
			}}, 
			{title: "备注", field: "remark"}, 
			{title: "金额", field: "sentTime", width:"180"}, 
		]
	];

	var gather = {
		init: function () {
			var _t = this;

			_t.loadPage();
		},

		loadPage: function () {
			var _t = this;
			
			utils.get(URL.lawyerObj.info, function (res) {
				var data = res.data || {};
				utils.get(URL.lawyerObj.myData, function (res) {
					data = $.extend(true, {}, data, res.data);
					var html = utils.getTemp('/page/lawyer/user/index.html', data);
					$('.userPageCon').html(html);
				
					// 余额明细
					$('.getList').off().on('click', function () {
						_t.getListBox();
					});
				
					// 提现
					$('.withdraw').off().on('click', function () {
						_t.withdrawBox(data);
					});
				});
			});
		},

		getListBox: function () {
			var _t = this;
			var ops = {
				type: 1,
				title: '流水明细',
				area: ['800px', '600px'],
				// title: false,
				shadeClose: true,
				// closeBtn: 0,
				content: '<div class="myList"></div>',
				success: function (layero, index) {
					
					_t.box = '.myList';
					// _t.type = 0;
					// var html = '<div class="app-list"></div><div class="app-page-box"></div>';
					// $(_t.box).html(html);
			
					var ips = {
					};
					utils.initPage(ips, _t.box);

					_t.queryList();
				}
			};
			utils.dialog(ops);
		},

		withdrawBox: function (data) {
			var _t = this;
			var html = utils.getTemp('/page/lawyer/user/withDraw.html', data);
			var ops = {
				type: 1,
				title: '提现',
				area: '500px',
				// title: false,
				shadeClose: true,
				// closeBtn: 0,
				content: html,
				success: function (layero, index) {
					utils.getRadio(global.rs.payment, '.withDrawType');
					form.on('submit(withDrawSubmit)', function (res) {
						var params = res.field;
						params.operateType = 1;
						var limit = $('.cashOutAmount').data('max');

						if (params.cashOutAmount > limit) {
							utils.alert('您的余额不足，请确认');
							return false;
						}

						if (!params.cashOutAmount || params.cashOutAmount == 0) {
							utils.alert('请输入提现金额');
							return false;
						}

						if (Number(params.cashOutAmount).toString() == 'NaN' || params.cashOutAmount < 0) {
							utils.alert('请输入正确的金额');
							return false;
						}

						utils.post(URL.lawyerObj.withDraw, params, function (res) {
							utils.msg('提现成功');
							layer.close(index);
							_t.loadPage();
						});
					})
				}
			};
			utils.dialog(ops);
		},

		queryList: function () {
			var _t = this;
			var qlps = {
				// "lay-skin": "nob",
				box: _t.box,
				// url: URL.lawyerObj.user.myList,
				
				url: URL.lawyerObj.waterList,
				cols: tableParams
			}
			utils.queryList(qlps, function (curr,tr, item) {
			});
		},
	}

	// 点击事件
	gather.init();
});
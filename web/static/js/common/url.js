
if (typeof (hosts) == 'undefined') {
	hosts = '';
}

var URL = {
	common: {
		upload: '/base/tool/oss/upload',
		logs:   '/log/operation/page',
		test:   '/static/data/toBuy.json',
	},
	auth: {
		login: '/static/data/login.json',
		logout: '/static/data/update.json',
		updatePass: '/static/data/update.json'
	},
	select: {
		menu: '/static/data/menu.json',
		list: '/static/data/test.json',
		getById: '/static/data/getById.json',
		query: '/static/data/test.json'
	},
	stall: {
		query: '/static/data/stall/stall.json',
		live: '/static/data/stall/live.json',
		order: '/static/data/stall/order.json',
		orderDetail: '/static/data/stall/orderDetail.json'
	},
	storage: {
		putIn: '/static/data/storage/putIn.json',
		putOut: '/static/data/storage/putIn.json',
		loss: '/static/data/storage/loss.json',
		check: '/static/data/storage/check.json'
	},
	shipments: {
		shipments: '/static/data/shipments/shipments.json',
		logistics: '/static/data/shipments/logistics.json'
	},
	feedback: {
		query: '/static/data/feedback/query.json'
	},
	system: {
		list: '/static/data/system/list.json'
	}
}
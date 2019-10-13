
if (typeof (hosts) == 'undefined') {
	hosts = '';
}

var URL = {
	common: {
		upload: '/applets/lawyer/multiUpload',
	},
	auth: {
		login: '/static/data/login.json',
		logout: '/static/data/update.json',
		updatePass: '/static/data/update.json'
	},
	select: {
		getCate: '/static/data/cate.json',
		getArea: '/static/data/area.json',
		getProvCity: '/static/data/city_code.json',
	},
	order: {
		list: '/static/data/order.json',
	},
	notice: {
		list: '/static/data/notice.json',
	}
}
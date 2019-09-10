
if (typeof (hosts) == 'undefined') {
	hosts = '';
}

var URL = {
	common: {
		upload: '/base/tool/oss/upload',
	},
	auth: {
		login: '/static/data/login.json',
		logout: '/static/data/update.json',
		updatePass: '/static/data/update.json'
	},
	select: {
		getCate: '/static/data/cate.json',
		getArea: '/static/data/area.json',
	}
}
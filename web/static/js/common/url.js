
// $.ajax({
// 	async: false,
// 	url: '/config/config.js',
// 	dataType: "script",
// 	success: function (res) {
// 	}
// })

if (typeof (pcHost) == 'undefined') {
	pcHost = '';
}
if (typeof (commonHost) == 'undefined') {
	commonHost = '';
}

var URL = {
	common: {
		upload: '/applets/lawyer/multiUpload',
		// questionType: commonHost + '/applets/lawyer/getDictData',
		questionType: '/static/data/questionType.json',
		isRegister: pcHost + '/pc/user/consult/publish/page'
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
	},
	lawyer: {
		query: pcHost + '/pc/user/lawyer/list',
		getById: pcHost + '/pc/user/lawyer/details/'
	},
	news: {
		query: pcHost + '/pc/user/article/list',
		getById: pcHost + '/pc/user/article/details/'
	}
}
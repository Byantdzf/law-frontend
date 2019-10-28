
$.ajax({
	async: false,
	url: '/config/config.js',
	dataType: "script",
	success: function (res) {
	}
})

if (typeof (pcHost) == 'undefined') {
	pcHost = '';
}
if (typeof (commonHost) == 'undefined') {
	commonHost = '';
}

var URL = {
	common: {
		upload: '/applets/lawyer/multiUpload',
		questionType: pcHost + '/getDictData?dictCode=QuestionType',
		// questionType: '/static/data/questionType.json',
		isRegister: pcHost + '/pc/user/consult/publish/page',
		getSmsCode: commonHost + '/applets/lawyer/getPhoneVerificationCode',
		coupon: pcHost + '/pc/user/couponPool/list'
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
	notice: {
		list: pcHost + '/pc/user/msg/list',
		details: pcHost + '/pc/user/msg/details/'
	},
	lawyer: {
		query: pcHost + '/pc/user/lawyer/list',
		getById: pcHost + '/pc/user/lawyer/details/',
		comments: commonHost + '/pc/user/lawyer/details/evaluation/list/'
	},
	news: {
		query: pcHost + '/pc/user/article/list',
		getById: pcHost + '/pc/user/article/details/'
	},
	legal: {
		queryNonlitigationLegalServices: pcHost + '/pc/user/service/info/2/21',
		queryLitigationLegalServices: pcHost + '/pc/user/service/info/2/22',
		queryLawyer: pcHost + '/pc/user/service/info/3/31',
		getById: pcHost + '/pc/user/service/details/'
	},
	issue: {
		postIssue: pcHost + '/pc/user/consult/publish/1',                // 咨询订单
		postLegals: pcHost + '/pc/user/consult/publish/2',               // 分块法律
		postMandatoryLawyer: pcHost + '/pc/user/consult/publish/3',      // 代理律师服务
		postTemplate: pcHost + '/pc/user/consult/publish/4'              // 法律文件购买
	},
	user: {
		attention: pcHost + '/pc/user/focused',
		cancelattention: pcHost + '/pc/user/order/operateOrder',
		coupon: pcHost + '/pc/user/coupon/list',
		feedback: pcHost + '/pc/user/feedback',
		order: {
			query: pcHost + '/pc/user/order/orderList'
		}
	}
}
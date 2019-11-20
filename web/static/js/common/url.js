
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
		uploadImage: pcHost + '/applets/lawyer/multiUpload',
		// questionType: '/static/data/questionType.json',
		isRegister: pcHost + '/pc/user/consult/publish/page',
		getSmsCode: commonHost + '/applets/lawyer/getPhoneVerificationCode',
		coupon: pcHost + '/pc/user/couponPool/list',
		askMoney: pcHost + '/getDictData?dictCode=PayMoney',
		alipay: pcHost + '/pc/lawyer/pay/customerPayForPC',
		wechatPay: pcHost + '/pc/lawyer/pay/getPrepayInfoQr',
		wechatPayResult: pcHost + '/pc/lawyer/getWeixinOrderByOrderNo'
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
		comments: pcHost + '/pc/user/lawyer/details/evaluation/list'
	},
	news: {
		query: pcHost + '/pc/user/article/list',
		getById: pcHost + '/pc/user/article/details/'
	},
	legal: {
		queryNonlitigationLegalServices: pcHost + '/pc/user/service/info/2',
		queryLitigationLegalServices: pcHost + '/pc/user/service/info/2',
		queryLawyer: pcHost + '/pc/user/service/info/3',
		getById: pcHost + '/pc/user/service/details/'
	},
	issue: {
		postIssue: pcHost + '/pc/user/consult/publish/1',                // 咨询订单
		postLegals: pcHost + '/pc/user/consult/publish/2',               // 分块法律
		postMandatoryLawyer: pcHost + '/pc/user/consult/publish/3',      // 代理律师服务
		postTemplate: pcHost + '/pc/user/consult/publish/4'              // 法律文件购买
	},
	template: {
		query: pcHost + '/pc/user/template/list',
		details: pcHost + '/pc/user/template/list/',
		downloadUrl: pcHost + '/applets/lawyer/downloadFile'
	},
	user: {
		attention: pcHost + '/pc/user/focused',
		cancelattention: pcHost + '/pc/user/order/operateOrder',
		coupon: pcHost + '/pc/user/coupon/list',
		feedback: pcHost + '/pc/user/feedback',
		info: pcHost + '/pc/user/base/info',
		wxLogin: pcHost + '/pc/user/login/url',
		wxLoginStatus: pcHost + '/pc/user/wechat/login/result',
		order: {
			query: pcHost + '/pc/user/order/orderList',
			getById: pcHost + '/pc/user/order/orderDetail',
			cancel: pcHost + '/pc/user/order/cancel',
			reply: pcHost + '/pc/user/msg/orderMsglist',
			petition: pcHost + '/pc/user/order/appeal/',
			askAgain: pcHost + '/pc/user/order/askSecond/',
			confirm: pcHost	 + '/pc/user/order/confirm/',
			comment: pcHost + '/pc/user/order/evaluate/',
			getComments: pcHost + '/pc/lawyer/orderScore/queryOrderScoreByOrderId'
		}
	},
	lawyerObj: {
		login: pcHost + '/pc/lawyer/login',
		reg: pcHost + '/pc/lawyer/register',
		info: pcHost + '/pc/lawyer/my/myInfo',
		myData: pcHost + '/pc/lawyer/my/myData',
		update: pcHost + '/pc/lawyer/updateLawyerInfo',
		attention: pcHost + '/pc/lawyer/my/myFollow',
		feedback: pcHost + '/pc/lawyer/feedback',
		news: {
			query: pcHost + '/pc/lawyer/article/list',
			getById: pcHost + '/pc/lawyer/article/details/'
		},
		order: {
			query: pcHost + '/pc/lawyer/order/orderList',
			getById: pcHost + '/pc/lawyer/order/orderDetail',
			operate: pcHost + '/pc/lawyer/order/recordOperate',
			accept: pcHost + '/pc/lawyer/order/acceptOrder',
			refuse: pcHost + '/pc/lawyer/order/rejectOrder',
			replyList: pcHost + '/pc/lawyer/msg/orderMsglist',
			reply: pcHost + '/pc/lawyer/order/orderReply',
			replyFiles: pcHost + '/pc/lawyer/order/orderReplyForManyAttachment',
			getComments: pcHost + '/pc/lawyer/orderScore/queryOrderScoreByOrderId'
		},
		notice: {
			list: pcHost + '/pc/lawyer/msg/list',
			details: pcHost + '/pc/lawyer/msg/details/'
		},
		user: {
			myList: '/pc/lawyer/my/balanceAmountDetail'
		}
	}
}
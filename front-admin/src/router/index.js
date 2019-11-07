
// 页面
const Login = () => import('@/pages/login').then(m => m.default)

const routes = [
	{
		"name": "login",
		"path": "/login",
		"component": Login
	}, {
		"path": "/layout/default",
		"name": "layout.default",
		"component": () => import('@/layouts/default').then(m => m.default),
		"children": [
			// // 订单
			// {
			// 	"name": "order.play",
			// 	"path": "/order/play",
			// 	"component": () => import('@/pages/order/play').then(m => m.default)
			// },
			// {
			// 	"name": "order.travel",
			// 	"path": "/order/travel",
			// 	"component": () => import('@/pages/order/travel').then(m => m.default)
			// },

			// // 商户
			// {
			// 	"name": "tenant.list",
			// 	"path": "/tenant/list",
			// 	"component": () => import('@/pages/tenant/list').then(m => m.default)
			// },
			// {
			// 	"name": "tenant.store",
			// 	"path": "/tenant/store",
			// 	"component": () => import('@/pages/tenant/store').then(m => m.default)
			// },
			// {
			// 	"name": "tenant.level",
			// 	"path": "/tenant/level",
			// 	"component": () => import('@/pages/tenant/level').then(m => m.default)
			// },

			// // 内容
			// {
			// 	"name": "content.dest",
			// 	"path": "/content/dest",
			// 	"component": () => import('@/pages/content/dest').then(m => m.default)
			// },


			// // 财务
			// {
			// 	"name": "finance.tenantAccount",
			// 	"path": "/finance/tenantAccount",
			// 	"component": () => import('@/pages/finance/tenantAccount').then(m => m.default)
			// },
			// {
			// 	"name": "finance.credit.finance",
			// 	"path": "/finance/credit/finance",
			// 	"component": () => import('@/pages/finance/credit/finance').then(m => m.default)
			// },
			// {
			// 	"name": "finance.credit.sale",
			// 	"path": "/finance/credit/sale",
			// 	"component": () => import('@/pages/finance/credit/sale').then(m => m.default)
			// },
			// {
			// 	"name": "finance.credit.payment",
			// 	"path": "/finance/credit/payment",
			// 	"component": () => import('@/pages/finance/credit/payment').then(m => m.default)
			// },
			// {
			// 	"name": "finance.bankAccount",
			// 	"path": "/finance/bankAccount",
			// 	"component": () => import('@/pages/finance/bankAccount').then(m => m.default)
			// },

			// // 设置
			// {
			// 	"name": "setting.area.inland",
			// 	"path": "/setting/area/inland",
			// 	"component": () => import('@/pages/setting/area/inland').then(m => m.default)
			// },
			// {
			// 	"name": "setting.area.foreign",
			// 	"path": "/setting/area/foreign",
			// 	"component": () => import('@/pages/setting/area/foreign').then(m => m.default)
			// },

			// // 权限
			// {
			// 	"name": "authority.member",
			// 	"path": "/authority/member",
			// 	"component": () => import('@/pages/authority/member').then(m => m.default)
			// },

			// // 数据
			// {
			// 	"name": "statistics.sales",
			// 	"path": "/statistics/sales",
			// 	"component": () => import('@/pages/statistics/sales').then(m => m.default)
			// },

			// 首页
			{
				"name": "home.index",
				"path": "/home/index",
				"component": () => import('@/pages/home/index').then(m => m.default)
			},

			// 会员管理
			{
				"name": "member.consultants",
				"path": "/member/consultants",
				"component": () => import('@/pages/member/consultants').then(m => m.default)
			},
			{
				"name": "member.lawyer",
				"path": "/member/lawyer",
				"component": () => import('@/pages/member/lawyer').then(m => m.default)
			},
			{
				"name": "member.lawyerCheck",
				"path": "/member/lawyerCheck",
				"component": () => import('@/pages/member/lawyerCheck').then(m => m.default)
			},

			// 管理员管理
			{
				"name": "admin.list",
				"path": "/admin/list",
				"component": () => import('@/pages/admin/list').then(m => m.default)
			},
			{
				"name": "admin.role",
				"path": "/admin/role",
				"component": () => import('@/pages/admin/role').then(m => m.default)
			},

			// 内容管理
			{
				"name": "content.ad",
				"path": "/content/ad",
				"component": () => import('@/pages/content/ad').then(m => m.default)
			},
			{
				"name": "content.article",
				"path": "/content/article",
				"component": () => import('@/pages/content/article').then(m => m.default)
			},
			{
				"name": "content.sensitiveWord",
				"path": "/content/sensitiveWord",
				"component": () => import('@/pages/content/sensitiveWord').then(m => m.default)
			},
			{
				"name": "content.hotline",
				"path": "/content/hotline",
				"component": () => import('@/pages/content/hotline').then(m => m.default)
			},
			{
				"name": "content.feedback",
				"path": "/content/feedback",
				"component": () => import('@/pages/content/feedback').then(m => m.default)
			},

			// 平台服务内容
			{
				"name": "platform.block",
				"path": "/platform/block",
				"component": () => import('@/pages/platform/block').then(m => m.default)
			},
			{
				"name": "platform.entrusted",
				"path": "/platform/entrusted",
				"component": () => import('@/pages/platform/entrusted').then(m => m.default)
			},
			{
				"name": "platform.agreement",
				"path": "/platform/agreement",
				"component": () => import('@/pages/platform/agreement').then(m => m.default)
			},
			{
				"name": "platform.classification",
				"path": "/platform/classification",
				"component": () => import('@/pages/platform/classification').then(m => m.default)
			},

			// 订单管理
			{
				"name": "order.list",
				"path": "/order/list",
				"component": () => import('@/pages/order/list').then(m => m.default)
			},
			{
				"name": "order.rule",
				"path": "/order/rule",
				"component": () => import('@/pages/order/rule').then(m => m.default)
			},
			{
				"name": "order.appeal",
				"path": "/order/appeal",
				"component": () => import('@/pages/order/appeal').then(m => m.default)
			},
			{
				"name": "order.orders",
				"path": "/order/orders",
				"component": () => import('@/pages/order/orders').then(m => m.default)
			},
			{
				"name": "order.comment",
				"path": "/order/comment",
				"component": () => import('@/pages/order/comment').then(m => m.default)
			},

			// 财务管理
			{
				"name": "finance.list",
				"path": "/finance/list",
				"component": () => import('@/pages/finance/list').then(m => m.default)
			},
			{
				"name": "finance.withdraw",
				"path": "/finance/withdraw",
				"component": () => import('@/pages/finance/withdraw').then(m => m.default)
			},
			{
				"name": "finance.commission",
				"path": "/finance/commission",
				"component": () => import('@/pages/finance/commission').then(m => m.default)
			},

			// 优惠券管理
			{
				"name": "coupon.list",
				"path": "/coupon/list",
				"component": () => import('@/pages/coupon/list').then(m => m.default)
			},

			// 平台消息推送
			{
				"name": "message.list",
				"path": "/message/list",
				"component": () => import('@/pages/message/list').then(m => m.default)
			},

			// 操作日志
			{
				"name": "log.list",
				"path": "/log/list",
				"component": () => import('@/pages/log/list').then(m => m.default)
			},

			// 404
			{
				"name": "404",
				"path": "/404",
				"component": () => import('@/pages/404').then(m => m.default)
			}
		]
	}
]

export default routes

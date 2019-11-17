
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
			// // 权限
			// {
			// 	"name": "authority.member",
			// 	"path": "/authority/member",
			// 	"component": () => import('@/pages/authority/member').then(m => m.default)
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

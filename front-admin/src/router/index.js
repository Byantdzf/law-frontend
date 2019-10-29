
// 页面
const Login = () => import('@/pages/login').then(m => m.default)

const routes = [
	{
		"name": "login",
		"path": "/login",
		"component": Login
	}, {
		"path": "/layout/detail",
		"name": "layout.detail",
		"component": () => import('@/layouts/detail').then(m => m.default),
		"children": [
			// 订单
			{
				"name": "order.detail.travel",
				"path": "/order/detail/travel",
				"component": () => import('@/pages/order/detail/travel').then(m => m.default)
			},
			//出行确认函
			{
				"name": "order.detail.orderSend",
				"path": "/pages/order/detail/travel/orderSend",
				"component": () => import('@/pages/order/detail/travel/orderSend').then(m => m.default)
			},

		]
	}, {
		"path": "/layout/default",
		"name": "layout.default",
		"component": () => import('@/layouts/default').then(m => m.default),
		"children": [
			// 订单
			{
				"name": "order.play",
				"path": "/order/play",
				"component": () => import('@/pages/order/play').then(m => m.default)
			},
			{
				"name": "order.travel",
				"path": "/order/travel",
				"component": () => import('@/pages/order/travel').then(m => m.default)
			},

			// 商户
			{
				"name": "tenant.list",
				"path": "/tenant/list",
				"component": () => import('@/pages/tenant/list').then(m => m.default)
			},
			{
				"name": "tenant.store",
				"path": "/tenant/store",
				"component": () => import('@/pages/tenant/store').then(m => m.default)
			},
			{
				"name": "tenant.level",
				"path": "/tenant/level",
				"component": () => import('@/pages/tenant/level').then(m => m.default)
			},

			// 内容
			{
				"name": "content.dest",
				"path": "/content/dest",
				"component": () => import('@/pages/content/dest').then(m => m.default)
			},


			// 财务
			{
				"name": "finance.tenantAccount",
				"path": "/finance/tenantAccount",
				"component": () => import('@/pages/finance/tenantAccount').then(m => m.default)
			},
			{
				"name": "finance.credit.finance",
				"path": "/finance/credit/finance",
				"component": () => import('@/pages/finance/credit/finance').then(m => m.default)
			},
			{
				"name": "finance.credit.sale",
				"path": "/finance/credit/sale",
				"component": () => import('@/pages/finance/credit/sale').then(m => m.default)
			},
			{
				"name": "finance.credit.payment",
				"path": "/finance/credit/payment",
				"component": () => import('@/pages/finance/credit/payment').then(m => m.default)
			},
			{
				"name": "finance.bankAccount",
				"path": "/finance/bankAccount",
				"component": () => import('@/pages/finance/bankAccount').then(m => m.default)
			},

			// 设置
			{
				"name": "setting.area.inland",
				"path": "/setting/area/inland",
				"component": () => import('@/pages/setting/area/inland').then(m => m.default)
			},
			{
				"name": "setting.area.foreign",
				"path": "/setting/area/foreign",
				"component": () => import('@/pages/setting/area/foreign').then(m => m.default)
			},

			// 权限
			{
				"name": "authority.member",
				"path": "/authority/member",
				"component": () => import('@/pages/authority/member').then(m => m.default)
			},

			// 数据
			{
				"name": "statistics.sales",
				"path": "/statistics/sales",
				"component": () => import('@/pages/statistics/sales').then(m => m.default)
			},

			// init
			{
				"name": "init.data",
				"path": "/init/data",
				"component": () => import('@/pages/init/data').then(m => m.default)
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


// 布局
const layoutDefault = () => import('@/layouts/default').then(m => m.default)

// 页面
const Login = () => import('@/pages/login').then(m => m.default)

const routes = [
	{
		"name": "login",
		"path": "/login",
		"component": Login
	}, {
		"name": "",
		"path": "",
		"component": layoutDefault,
		"children": [
			{
				"name": "home.index",
				"path": "/home/index",
				"component": () => import('@/pages/home/index').then(m => m.default)
			},

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

			// init
			{
				"name": "init.data",
				"path": "/init/data",
				"component": () => import('@/pages/init/data').then(m => m.default)
			},

			// 404
			{
				"name": "404",
				"path": "*",
				"component": () => import('@/pages/404').then(m => m.default)
			}
		]
	}
]

export default routes

const app = getApp()
const selectApi = require('../../../service/select')
const { appName, PAGE_KEY, SIZE_KEY } = require('../../../config/global')
let page = null
Page({
	data: {
		currArea: [],
		//图片地址
		banners: [],
		list: [],
		hotNews1: [],
		hotNews2: [],
		hotNews3: [],
		tools: [
			{
				name: '在线律师咨询',
				url: '/pages/issue/voice/index',
				icon: '/static/images/icon-menu01.png'
			}, {
				name: '指定律师咨询',
				url: '/pages/issue/oneByOne/index',
				icon: '/static/images/icon-menu02.png'
			}, {
				name: '日常法律服务',
				url: '/pages/legalServices/list/index?type=22',
				icon: '/static/images/icon-menu03.png'
			}, {
				name: '分块法律服务',
				url: '/pages/legalServices/listMutli/index?type=21',
				icon: '/static/images/icon-menu04.png'
			}, {
				name: '收费代理',
				url: '/pages/mandatoryLawyer/list/index?type=31',
				icon: '/static/images/icon-menu05.png'
			}, {
				name: '风险代理',
				url: '/pages/mandatoryLawyer/list/index?type=32',
				icon: '/static/images/icon-menu06.png'
			}, {
				name: '协议文本',
				url: '/pages/template/list/index',
				icon: '/static/images/icon-menu07.png'
			}, {
				name: '律师精选',
				type: 'tab',
				url: '/pages/tabBar/lawyer/index',
				icon: '/static/images/icon-menu08.png'
			}
		],
		showTools: false
	},
	onLoad() {
		app.pages.add(this)
		app.setNavColor()
		app.setNavTitle(appName)

		app.getUserLocation(data => {
			const adInfo = data.adInfo || {}
			this.setData({
				currArea: [adInfo.province.replace('省', ''), adInfo.city.replace('市', '')]
			})
			// 获取地址完成以后再判断授权
			page = this.selectComponent('#app-page')
			page.checkAuth().then((data) => {
				// 授权成功
				console.log(data)
				let { encryptedData, iv, userInfo } = data;
				page.userLogin({ encryptedData, iv, userInfo }).then(res => {
					this.getNewsData()
					this.initHome()
				})
			}).catch((e) => {
				// 授权失败
				page.userLogin({ encryptedData, iv, userInfo }).then(res => {
					this.getNewsData()
					this.initHome()
				})
			});
		})
	},
	onShow() {

	},
	initHome() {
		let cityPicker = this.selectComponent('#app-cityPicker')
		cityPicker.init(this.data.currArea)
		this.getLawyerList()
		this.getBanners()
	},
	// 获取banners
  getBanners() {
    selectApi.advertisementList({ terminal: 2, location: 1 }).then(res => {
      let banners = (res.data || []).map(v => v.coverPhoto)
      this.setData({ banners })
    })
  },
	// 获取热门新闻
	getNewsData() {
		let params = {}
		params[PAGE_KEY] = 1
		params[SIZE_KEY] = 5
		selectApi.newsList({ ...params, type: 1 }).then(res => {
			let hotNews1 = res.data.list
			this.setData({ hotNews1 })
		})
		selectApi.newsList({ ...params, type: 2 }).then(res => {
			let hotNews2 = res.data.list
			this.setData({ hotNews2 })
		})
		selectApi.newsList({ ...params, type: 3 }).then(res => {
			let hotNews3 = res.data.list
			this.setData({ hotNews3 })
		})
	},
	// 获取推荐律师
	getLawyerList() {
		// 获取本地律师
		let lawyerParams = {}
		lawyerParams[PAGE_KEY] = 1
		lawyerParams[SIZE_KEY] = 10
		lawyerParams.city = this.data.currArea[1] || ''
		// lawyerParams.city = 'shenzhen'
		selectApi.lawyerList(lawyerParams).then(res => {
			let list = res.data.list
			this.setData({ list })
		})
	},
	handleToolBtnTap(e) {
		this.setData({
			showTools: !this.data.showTools
		})
	},
	handleClosePop() {
		this.setData({
			showTools: false
		})
	},
	gotoLawyerDetail(e) {
		let { id } = e.currentTarget.dataset
		app.gotoPage('/pages/lawyer/detail/index?id=' + id)
	},
	imageError(e) {
		var _errImg = e.target.dataset.img
		var _errObj = {}
		_errObj[_errImg] = "/static/images/demo/img_lawyer.png"
		this.setData(_errObj)
	},
	collect(e) {
		let { id } = e.currentTarget.dataset
		let list = this.data.list
		let index = list.findIndex(item => {
			return id == item.id
		})
		let items = list[index]
		selectApi.attentionLawyer({ businessId: id }).then(res => {
			this.getLawyerList()
		})
	},
	cancelCollect(e) {
		let { id } = e.currentTarget.dataset
		let list = this.data.list
		let index = list.findIndex(item => {
			return id == item.id
		})
		let items = list[index]
		selectApi.cancelAttentionLawyer({ businessId: id }).then(res => {
			this.getLawyerList()
		})
	},
	voiceTap(e) {
		let { id } = e.currentTarget.dataset
		app.gotoPage('/pages/lawyer/voice/index?id=' + id)
	},
	onByOneTap(e) {
		let { id } = e.currentTarget.dataset
		app.gotoPage('/pages/lawyer/oneByOne/index?id=' + id)
	},
	tapTools(e) {
		let { url, type } = e.currentTarget.dataset
		this.handleClosePop()
		app.gotoPage(url, type)
	},
	gotoSearch() {
		app.gotoPage('/pages/search/index/index')
	},
	getCityResult(e) {
		this.setData({
			currArea: [e.detail[0].name.replace('省', ''), e.detail[1].name.replace('市', '')]
		})
		app.getCityLocation(e.detail[0].name, e.detail[1].name)
		this.initHome()
	}
})

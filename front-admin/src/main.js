import Vue from 'vue'
import Router from 'vue-router'
import VueI18n from 'vue-i18n'
import VueCookie from 'vue-cookie'
import { get } from 'lodash-es'
import App from './App.vue'
import routes from './router'
import store from './vuex'
// import SYSTEM from './utils/system'
import AppLoading from '@/components/app-loading'

// 引入element ui
import '@/element-ui'
import 'element-ui/lib/theme-chalk/index.css';
// 公共样式
import '@/assets/less/main.less'
// 去除生产环境的提示
Vue.config.productionTip = false

Vue.component(AppLoading.name, AppLoading)
Vue.use(Router)
Vue.use(VueI18n)
Vue.use(VueCookie)

Vue.prototype.$val = (o, p, d = '') => get(o, p, d)
Vue.prototype.setState = payload => store.commit('setState', payload)

String.prototype.replaceAll = function(s1, s2) {
  return this.replace(new RegExp(s1, 'gm'), s2)
}

String.prototype.gblen = function() {
  let len = 0
  for (let i = 0; i < this.length; i++) {
    if (this.charCodeAt(i)>127 || this.charCodeAt(i)==94) {
      len += 2
    } else {
      len ++
    }
  }
  return len
}

// 日期格式化
Date.prototype.format = function (fmt) {
  const o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
  }

  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
    }
  }

  return fmt
}

const zhLocale = require('./assets/lang/zh-CN.json')

// 创建i18n实例 （多语言）
const i18n = new VueI18n({
  locale: store.state.lang || 'zh-CN',
  messages: {
    'zh-CN': {
      ...zhLocale
    },
    // 'en': {
    //   ...enLocale
    // }
  }
})

// 创建router实例
const router = new Router({
  routes,
  // mode:history
})

Router.prototype.openNewTab = function(path, query) {
  const routeUrl = router.resolve({ path, query })
  window.open(routeUrl.href, '_blank')
}

// router跳转前相关逻辑处理
router.beforeEach((to, from, next) => {
  // const token = SYSTEM.userToken()

  // if (!token) {
  //   if (to.path === '/login') {
  //     next()
  //   } else {
  //     next('/login')
  //   }
  // } else {
  //   if (to.path === '/' || to.path === '') {
  //     next(SYSTEM.routeHomePath)
  //   } else {
  //     next()
  //   }
  // }
  if (to.path === '/' || to.path === '') {
    next('/login')
  } else {
    next()
  }
})

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')

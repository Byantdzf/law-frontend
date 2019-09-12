import Vue from 'vue'
import Router from 'vue-router'
import VueI18n from 'vue-i18n'
import { get } from 'lodash-es'
import App from './App.vue'
import routes from './router'
import store from './vuex'
import SYSTEM from './utils/system'
import AppLoading from '@/components/app-loading'

// 引入element ui
import '@/element-ui'
// 公共样式
import '@/assets/less/main.less'
// 去除生产环境的提示
Vue.config.productionTip = false

const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.component(AppLoading.name, AppLoading)
Vue.use(Router)
Vue.use(VueI18n)

Vue.prototype.$val = (o, p, d = '') => get(o, p, d)
Vue.prototype.setState = payload => store.commit('setState', payload)

String.prototype.replaceAll = function(s1, s2){
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
  routes
})

// router跳转前相关逻辑处理
router.beforeEach((to, from, next) => {
  const token = SYSTEM.userToken()

  if (to.path === '/' || to.path === '') {
    if (token) {
      next({
        path: SYSTEM.routeHomePath
      })
    } else {
      next({ path: '/login' })
    }
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

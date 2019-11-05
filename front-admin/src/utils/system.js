import VueCookie from 'vue-cookie'
import { getQueryString } from '@/utils/tools'

const SYSTEM = {
  name: process.env.VUE_APP_SYSTEM_NAME,
  title: process.env.VUE_APP_TITLE,
  copyright: process.env.VUE_APP_COPYRIGHT,
  // baseUrl: process.env.BASE_URL,
  baseUrl: 'http://139.9.188.68:8073',
  routeHomePath: process.env.VUE_APP_HOME_PATH,
  isDevEnv: process.env.NODE_ENV === 'development',
  isProEnv: process.env.NODE_ENV === 'production',
  tokenName: 'LOGIN_ACCESS_TOKEN',
  userTokenKey() {
    return `${this.name}_${getQueryString('uid') || ''}_TOKEN`
  },
  // userToken(val) {
  //   const key = this.userTokenKey()
    
  //   if (val) {
  //     localStorage.setItem(key, val)
  //   } else {
  //     return localStorage.getItem(key) || ''
  //   }
  // }
  userToken(val) {
    if (val) {
      VueCookie.set(this.tokenName, val)
    } else {
      return VueCookie.get(this.tokenName) || ''
    }
  }
}

export default SYSTEM
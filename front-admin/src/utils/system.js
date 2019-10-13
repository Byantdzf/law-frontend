import { getQueryString } from '@/utils/tools'

const SYSTEM = {
  name: process.env.VUE_APP_SYSTEM_NAME,
  title: process.env.VUE_APP_TITLE,
  copyright: process.env.VUE_APP_COPYRIGHT,
  baseUrl: process.env.BASE_URL,
  routeHomePath: process.env.VUE_APP_HOME_PATH,
  userTokenKey() {
    return `${this.name}_${getQueryString('uid') || ''}_TOKEN`
  },
  userToken(val) {
    const key = this.userTokenKey()
    
    if (val) {
      localStorage.setItem(key, val)
    } else {
      return localStorage.getItem(key) || ''
    }
  }
}

export default SYSTEM
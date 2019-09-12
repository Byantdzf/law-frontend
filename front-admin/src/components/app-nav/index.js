
import AppNav from './src/main.vue'

export default AppNav

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(AppNav.name, AppNav)
}

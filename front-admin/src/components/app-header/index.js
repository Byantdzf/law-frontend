
import AppHeader from './src/main.vue'

export default AppHeader

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(AppHeader.name, AppHeader)
}

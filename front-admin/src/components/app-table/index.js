import Main from './src/main.vue'
import methods from './src/methods'
Main.install = function (Vue) {
  Vue.component(Main.name, Main)
}
Main._mixinsMethods = methods
export default Main

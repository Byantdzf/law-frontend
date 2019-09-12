/** 
 * app-chart-bar
 * echarts 柱状图 https://github.com/ecomfe/vue-echarts
 * @prop {Object, Array} data 参考echarts dataset.source
 * @prop {Object} options vue-echarts options
 * @prop {Object} initOptions vue-echarts initOptions
 * @prop {Array} colors  默认['#3984ff', '#cde1ff']
 * @prop {Boolean} area 是否区域填充 默认 false
 * @prop {Boolean} smooth 是否平滑曲线 默认 true
 * @prop {Boolean} autoResize 默认 true
 * @method $listeners 参考vue-echarts
*/
import AppChartBar from './src/main.vue'

export default AppChartBar

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(AppChartBar.name, AppChartBar)
}

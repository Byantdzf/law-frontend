<template>
	<e-charts
		:options="chartOptions" 
		:initOptions="initOptions"
		:group="group"
		:autoResize="autoResize"
		:watchShallow="watchShallow"
		:manualUpdate="manualUpdate"
		v-on="$listeners"
	/>
</template>

<script>
	import { isArray, isPlainObject } from 'lodash-es'
	import ECharts from 'vue-echarts/components/ECharts'
	import 'echarts/lib/chart/bar'
	import 'echarts/lib/component/legend'
	import 'echarts/lib/component/tooltip'
		export default {
		name: 'app-chart-bar',
		components: {
			ECharts
		},
		props: {
			data: [Array, Object],
			colors: {
				type: Array,
				default() {
					return ['#3984ff', '#cde1ff']
				}
			},
			area: Boolean,
			smooth: {
				type: Boolean,
				default: true
			},
			options: Object,
			initOptions: Object,
			group: String,
			autoResize: {
				type: Boolean,
				default: true
			},
			watchShallow: Boolean,
			manualUpdate: Boolean
		},
		computed: {
			chartOptions() {
				let d = {
					color: this.colors,
					backgroundColor:'#FFFFFF',
					legend: {},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					// dataset: {
					// 	source: this.data || []
					// },
					xAxis: {
						type: 'category',
						data: (this.data || []).map(v => v.x || ''),
						axisLabel: {
							color: '#666'
						},
						axisLine: {
							lineStyle: {
								color: '#f4f4f4'
							}
						},
						splitLine: {
							lineStyle: {
								color: '#f4f4f4'
							}
						}
					},
					yAxis: {
						type: 'value',
						axisLabel: {
							color: '#666'
						},
						axisLine: {
							lineStyle: {
								color: '#f4f4f4'
							}
						},
						splitLine: {
							lineStyle: {
								color: '#f4f4f4'
							}
						}
					},
					series: [
						{
							type: 'bar',
							data: (this.data || []).map(v => v.y || ''),
						}
					]
				}

				let opt = Object.assign({}, d, this.options)

				return opt
			}
		}
	}
</script>
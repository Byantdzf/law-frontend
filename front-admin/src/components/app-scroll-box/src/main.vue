<template>
	<el-row :class="['optiscroll', className]" :id="id">
		<slot></slot>
	</el-row>
</template>

<script>
	import './optiscroll.js'
	export default {
		name: 'app-scroll-box',
		data() {
			return {
				oScroll: null
			}
		},
		props: {
			id: {
				type: String,
				default: function() {
					return `app-scroll__${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`
				}
			},
			className: String,
			init: {
				type: Boolean,
				default: true
			},
			reset: [String, Boolean]
		},
		watch: {
			init: function(newval) {
				newval && this.initScroll()
			},
			reset: function() {
				this.initScroll()
			}
		},
		methods: {
			initScroll() {
				this.$nextTick(() => {
					const oPanelScroll = document.querySelector(`#${ this.id }`)

					this.destroyedScroll()
	
					if(oPanelScroll) {
						const Optiscroll = window.Optiscroll
						this.oScroll = new Optiscroll(oPanelScroll)
					}
				})
			},
			destroyedScroll() {
				if(this.oScroll) {
					this.oScroll.destroy()
					this.oScroll = null
				}
			}
		},
		mounted() {
			this.init && this.initScroll()
		},
		destroyed() {
			this.destroyedScroll()
		}
	}
</script>
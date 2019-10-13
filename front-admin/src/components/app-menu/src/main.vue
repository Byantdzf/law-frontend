<template>
	<el-menu
		class="app-menu"
		unique-opened
		:collapse="collapse"
		:default-active="activeMenuId"
	>
		<app-menu-item
			v-for="menu in menus"
			:key="menu.id"
			:menu="menu"
			:root="menu"
		/>
	</el-menu>
</template>

<script>
	import { Menu } from 'element-ui'
	import { isArray } from 'lodash-es'
	import { mapState } from 'vuex'
	import AppMenuItem from '@/components/app-menu-item'
	export default {
		name: 'app-menu',
		props: {
			collapse: Boolean
		},
		components: {
			[Menu.name]: Menu,
			AppMenuItem
		},
		computed: {
			menus() {
				return this.curNav ? this.curNav.children || [] : []
			},
			activeMenuId() {
				return String(this.curMenuId)
			},
			...mapState([
				"curMenuId",
				"curNav"
			])
		},
		watch: {
			$route: function() {
				this.setCurMenuId()
			}
		},
		methods: {
			setCurMenuId() {
				let _t = this
				let	menu = null
				let	path = this.$route.path;

				(function fn(arr) {
					let i = 0

					while (i < arr.length && !menu) {
						const url = arr[i].url ? arr[i].url.split('?')[0] : ''
						if (url == path) {
							menu = arr[i]

							_t.setState({
								curMenuId: menu.id,
								curMenuName: menu.name,
								saveStorage: true
							})

						} else if (isArray(arr[i].children)) {
							fn(arr[i].children)
						}

						i ++ 
					}
				})(this.menus)
			}
		}
	}
</script>
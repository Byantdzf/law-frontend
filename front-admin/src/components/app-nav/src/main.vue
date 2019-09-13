<template>
	<ul class="app-nav">
		<li
			v-for="(nav, index) in navList"
			:key="index"
			:class="['app-nav-item ib', { active: curNavId == nav.id }]"
			@click="handleItemClick(nav)"
		>
			<router-link :to="nav.url || ''">
				<i :class="['iconfont', `icon-${ nav.icon }`]" v-if="nav.icon"></i>
				<span class="nav-name">{{ nav.name }}</span>
			</router-link>
		</li>
	</ul>
</template>

<script>
	import { mapState } from 'vuex'
	import { treeToList } from '@/utils/tools'
	export default {
		name: 'app-nav',
		computed: {
			navList() {
				return this.navs.reduce((res, cur) => {
					cur.url = this.getUrl(cur)
					res.push(cur)
					return res
				}, [])
			},
			...mapState([
				"navs",
				"curNavId"
			])
		},
		watch: {
			$route: function() {
				this.setCurNavId()
			},
			navs() {
				this.setCurNavId()
			}
		},
		methods: {
			// 切换导航
			handleItemClick(nav) {
				this.$emit('change', nav)
			},
			// 获取导航url，如果本身没有设置值，则向子级取值
			getUrl(nav) {
				if (nav.url) {
					return nav.url
				} else {
					if (nav && nav.children[0]) {
						return this.getUrl(nav.children[0])
					} else {
						return ''
					}
				}
			},
			getUrlMap() {
				return (this.navs ||[]).reduce((res, cur) => {
					const key = cur.id
					const arr = treeToList([cur], [], 0)

					res[key] = arr.map(v => v.url ? v.url.split('?')[0] : '').filter(v => !!v)

					return res
				}, {})
			},
			// 设置当前导航的id
			setCurNavId() {
				const { path } = this.$route
				const urlMap = this.getUrlMap()
				for (let k in urlMap) {
					const paths = urlMap[k]
					if (paths.includes(path)) {
						this.setState({
							curNavId: k,
							saveStorage: true
						})
						this.navs.forEach(nav => {
							if (nav.id == k) {
								this.setState({ curNav: nav })
							}
						})
					}
				}
			}
		},
		created() {
			this.setCurNavId()
		}
	}
</script>

<style lang="less">
	.app-nav-item {
		margin-right: 1px;
		transition: background .3s;
		.iconfont {
			font-size: 16px;
			padding-right: 4px;
		}
		.nav-name {
			font-size: 14px;
		}
		& > a {
			display: block;
			padding: 0 18px;
			transition: color .3s;
		}
	}
</style>
<template>
	<el-menu-item 
    :index="String(menu.id)"
    @click="menuClick(menu)"
  >
    <router-link :to="menu.url || '/404'">
      <i :class="menu.icon"></i>
      <span>{{ menu.name }}</span>
    </router-link>
  </el-menu-item>
</template>

<script>
  import { MenuItem } from 'element-ui'
	export default {
    components: {
			[MenuItem.name]: MenuItem
		},
		props: {
			menu: {
        type: Object,
        required: true
      },
			root: {
        type: Object,
        required: true
      }
		},
		methods: {
			menuClick(menu) {
				this.$emit('itemClick', menu, this.root)
			}
    }
	}
</script>

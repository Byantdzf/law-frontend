<template>
	<el-submenu 
    :index="String(menu.id)"
    v-if="menu.children && menu.children.length"
    @click="menuClick(menu)"
  >
    <template slot="title">
      <i :class="menu.icon"></i>
      <span>{{ menu.name }}</span>
    </template>
    <template v-for="item in menu.children">
      <app-sub-menu
        v-if="item.children && item.children.length" 
        :menu="item"
        :root="root"
        :key="item.id"
        :index="String(menu.id)" 
        v-on="$listeners"
      />
      <el-menu-item
        v-else
        :key="item.id"  
        :index="String(item.id)"
        @click="menuClick(item)"
      >
        <router-link :to="item.url || '/404'">
          <i :class="item.icon"></i>
          <span>{{ item.name }}</span>
        </router-link>
      </el-menu-item>
    </template>
  </el-submenu>
</template>

<script>
  import { Submenu, MenuItem } from 'element-ui'
	export default {
    name: 'app-sub-menu',
    components: {
			[Submenu.name]: Submenu,
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
			menuClick(menu){
				this.$emit('itemClick', menu, this.root)
			}
		}
	}
</script>

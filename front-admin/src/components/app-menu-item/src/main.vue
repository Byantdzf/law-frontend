<template>
	<component 
    :is="componentName"
    :menu="menu"
		:root="menu"
    v-on="$listeners"
	/>
</template>

<script>
	import SubMenu from './sub-menu'
  import MenuItem from './menu-item'
	export default {
		name: 'app-menu-item',
		inheritAttrs: false,
		components: {
      SubMenu,
      MenuItem
    },
		props: {
			menu: {
				type: Object,
				required: true
			}
		},
		computed: {
      componentName() {
        let menu = this.menu || {}
        return menu.children && menu.children.length ? 'SubMenu' : 'MenuItem'
      }
    }
	}
</script>

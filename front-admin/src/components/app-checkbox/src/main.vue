
<template>
  <component 
    :is="componentName"
    v-bind="bindProps"
    v-on="$listeners"
  />
</template>

<script>
  import FormCheckbox from './checkbox.vue'
  import FormText from './text.vue'
	export default {
    name: 'app-checkbox',
    inheritAttrs: false,
    components: {
			FormCheckbox,
			FormText
		},
		props: {
      value: [String, Number, Array]
    },
    computed: {
      componentName() {
        let attrs = this.$attrs || {}
        let { readonly = false } = attrs
        
        return readonly ? 'FormText' : 'FormCheckbox'
      },
      bindProps() {
        return { ...this.$attrs, ...this.$props }
      }
    }
	}
</script>

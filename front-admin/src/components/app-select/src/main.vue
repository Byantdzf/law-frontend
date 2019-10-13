
<template>
  <component 
    :is="componentName"
    v-bind="bindProps"
    v-on="$listeners"
  />
</template>

<script>
  import FormSelect from './select.vue'
  import FormText from './text.vue'
	export default {
    name: 'app-input',
    components: {
			FormSelect,
			FormText
    },
    inheritAttrs: false,
		props: {
      value: [String, Number, Array]
    },
    computed: {
      componentName() {
        let $attrs = this.$attrs || {}
        let { readonly = false } = $attrs
        return readonly ? 'FormText' : FormSelect
      },
      bindProps() {
        return { ...this.$attrs, ...this.$props }
      }
    }
	}
</script>

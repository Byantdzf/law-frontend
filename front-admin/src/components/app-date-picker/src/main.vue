
<template>
  <component 
    :is="componentName"
    v-bind="bindProps"
    v-on="$listeners"
  />
</template>

<script>
  import FormDate from './date.vue'
  import FormText from './text.vue'
	export default {
    name: 'app-date-picker',
    components: {
			FormDate,
			FormText
    },
    inheritAttrs: false,
		props: {
      value: [String, Number, Array]
    },
    computed: {
      componentName() {
        let $attrs = this.$attrs || {},
            { readonly = false } = $attrs;
        return readonly ? 'FormText' : 'FormDate'
      },
      bindProps() {
        return { ...this.$attrs, ...this.$props }
      }
    }
	}
</script>


<template>
  <component 
    :is="componentName"
    v-bind="bindProps"
    v-on="$listeners"
  />
</template>

<script>
  import FormRadio from './radio.vue'
  import FormText from './text.vue'
	export default {
    name: 'app-radio',
    components: {
			FormRadio,
			FormText
    },
    inheritAttrs: false,
		props: {
      value: [String, Number]
    },
    computed: {
      componentName() {
        let $attrs = this.$attrs || {},
            { readonly = false } = $attrs;
        return readonly ? 'FormText' : 'FormRadio'
      },
      bindProps() {
        return { ...this.$attrs, ...this.$props }
      }
    }
	}
</script>

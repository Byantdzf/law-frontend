
<template>
  <component 
    :is="componentName"
    v-bind="bindProps"
    v-on="$listeners"
  />
</template>

<script>
  import FormTimeSelect from './time-select.vue'
  import FormTimePicker from './time-picker.vue'
  import FormText from './text.vue'
	export default {
    name: 'app-time',
    components: {
      FormTimeSelect,
      FormTimePicker,
			FormText
    },
    inheritAttrs: false,
		props: {
      value: [String, Date, Array]
    },
    computed: {
      componentName() {
        let $attrs = this.$attrs || {}
        let { readonly = false, timeType = 'select' } = $attrs
        
        return readonly ? 'FormText' : (timeType == 'select' ? 'FormTimeSelect' : 'FormTimePicker')
      },
      bindProps() {
        return { ...this.$attrs, ...this.$props }
      }
    }
	}
</script>

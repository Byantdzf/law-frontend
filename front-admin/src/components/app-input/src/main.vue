
<template>
  <component 
    :is="componentName"
    v-bind="bindProps"
    v-on="$listeners"
  />
</template>

<script>
  import { isFunction } from 'lodash-es'
  import FormInput from './input.vue'
  import FormAutocomplete from './autocomplete.vue'
  import FormText from './text.vue'
	export default {
    name: 'app-input',
    components: {
      FormInput,
      FormAutocomplete,
      FormText
    },
    inheritAttrs: false,
    props: {
      value: [String, Number, Object]
    },
    computed: {
      componentName() {
        let $attrs = this.$attrs || {},
            { 
              readonly = false, 
              fetchSuggestions
            } = $attrs
            
        return readonly ? 'FormText' : ( isFunction(fetchSuggestions) ? 'FormAutocomplete' : 'FormInput')
      },
      bindProps() {
        return { ...this.$attrs, ...this.$props }
      }
    }
	}
</script>

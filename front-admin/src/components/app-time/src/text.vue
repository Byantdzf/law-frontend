
<template>
  <div :class="['el-input readonly', `el-input--${ size || 'small' }`]">
    <span class="el-input__inner">{{ defaultValue }}</span>
  </div>
</template>

<script>
	export default {
    name: 'app-time-text',
    inheritAttrs: false,
		props: {
      value: [String, Number],
      size: String
    },
    data () {
      return {
        defaultValue: this.value
      }
    }
	}
</script>


<template>
  <div :class="['el-input readonly', `el-input--${ size || 'small' }`, defaultUnitValue ? 'el-input-group el-input-group--append' : '']">
    <span :class="['el-input__inner', { 'is-empty': !defaultValue && defaultValue !== 0 }]">{{ defaultValue || defaultValue === 0 ? defaultValue : '--' }}</span>
    <span class="el-input-group__append" v-if="defaultUnitValue">{{ defaultUnitValue }}</span>
  </div>
</template>

<script>
	export default {
    name: 'app-input-text',
    inheritAttrs: false,
		props: {
      value: [String, Number],
      unit: Object,
      size: String
    },
    data () {
      return {
        defaultValue: this.value || this.value === 0 ? this.value : '',
        defaultUnitValue: this.unit ? (this.unit.value || '') : ''
      }
    },
    watch: {
      // 监听value值变化
      value: {
        handler: function(newval) {
          this.defaultValue = newval || newval === 0 ? newval : ''
        },
        deep: true
      }
    }
	}
</script>


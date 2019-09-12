
<template>
  <el-time-select
    v-model="defaultValue"
    v-bind="bindProps"
    @input="handleEmit('change')"
    @blur="handleEmit('blur')"
    @focus="handleEmit('focus')"
  >
  </el-time-select>
</template>

<script>
  import Time from './time.js'
	export default {
    mixins: [Time]
	}
</script>

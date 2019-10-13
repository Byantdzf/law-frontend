<template>
  <el-switch
    v-model="defaultVal"
    active-color="#409EFF"
    inactive-color="#C0CCDA"
    :disabled="disabled"
    @change="handleChange"
  >
  </el-switch>
</template>

<script>
  export default {
    name: 'app-table-swtich',
    props: ['row', 'col', 'value', 'disabled'],
    data() {
      return {
        defaultVal: this.value
      }
    },
    watch: {
      value(nval) {
        this.defaultVal = nval
      }
    },
    methods: {
      handleChange(value) {
        this.$emit('change', {
          value,
          row: this.row,
          col: this.col
        })
      }
    }
  }
</script>


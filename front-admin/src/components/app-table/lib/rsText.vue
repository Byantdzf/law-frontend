<template>
  <el-tag size="small" :type="tagtype" disable-transitions>{{ text }}</el-tag>
</template>

<script>
import { isString, isFunction } from 'lodash-es'
export default {
	name: 'app-rs-text',
  props: ["row", "col", "type"],
  computed: {
    int() {
      return this.row[this.col.prop]
    },
    rs() {
      return this.col.rs || this.col.prop
    },
    text() {
      let str = ''
      if(!this.int && this.int != 0) {
        str = ''
      } else {
        str = this.$t(`rs.${ this.rs }.${ this.int }`)
      }
      return str
    },
    tagtype() {
      let str = '', type = this.col.type || this.type

      if(isString(type)) {
        str = type
      } else if(isFunction(type)) {
        str = type(this.row, this.col)
      }

      return str
    }
  }
};
</script>
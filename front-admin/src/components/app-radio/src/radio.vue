
<template>
  <el-radio-group
    v-model="defaultValue"
    :size="size"
    :disabled="disabled"
    @change="handleChange"
  >
    <el-radio
      v-for="opt in renderOptions"
      :key="opt.id"
      :disabled="opt.disabled"
      :border="opt.border || border"
      :label="opt.id"
      @click.native="$emit('click', opt)"
    >
      {{ getLabel(opt) }}
    </el-radio>
  </el-radio-group>
</template>

<script>
  import { isString, isNumber, isPlainObject, isFunction } from 'lodash-es'
	export default {
    name: 'app-radio',
    inheritAttrs: false,
		props: {
      row: Object,
      col: Object,
      options: [Array, Object],
      labelFormater: Function,
      value: [String, Number],
      field: String,
      size: String,
      disabled: Boolean,
      border: Boolean
    },
    data () {
      return {
        defaultValue: this.value
      }
    },
    computed: {
      renderOptions() {
        let arr = []

        if (isPlainObject(this.options)) {
          for (let k in this.options) {
            arr.push({
              id: isNumber(+k) ? +k : k,
              name: this.options[k]
            })
          }
        } else {
          arr = this.options.reduce((res, cur) => {
            if (isString(cur) || isNumber(cur)){
              res.push({
                id: cur,
                name: cur
              })
            } else if(isPlainObject(cur)) {
              res.push(cur)
            }
            return res
          }, [])
        }

        return arr
      }
    },
    watch: {
			value (newval) {
        this.defaultValue = newval
      }
		},
    methods: {
      handleChange(value) {
        this.$emit('change', { 
          value,
          field: this.field,
          row: this.row,
          col: this.col
        })
      },
      getLabel(item) {
        if (isFunction(item.formater)) {
          return item.formater(item)
        } else if(isFunction(this.labelFormater)) {
          return this.labelFormater(item)
        } else {
          return item.name
        }
      }
    }
	}
</script>

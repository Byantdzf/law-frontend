
<template>
  <el-checkbox-group  
    v-model="defaultValue"
    :size="size" 
    @change="handleChange"
  >
    <el-checkbox 
      v-for="opt in renderOptions" 
      :key="opt.id" 
      :disabled="opt.disabled"
      :label="opt.id">
      {{ getLabel(opt) }}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script>
  import { isArray, isString, isNumber, isPlainObject, isFunction } from 'lodash-es'
  import { str2arr } from '@/utils/tools'
	export default {
    name: 'app-checkbox',
    inheritAttrs: false,
		props: {
      row: Object,
      col: Object,
      options: [Array, Object],
      labelFormater: Function,
      value: [String, Number, Array],
      field: String,
      size: String
    },
    data () {
      return {
        defaultValue: isArray(this.value) ? this.value : str2arr(this.value)
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
        this.defaultValue = isArray(newval) ? newval : str2arr(newval)
      }
		},
    methods: {
      handleChange(value){
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
        } else if (isFunction(this.labelFormater)) {
          return this.labelFormater(item)
        } else {
          return item.name
        }
      }
    }
	}
</script>

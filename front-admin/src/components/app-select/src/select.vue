
<template>
  <el-select 
    v-model="defaultValue" 
    v-bind="bindProps"
    @change="handleChange"
    @click.native="handleClick"
    ref="appSelect"
  >
    <el-option 
      v-for="opt in renderOptions" 
      :key="opt.id" 
      :label="opt.name" 
      :value="opt.id"
      :disabled="opt.disabled" 
      v-html="getLabel(opt)"
    >
    </el-option>
  </el-select>
</template>

<script>
  import { isString, isNumber, isPlainObject, isFunction } from 'lodash-es'

	export default {
    name: 'app-select',
    inheritAttrs: false,
		props: {
      row: Object,
      col: Object,
      options: Array,
      labelFormater: Function,
      value: [String, Number, Array],
      field: String,
			placeholder: String,
      size: String,
      clearable: {
        type: Boolean,
        default: false
      },
      multiple: Boolean,
      disabled: Boolean,
      'popper-append-to-body': {
        type: Boolean,
        default: true
      },
      'popper-class': String
    },
    data () {
      return {
        defaultValue: this.value
      }
    },
    computed: {
      bindProps() {
        let bind = { ...this.$props }
        const dels = ['row', 'col', 'options', 'labelFormater', 'value']

        dels.forEach(key => {
          delete bind[key]
        })

        return bind
      },
      renderOptions() {
        let arr = this.options || []

        arr = arr.reduce((res, cur) => {
          if(isString(cur) || isNumber(cur)) {
            res.push({
              id: cur,
              name: cur
            })
          } else if(isPlainObject(cur)) {
            res.push(cur)
          }

          return res
        }, [])

        return arr
      }
    },
    watch: {
			value (newval) {
        this.defaultValue = newval
      }
		},
    methods: {
      getLabel(item) {
        if (isFunction(item.formater)) {
          return item.formater(item)
        } else if(isFunction(this.labelFormater)) {
          return this.labelFormater(item)
        } else {
          return item.name
        }
      },
      handleChange(value) {
        this.$emit('change', { 
          value,
          field: this.field,
          row: this.row,
          col: this.col
        })
      },
      handleClick() {
        this.$emit('click', { 
          value: this.value,
          field: this.field,
          row: this.row,
          col: this.col
        })
      },
      handleClose() {
        if(this.$refs.appSelect) {
          this.$refs.appSelect.handleClose()
        }
      }
    }
	}
</script>

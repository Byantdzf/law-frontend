
<template>
  <el-date-picker
    v-model="defaultValue"
    v-bind="bindProps"
    @change="handleEmit('change')"
    @blur="handleEmit('blur')"
    @focus="handleEmit('focus')"
  >
  </el-date-picker>
</template>

<script>
	export default {
    name: 'app-date-picker',
    inheritAttrs: false,
		props: {
      row: Object,
      col: Object,
      value: [String, Number, Array],
      field: [String, Array],
      placeholder: String,
      startPlaceholder: String,
      endPlaceholder: String,
      pickerOptions: Object,
      format: {
        type: String,
        default: 'yyyy-MM-dd'
      },
      valueFormat: {
        type: String,
        default: 'yyyy-MM-dd'
      },
      type: String,
      size: String,
      disabled: Boolean
    },
    data() {
      return {
        defaultValue: this.value || ''
      }
    },
    computed: {
      bindProps() {
        let props = { 
          ...this.$props, 
          pickerOptions: this.pickerOptionsComputed
        }
        delete props.row
        delete props.col
        delete props.field
        return props
      },
      pickerOptionsComputed() {
        let o = this.pickerOptions
        if(o) {
          return o
        }else {
          if(this.type == 'daterange' || this.type == 'datetimerange') {
            return {
              shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近一个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近半年',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近一年',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 360);
                  picker.$emit('pick', [start, end]);
                }
              }]
            }
          }else {
            return {}
          }
        }
      }
    },
    watch: {
			value (newval) {
        this.defaultValue = newval || '';
      }
		},
		methods: {
      handleEmit(type) {
        this.$emit(type, { 
          field: this.field,
          value: this.defaultValue,
          row: this.row,
          col: this.col
        })
      }
		}
	}
</script>

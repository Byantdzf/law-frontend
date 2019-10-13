export default {
  name: 'app-time',
  inheritAttrs: false,
  props: {
    row: Object,
    col: Object,
    value: [String, Date],
    field: String,
    placeholder: String,
    startPlaceholder: String,
    endPlaceholder: String,
    format: {
      type: String,
      default: 'hh:mm'
    },
    valueFormat: {
      type: String,
      default: 'hh:mm'
    },
    type: String,
    size: String
  },
  data() {
    return {
      defaultValue: this.value
    }
  },
  computed: {
    bindProps() {
      let props = { ...this.$props }
      delete props.row
      delete props.col
      delete props.field
      return props
    }
  },
  watch: {
    // 监听value值变化
    value (newval) {
      this.defaultValue = newval
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
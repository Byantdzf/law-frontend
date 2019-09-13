import { isString, isNumber, isArray, isPlainObject, isFunction } from 'lodash-es'

export default {
  components: {
    AppSelect: () => import('@/components/app-select')
  },
  name: 'app-input-input',
  inheritAttrs: false,
  props: {
    row: Object,
    col: Object,
    value: [String, Number, Object],
    prepend: [String, Number, Object],
    append: [String, Number, Object],
    field: [String, Array],
    placeholder: String,
    size: String,
    type: String,
    password: Boolean,
    number: Boolean,
    autocomplete: String,
    disabled: Boolean,
    idKey: {
      type: String,
      default: 'id'
    },
    nameKey: {
      type: String,
      default: 'name'
    },
    autosize: {
      type: Object,
      default: () => ({
        minRows: 2
      })
    }
  },
  data () {
    let val = this.value === 0 ? 0 : this.value || ''
    let resValue = isPlainObject(val) ? '' : val
    return {
      isReset: true,
      oldValue: val[this.idKey] || resValue,
      defaultValue: val[this.idKey] || resValue,
      prependValue: '',
      appendValue: '',
      elnid: `app-input__${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`,
      popperClass: `app-input-suggestions__${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`,
      oInput: null
    }
  },
  computed: {
    bindProps() {
      let { 
            placeholder, 
            type, 
            size,
            disabled,
            autosize,
            autocomplete
          } = this.$props

      type == 'input' && (type = 'text')

      this.password && (type = 'password')

      return { placeholder, type, size, disabled, autosize, autocomplete }
    }
  },
  watch: {
    // 监听value值变化
    value: {
      handler: function(nval) {
        let val = nval || nval === 0 ? nval : ''
        let rv = isPlainObject(val) ? '' : (val === 0 ? 0 : val || '')
        this.defaultValue = val[this.idKey] || rv
        this.oldValue = val[this.idKey] || rv
        this.showValue = val[this.nameKey] || rv
        this.queryString = val[this.nameKey] || rv
        
        if(this.isReset) {
          this.prependValue = this.getSlotValue(this.prepend)
          this.appendValue = this.getSlotValue(this.append)
        }

        this.isReset = true
      },
      deep: true
    }
  },
  methods: {
    // 是否下拉
    isSelectSlot(o) {
      if(
        isPlainObject(o) && 
        isArray(o.options) && 
        o.options.length > 1
      ) {
        return true
      }
      return false
    },
    // 获取prepend 或者 append值
    getSlotValue(o) {
      let val = ''
      if(isString(o) || isNumber(o)) {
        val = o
      }else if(isPlainObject(o)) {
        val = o.value || ''
      }
      return val
    },
    getSlotBindProps(o) {
      let bind = {}
      isPlainObject(o) && (bind = { ...o })
      delete bind.value
      return bind
    },
    handlePrependSelect({ value }) {
      let field = this.prepend.field || this.field + 'Prepend'
      this.prependValue = value
      this.changeEmit(field, value)
    },
    handleAppendSelect({ value }) {
      let field = this.append.field || this.field + 'Append'
      this.appendValue = value
      this.changeEmit(field, value)
    },
    // 输入框输入事件
    handleInput() {

      this.fixInputVal()

      if(this.oldValue != this.defaultValue) {
        this.isReset = false
        this.oldValue = this.defaultValue
        this.changeEmit(this.field, this.defaultValue)
      }

    },
    // number类型自动修复输入内容
    fixInputVal() {
      if(this.number) {
        let str = isNumber(this.defaultValue) ? String(this.defaultValue) : this.defaultValue || ''
        if (/[^\d]/.test(str)) {
          //替换非数字字符  
          let temp_amount = str.replace(/[^\d.]/g, '')
          // 只能出现一个点
          let re = str.split('.')
          if (re.length > 2) {
            temp_amount = temp_amount.substr(0, str.length - 1)
          }
          this.defaultValue = temp_amount
        }
      }
    },
    // input失去焦点
    handleBlur() {
      if(this.number) {
        
        this.fixInputVal()

        let str = isNumber(this.defaultValue) ? String(this.defaultValue) : this.defaultValue || '', 
            lastStr = str.charAt(str.length - 1),
            firstStr = str.charAt(0);
        // 如果最后一位是 . 则删除
        if (lastStr == '.') {
          str = str.substr(0, str.length - 1)
        }
        // 如果第一位是 . 则加 0
        if (firstStr == '.') {
          str = '0' + str
        }

        // 去除数字中的连续 .
        let c, cc = str.match(/(.)\1+/g)
        // 如果有连续的 . 删除多余的，只保留一个.
        if (cc) {
          for (var i = 0; i < cc.length; i++) {
            c = cc[i].substring(0, 1)
            if (c == '.') {
              str = str.replace(cc[i], c)
            }
          }
        }

        this.defaultValue = str
        
      }  
      if(this.oldValue != this.defaultValue){
        this.isReset = false
        this.oldValue = this.defaultValue
      }

      this.$emit('blur', this.blurPayload)
      
      isFunction(this.afterBlurFunc) && this.afterBlurFunc()
      
    },
    // input聚焦事件
    handleFocus() {
      this.$emit('focus', { 
        value: this.value,
        field: this.field,
        row: this.row,
        col: this.col
      })

      isFunction(this.afterFocusFunc) && this.afterFocusFunc()
      
    },
    // value改变触发事件
    changeEmit(field, value) {
      this.$emit('change', { ...this.changePayload, field, value })
    },
    // 监听键盘keyup事件
    inputBindKeyup() {
      const _t = this
      const pageInput = document.querySelector(`#${this.elnid}`)

      if (pageInput) {
        pageInput.onkeyup = function () {
          let val = _t.defaultValue
          this.value = ''
          this.value = val
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.oInput = this.$refs.appInput
      this.prependValue = this.getSlotValue(this.prepend)
      this.appendValue = this.getSlotValue(this.append)
      this.number && this.inputBindKeyup()
    })
  }
}

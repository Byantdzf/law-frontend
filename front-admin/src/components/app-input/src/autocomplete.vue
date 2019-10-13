
<template>
  <el-autocomplete
    :id="elnid"
    v-model="showValue" 
    v-bind="selfBindProps"
    @blur="handleBlur"
    @focus="handleFocus"
    @input="handleInput"
    @select="handleSelect"
    ref="appInput"
  >
    <template slot-scope="{ item }">
      <div class="con" v-html="getConHtml(item)"></div>
    </template>
    <template slot="prepend" v-if="prepend">
      <app-select 
        v-if="isSelectSlot(prepend)"
        v-model="prependValue"
        v-bind="getSlotBindProps(prepend)"
        @change="handlePrependSelect"
      />
      <span v-else>{{ prependValue }}</span>
    </template>
    <template slot="append" v-if="append">
      <app-select 
        v-if="isSelectSlot(append)"
        v-model="appendValue"
        v-bind="getSlotBindProps(append)"
        @change="handleAppendSelect"
      />
      <span v-else>{{ appendValue }}</span>
    </template>
  </el-autocomplete>
</template>

<script>
  import { Autocomplete } from 'element-ui'
  import { isPlainObject, isBoolean, isFunction } from 'lodash-es'
  import Base from './base.js'

	export default {
    components: {
			[Autocomplete.name]: Autocomplete
		},
    mixins: [Base],
    props: {
      triggerOnFocus: Boolean,
      fetchSuggestions: Function,
      nameFormater: Function,
      autofill: [Boolean, Number]
    },
    data() {
      let val = this.value === 0 ? 0 : this.value || ''
      let resValue = isPlainObject(val) ? '' : val
      return {
        // autocomplete 用于展示的value
        showValue: val[this.nameKey] || resValue,
        queryString: val[this.nameKey] || resValue,
        isSelectFlag: false,
        selectBox: null,
        selectItems: []
      }
    },
    computed: {
      selfBindProps() {
        return {
          ...this.bindProps,
          valueKey: this.nameKey,
          popperClass: this.popperClass,
          triggerOnFocus: this.triggerOnFocus,
          fetchSuggestions: this.fetchSuggestions
        }
      },
      suggestions() {
        return this.oInput ? this.oInput.suggestions : []
      },
      blurPayload() {
        return {
          queryString: this.showValue, 
          suggestions: this.suggestions,
          value: this.value,
          field: this.field,
          row: this.row,
          col: this.col
        }
      },
      changePayload() {
        return {
          queryString: this.showValue, 
          suggestions: this.suggestions,
          row: this.row,
          col: this.col
        }
      }
    },
    watch: {
      suggestions: function(newval) {
        if(newval.length > 0) {
          this.$nextTick(() => {
            this.selectItems = this.selectBox.querySelectorAll('li')
          })
        }
      }
    },
    methods: {
      // 自定义内容
      getConHtml(item) {
        if (isFunction(this.nameFormater)) {
          return this.nameFormater(item)
        }

        return item[this.nameKey]
      },
      // autocomplete 下拉选中
      handleSelect(value) {
        if(this.oldValue != value[this.idKey]) {
          this.oldValue = value[this.idKey]
          this.defaultValue = value[this.idKey]
          this.showValue = value[this.nameKey]
          this.queryString = value[this.nameKey]
          this.changeEmit(this.field, value)
        }
        this.$emit('select', { 
          value,
          queryString: this.queryString,
          suggestions: this.suggestions,
          field: this.field,
          row: this.row,
          col: this.col
        })
      },
      afterFocusFunc() {
        this.selectBox = document.querySelector(`.${ this.popperClass } ul`)
        if(this.autofill && this.selectBox) {
          this.selectBox.addEventListener('mouseover', this.selectMouseover)
          this.selectBox.addEventListener('mouseleave', this.selectMouseleave)
        }
      },
      afterBlurFunc() {
        if(this.queryString !== this.showValue) {
          // autofill {Boolean|Number = 0} 存在匹配项时，无select事件，取第一项， 无匹配项时，总会清空输入框
          // autofill {Number} 1: 存在匹配项时，无select事件，输入值等于第一项则取第一项， 无匹配项时，不会清空输入框
          if(this.autofill && !this.isSelectFlag) {
            let flag = isBoolean(this.autofill) ? 0 : this.autofill

            if(this.showValue && this.suggestions.length > 0) {
              if(flag === 0) {
                this.changeEmit(this.field, this.suggestions[0])
              }else if(flag === 1) {
                let value = this.suggestions[0][this.nameKey] === this.showValue ? this.suggestions[0] : {
                  [this.nameKey]: this.showValue
                }
                this.changeEmit(this.field, value)
              }
            }
            if(!this.showValue || this.suggestions.length == 0) {
              if(!this.showValue || flag === 0) {
                this.changeEmit(this.field, {})
              }else {
                this.changeEmit(this.field, {
                  [this.nameKey]: this.showValue
                })
              }
            }
          }else {
            if(!this.showValue || this.suggestions.length == 0) {
              this.changeEmit(this.field, {
                [this.nameKey]: this.showValue
              })
            }
          }
          if(this.selectBox) {
            this.selectBox.removeEventListener('mouseover', this.selectMouseover)
            this.selectBox.removeEventListener('mouseleave', this.selectMouseleave)
          }
          this.queryString = this.showValue
          this.isSelectFlag = false
        }
      },
      // 鼠标经过下拉框事件
      selectMouseover() {
        this.isSelectFlag = true
      },
      // 鼠标移出下拉框事件
      selectMouseleave() {
        this.isSelectFlag = false
      }
    },
    destroyed () {
      if(this.selectBox) {
        this.selectBox.removeEventListener('mouseover', this.selectMouseover)
        this.selectBox.removeEventListener('mouseleave', this.selectMouseleave)
        this.selectBox = null
        this.selectItems = []
      }
    }
	}
</script>

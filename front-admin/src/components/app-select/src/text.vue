
<template>
  <div :class="['el-input readonly', `el-input--${ size || 'small' }`]" @click="handleClick">
    <span :class="['el-input__inner', { 'is-empty': !labels.length }]" v-if="multiple">
      <template v-if="labels.length">
        <span class="tag" v-for="(label, index) in labels" :key="index">{{ label }}</span>
      </template>
      <template v-else>--</template>
    </span>
    <span :class="['el-input__inner', { 'is-empty': !label && label !== 0 }]" v-else>{{ label || '--' }}</span>
  </div>
</template>

<script>
  import { isArray, isString, isNumber, isPlainObject } from 'lodash-es'
  import { arr2map } from '@/utils/tools'

	export default {
    name: 'app-select-text',
    inheritAttrs: false,
		props: {
      value: [String, Number, Array],
      options: Array,
      multiple: Boolean,
      size: String
    },
    computed: {
      items() {
        return (this.options || []).reduce((res, cur) => {
          if(isString(cur) || isNumber(cur)) {
            res.push({
              label: cur,
              value: cur
            })
          } else if(isPlainObject(cur)) {
            res.push(cur)
          }

          return res
        }, [])
      },
      optMap() {
        return arr2map(this.items, 'value')
      },
      label() {
        
        let cur = this.optMap[this.value] || {}

        return this.getVal(cur.label) || this.getVal(this.value)
      },
      labels() {
        if (isArray(this.value) || isString(this.value)) {
          let vals = []

          if (isArray(this.value)) {
            if (this.value.every(v => isPlainObject(v))) {
              vals = this.value.map(v => v.label)
            } else {
              vals = this.value
            }

          } else {
            vals = this.value.split(',')
          }
          
          return this.items.filter(v => vals.includes(v.value)).map(v => v.label)
        } else {
          return this.items.filter(v => v.value == this.value).map(v => v.label)
        }
      }
    },
    methods: {
      getVal(val) {
        return val || val === 0 ? val : ''
      },
      handleClick() {
        let params = {
          value: this.value,
          options: this.options,
        }
        if (this.multiple) {
          params.labels = this.labels
        } else {
          params.label = this.label
        }
        this.$emit('click', params)
      }
    }
	}
</script>

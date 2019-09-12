
<template>
  <div :class="['el-radio-group readonly', `el-checkbox-group--${ size || 'small' }`]">
    <label class="el-radio">
      <span class="el-radio__label">{{ val2label }}</span>
    </label>
  </div>
</template>

<script>
  import { cloneDeep, isString, isNumber, isPlainObject } from 'lodash-es'
  import { arr2map } from '@/utils/tools'
	export default {
    name: 'app-radio-text',
    inheritAttrs: false,
		props: {
      value: [String, Number],
      options: Array,
      size: String
    },
    computed: {
      val2label() {
        let opt = (cloneDeep(this.options) || []).reduce((res, cur) => {
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
        
        let opt2map = arr2map(opt, 'value')
        let curOpt = opt2map[this.value] || {}

        return curOpt.label || String(this.value) || ''
      }
    }
	}
</script>

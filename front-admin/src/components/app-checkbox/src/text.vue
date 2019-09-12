
<template>
  <div :class="['el-checkbox-group readonly', `el-checkbox-group--${ size || 'small' }`]">
    <label class="el-checkbox" v-for="v in value" :key="v">
      <span class="el-checkbox__label">{{ val2label(v) }}</span>
    </label>
  </div>
</template>

<script>
  import { cloneDeep, isString, isNumber, isPlainObject } from 'lodash-es'
  import { arr2map } from '@/utils/tools'
	export default {
    name: 'app-checkbox-text',
    inheritAttrs: false,
		props: {
      value: [String, Number, Array],
      options: Array,
      size: String
    },
    methods: {
      val2label(item) {
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
            }, []),
            opt2map = arr2map(opt, 'value'),
            curOpt = opt2map[item] || {};
        return curOpt.label || String(item) || ''
      }
    }
	}
</script>

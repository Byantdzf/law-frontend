<template>
	<el-row>
    <template v-for="(item, index) in renderItems">
      <span
        v-if="separators[index]"
        class="el-form-item__label separator" 
        :key="'separator_' + index"
      >
        {{ separators[index] }}
      </span>
      <component
        :key="index" 
        :is="getFormItemComponent(item)"
        v-bind="getBindProps(item, index)"
        v-on="item.on"
        @change="itemChange"
      />
    </template>
  </el-row>
</template>

<script>
  import { isString, isNumber, isArray } from 'lodash-es'
  import Components from '../src/components.js'

	export default {
    name: 'app-multi-item',
    mixins: [Components],
		props: {
      field: [String, Array],
      value: [String, Number, Array],
      row: Object,
      col: Object,
      size: String,
      type: String,
      show: Boolean,
      index: [String, Number],
      items: Array,
      separator: [Array, String],
      dataType: {
        type: String,
        default: 'array'
      }
		},
		data() {
			return {
        form: {}
			}
		},
		computed: {
			separators() {
        let arr = []
        if(isString(this.separator)) {
          arr = this.separator.split(',')
        }else {
          arr = this.separator
        }
        return arr
      },
      renderItems() {
        return this.items.map(v => {
          v.size = v.size || this.size

					v.type = this.formTypeMaps[v.type] || v.type || 'txt'

					!v.hasOwnProperty('show') && (v.show = true)

					isNumber(v.field) && (v.field = String(v.field))

					isArray(v.field) && (v.value = v.value || [])

					return v
        })
      }
		},
		methods: {
			// 表单item获取绑定参数
			getBindProps(node, index) {
				let props = { ...node, index }
				delete props.label
				delete props.component
				delete props.itemWidth
				return props
      },
      itemChange({ field, value }) {
        
        this.form[field] = value

        let payload = {
          field: this.field,
          row: this.row,
          col: this.col,
          index: this.index
        }

        let arr, fields

        if(isString(this.field)) {
          fields = this.field.split(',')
        }else if(isArray(this.field)) {
          fields = this.field
        }
        if(this.dataType == 'array') {
          arr = fields.map(k => this.form[k])
        }

        payload.value = arr

        this.$emit('change', payload)
      }
		}
	}
</script>

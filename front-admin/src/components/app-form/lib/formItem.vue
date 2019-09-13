<template>
	<el-form-item 
    v-if="item.show"
    :class="[`app-form-item__${ item.type }`, item.class]"
    :label="item.label || ''"
    :label-width="item.labelWidth"
    :style="`width:${ item.itemWidth || config.itemWidth };`"
  >
    <template v-if="item.children && item.children.length">
      <app-form-item 
        v-for="(v, idx) in item.children"
        :key="idx"
        :row="v"
        :index="idx"
        :form="form"
        :config="config"
        @change="formItemChange"
      />
    </template>
    <template v-else>
      <keep-alive>
        <component 
          :is="getFormItemComponent(item)"
          v-model="form[item.field]"
          v-bind="getBindProps(item, index)"
          v-on="item.on"
          @change="formItemChange"
        />
      </keep-alive>
    </template>
  </el-form-item>
</template>

<script>
  import { isNumber, isArray } from 'lodash-es'
  import Components from '../src/components.js'

	export default {
    name: 'app-form-item',
    mixins: [Components],
		props: {
      row: Object,
      index: [String, Number],
      form: {
        type: Object,
        default: () => ({})
      },
      config: {
        type: Object,
        default: () => ({})
      }
		},
		computed: {
			item() {
        let it = this.row

        it.size = it.size || this.config.size

        it.type = this.formTypeMaps[it.type] || it.type || 'txt'

        !it.hasOwnProperty('show') && (it.show = true)

        isNumber(it.field) && (it.field = String(it.field))

        isArray(it.field) && (it.value = it.value || [])

        return it
      }
		},
		methods: {
			// 表单item获取绑定参数
			getBindProps(node, index){
				let props = { ...node, index }
				delete props.form
				delete props.config
				delete props.label
				delete props.value
				delete props.component
				delete props.itemWidth
				return props
      },
      formItemChange(data) {
        this.$emit('change', data)
      }
		}
	}
</script>

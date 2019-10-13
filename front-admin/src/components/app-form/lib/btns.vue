<template>
  <el-row class="form-inline-btns">
    <el-button 
      v-for="(btn, index) in defaultValue" 
      :size="size || 'small'" 
      :key="index"
      :plain="plain"
      :disabled="btn.disabled"
    >
      {{ btn.text }}
      <i class="el-icon-close" v-if="btn.showDelete" @click.stop="handleDelete(btn)"></i>
    </el-button>
  </el-row>
</template>

<script>
  import { isPlainObject } from 'lodash-es'

	export default {
    name: 'form-buttons',
		props: {
      items: {
        type: Array,
        default () {
          return []
        }
      },
      formKey: String,
      plain: {
        type: Boolean,
        default: true
      },
      showDelete: {
        type: Boolean,
        default: true
      },
      size: String
    },
    data() {
      return {
        defaultValue: []
      }
    },
    mounted() {
      this.items && this.items.length && this.initItems()
    },
		methods: {
			handleDelete(btn) {

        if(btn.disabled) return

        this.defaultValue = this.defaultValue.filter(v => {
          return v.text !== btn.text
        })
      },
      initItems() {
        let arr = this.items || []

        this.defaultValue = arr.reduce((res, cur) => {
          let showDelete = ('undefined' == typeof cur.showDelete ? this.showDelete : cur.showDelete)

          let { 
            text = cur, 
            disabled = false
          } = cur

          let obj = isPlainObject(cur) ? cur : {}

          res.push({ ...obj, text, disabled, showDelete })

          return res
        },[])
      }
		},
		watch: {
			items() {
        this.initItems()
      },
      defaultValue(newval) {
        this.$emit('change', { 
          key: this.formKey,
          value: newval
        })
      }
		}
	}
</script>
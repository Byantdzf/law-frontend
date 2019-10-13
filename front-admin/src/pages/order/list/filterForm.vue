<template>
  <app-form
    class="app-dialog-form filter-form"
    ref="appForm"
    :init="formInit"
    :items="formItems"
    :btns="formBtns"
    :resave="formResave"
    @confirm="formSubmit"
    @reset="formReset"
  />
</template>

<script>
import { mapActions } from 'vuex'
import AppForm from '@/mixins/form'
export default {
  mixins: [AppForm],
  props: {
    row: Object
  },
  watch: {
    row: {
      handler: function(newval) {
        this.initForm(newval)
      },
      deep: true
    }
  },
  methods: {
    initForm(form) {
      const osMap = this.$t('rs.orderSource')
      let row = { ...form }
      let orderSources = [
        {
          id: 0,
          name: '全部'
        }
      ]

      for (let k in osMap) {
        orderSources.push({
          id: +k,
          name: osMap[k]
        })
      }

      this.formResave = true

      this.$set(this.formInit, 'labelWidth', '100px')
      
      this.formItems = [
        {
          itemWidth: '33.3333%',
          label: '订单号：',
          field: 'orderNo',
          placeholder: '订单编号',
          type: 1,
          value: row.orderNo
        },
        {
          itemWidth: '33.3333%',
          label: '下单商户：',
          field: 'tenantId|id',
          placeholder: '模糊搜索',
          type: 1,
          value: row.tenantId,
          fetchSuggestions: (value, cb) => {
            const name = value.trim()
            let params = {}

            if (!name) {
              cb([])
              return false
            } else {
              params.name = name
            }

            this.tenantGetKV(params).then(res => {
              cb(res.data || [])
            }).catch(() => {
              cb([])
            })
          }
        },
        {
          itemWidth: '33.3333%',
          label: '供应商户：',
          field: 'tenantId|id',
          placeholder: '模糊搜索',
          type: 1,
          fetchSuggestions: (value, cb) => {
            const name = value.trim()
            let params = {}

            if (!name) {
              cb([])
              return false
            } else {
              params.name = name
            }

            this.tenantGetKV(params).then(res => {
              cb(res.data || [])
            }).catch(() => {
              cb([])
            })
          }
        },
        {
          itemWidth: '33.3333%',
          label: '下单时间：',
          field: 'registerTime',
          type: 7,
          value: row.registerTime || '',
          placeholder: '请选择时间'
        },
        {
          itemWidth: '33.3333%',
          label: '出行时间：',
          field: 'registerTime',
          type: 7,
          value: row.registerTime || '',
          placeholder: '请选择时间'
        },
        {
          label: '订单来源：',
          field: 'registerTime',
          type: 4,
          value: [],
          options: orderSources
        }
      ]

      this.formBtns = [{
        label: '确认',
        code: 'confirm'
      }, {
        label: '重置',
        code: 'reset'
      }]

      this.formResaveDone()
      
    },
    // 表单提交
    formSubmit(form) {
      this.$emit('submit', form)
    },
    formReset() {
      this.initForm()
    },
    ...mapActions('tenant', ['tenantGetKV', 'tenantLevelGetKV'])
  },
  mounted() {
    this.initForm(this.row)
  }
}

</script>

<style lang="less">
  .filter-form {
    .el-form-item {
      padding: 0 10px;
    }
    .el-form-item__label {
      width: auto !important;
    }
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
</style>

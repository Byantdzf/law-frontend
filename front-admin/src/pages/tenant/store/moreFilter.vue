<template>
  <app-form
    class="app-dialog-form filter-form"
    :init="formInit"
    :items="formItems"
    :btns="formBtns"
    :resave="formResave"
    @confirm="formSubmit"
    @reset="formReset"
    ref="appForm"
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
      let row = { ...form }
      const tenantTypeMap = this.$t('rs.tenantType')
      let tenantTypeOptions = []

      for (let k in tenantTypeMap) {
        tenantTypeOptions.push({
          id: +k,
          name: tenantTypeMap[k]
        })
      }

      this.formResave = true

      this.$set(this.formInit, 'labelWidth', '100px')
      this.$set(this.formInit, 'labelWidth', '100px')
      
      this.formItems = [
        {
          itemWidth: '33.3333%',
          label: '商户账号：',
          field: 'tenantNo',
          placeholder: '商户账号/ID',
          type: 1,
          value: row.tenantNo
        },
        {
          itemWidth: '33.3333%',
          label: '商户名称：',
          field: 'tenant',
          placeholder: '模糊搜索',
          type: 1,
          value: row.tenant,
          fetchSuggestions: (value, cb) => {
            const name = value.trim()
            const tenantType = this.tenantType
            let params = {}

            if (!name) {
              cb([])
              return false
            } else {
              params.name = name
              if (tenantType) {
                params.tenantType = tenantType
              }
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
          label: '商户类别：',
          field: 'tenantType',
          type: 2,
          value: 6,
          options: tenantTypeOptions,
          disabled: true
        },
        {
          itemWidth: '33.3333%',
          label: '商户来源：',
          field: 'tenantSource',
          type: 2,
          value: row.tenantSource,
          clearable: true,
          options: [
            {
              id: 1,
              name: '自建'
            },
            {
              id: 2,
              name: '注册'
            }
          ]
        },
        {
          itemWidth: '33.3333%',
          label: '商户等级：',
          field: 'tenantLevel',
          type: 2,
          value: row.tenantLevel,
          clearable: true
        },
        {
          itemWidth: '33.3333%',
          label: '注册时间：',
          field: 'registerTime',
          type: 7,
          value: row.registerTime || '',
          placeholder: '请选择时间'
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
      this.initForm({})
    },
    ...mapActions('tenant', ['tenantGetKV', 'tenantLevelGetKV'])
  },
  mounted() {
    this.initForm(this.row)
    this.tenantLevelGetKV().then(res => {
      let levels = res.data || []
      if (levels.length) {
        let val = ''
        if (this.row.tenantLevel) {
          levels.forEach(v => {
            if (v.name == this.row.tenantLevel) {
              val = v.id
            }
          })
        }
        this.updateFormItem('tenantLevel', 'options', levels)
        this.updateFormItem('tenantLevel', 'value', val)
      }
    })
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

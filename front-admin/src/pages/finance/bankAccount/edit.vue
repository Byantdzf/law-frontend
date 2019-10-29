<template>
  <app-form
    class="app-dialog-form"
    ref="appForm"
    :init="formInit"
    :items="formItems"
    :btns="formBtns"
    :resave="formResave"
    @confirm="formSubmit"
  />
</template>

<script>
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

      this.formResave = true

      this.$set(this.formInit, 'labelWidth', '100px')
      
      this.formItems = [
        {
          label: '账户名称',
          field: 'name',
          type: 1,
          value: row.name,
          required: true
        },
        {
          label: '账户名',
          field: 'accountName',
          type: 1,
          value: row.accountName,
          required: true
        },
        {
          label: '账户号',
          field: 'accountNumber',
          type: 1,
          value: row.accountNumber,
          required: true
        },
        {
          label: '银行',
          field: 'bank',
          type: 1,
          value: row.bank,
          required: true
        },
        {
          label: '支行/分行',
          field: 'branch',
          type: 1,
          value: row.branch,
          required: true
        },
        {
          label: '银行地址',
          field: 'bankAddress',
          type: 1,
          value: row.bankAddress
        },
        {
          label: '银行电话',
          field: 'bankPhone',
          type: 1,
          value: row.bankPhone
        },
        {
          label: '银行传真',
          field: 'bankFax',
          type: 1,
          value: row.bankFax
        },
        {
          label: 'Swift-code',
          field: 'swiftCode',
          type: 1,
          value: row.swiftCode
        },
        {
          label: '备注',
          field: 'remark',
          type: 5,
          value: row.remark
        },
        {
          label: '状态',
          field: 'status',
          type: 3,
          value: row.status || 1,
          options: [
            {
              id: 1,
              name: '启用'
            },{
              id: 2,
              name: '禁用'
            }
          ]
        }
      ]

      this.formResaveDone()
    },
    // 表单提交
    formSubmit(form) {
      // console.log(form)
      let params = { ...form }
      if(this.row && this.row.hasOwnProperty('id')) {
        params.id = this.row.id
      }
      this.$emit('submit', params)
    }
  },
  mounted() {
    this.initForm(this.row)
  }
}

</script>

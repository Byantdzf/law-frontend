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

      this.$set(this.formInit, 'labelWidth', '140px')
      
      this.formItems = [
        {
          label: '授信额度',
          field: 'creditAmount',
          type: 1,
          value: row.creditAmount,
          required: true,
          number: true,
          on: {
            change: ({ value }) => {
              this.updateFormItem('availableAmount', 'value', value - row.usedAmount)
            }
          }
        },
        {
          label: '未结订单占用额度',
          field: 'usedAmount',
          type: 1,
          value: row.usedAmount,
          readonly: true
        },
        {
          label: '剩余额度',
          field: 'availableAmount',
          type: 1,
          value: row.availableAmount,
          readonly: true
        }
      ]

      this.formResaveDone()
    },
    // 表单提交
    formSubmit(form) {
      let params = {
        tenantId: this.row.tenantId,
        money: form.creditAmount
      }

      this.$emit('submit', params)
    }
  },
  mounted() {
    this.initForm(this.row)
  }
}

</script>

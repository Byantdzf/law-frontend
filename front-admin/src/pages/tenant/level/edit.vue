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
          label: '商户等级名称',
          field: 'name',
          type: 1,
          value: row.name,
          required: true
        },
        {
          label: '成长值满足点',
          field: 'growingValue',
          type: 1,
          value: row.growingValue,
          required: true,
          number: true
        },
        {
          label: '奖励成长',
          field: 'growingAward',
          type: 1,
          value: row.growingAward,
          required: true,
          number: true
        },
        {
          label: '奖励订单',
          field: 'orderAward',
          type: 1,
          value: row.orderAward,
          required: true,
          number: true
        },
        {
          label: '备注',
          field: 'remark',
          type: 5,
          value: row.remark
        },
        {
          label: '设为默认',
          field: 'defaultTenant',
          type: 3,
          value: row.defaultTenant || 2,
          options: [
            {
              id: 1,
              name: '是'
            },{
              id: 2,
              name: '否'
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

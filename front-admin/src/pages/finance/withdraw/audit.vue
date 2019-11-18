<template>
  <app-form
    class="app-dialog-form"
    ref="appForm"
    :init="formInit"
    :items="formItems"
    :btns="formBtns"
    :resave="formResave"
    @confirm="formSubmit"
    @refuse="formRefuse"
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
      
      this.formBtns = [
        {
          label: "审核通过",
          code: "confirm",
          size: "large"
        },
        {
          label: "审核不通过",
          code: "refuse",
          type: "danger",
          size: "large"
        }
      ];
      
      let row = { ...form }

      this.formResave = true

      this.$set(this.formInit, 'labelWidth', '100px')
      
      this.formItems = [
        {
          label: '备注',
          field: 'remark',
          type: 5,
          value: row.remark
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
      params.actionType = 'submit'
      this.$emit('submit', params)
    },
    formRefuse(form) {
      let params = { ...form }
      if(this.row && this.row.hasOwnProperty('id')) {
        params.id = this.row.id
      }
      params.actionType = 'refuse'
      this.$emit('submit', params)
    }
  },
  mounted() {
    this.initForm(this.row)
  }
}

</script>

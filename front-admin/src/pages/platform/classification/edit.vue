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
          label: '编码',
          field: 'code',
          type: 1,
          value: row.code,
          required: true,
        },
        {
          label: '分类',
          field: 'categoryName',
          type: 1,
          value: row.categoryName,
          required: true,
          placeholder: '100字符内'
        },
        {
          label: '显示状态',
          field: 'isDisable',
          type: 3,
          value: row.isDisable == 1 ? +row.isDisable : 0,
          options: this.$t('rs.status2')
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

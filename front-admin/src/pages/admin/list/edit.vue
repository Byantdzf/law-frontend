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
          label: '账号',
          field: 'userName',
          type: 1,
          value: row.userName,
          placeholder: '字母、下划线，不可修改',
          required: true
        },
        {
          label: '登录密码',
          field: 'password',
          type: 6,
          value: row.password,
          required: true
        },
        {
          label: '确认密码',
          field: 'passwordConfirm',
          type: 6,
          value: row.passwordConfirm,
          required: true
        },
        {
          label: '角色选择',
          field: 'roleId',
          type: 2,
          value: row.roleId,
          options: []
        },
        {
          label: '姓名',
          field: 'realName',
          type: 1,
          value: row.realName,
        },
        {
          label: '手机',
          field: 'phone',
          type: 1,
          value: row.phone,
          number: true
        },
        {
          label: '邮箱',
          field: 'email',
          type: 1,
          value: row.email
        },
        {
          label: '备注',
          field: 'remark',
          type: 5,
          value: row.remark
        },
        {
          label: '启用状态',
          field: 'isDisable',
          type: 3,
          value: row.isDisable || 0,
          options: this.$t('rs.isDisable')
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

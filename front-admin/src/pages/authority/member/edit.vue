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
          label: '用户名',
          field: 'account',
          type: 1,
          maxlength: 64,
          value: row.account,
          required: true,
          disabled: !!row.id
        },
        {
          label: '成员姓名',
          field: 'name',
          type: 1,
          value: row.name,
          maxlength: 64,
          required: true
        },
        {
          label: '邮箱地址',
          field: 'email',
          type: 1,
          maxlength: 64,
          value: row.email,
          required: true
        },
        // {
        //   label: '登录密码',
        //   field: 'password',
        //   type: 6,
        //   maxlength: 64,
        //   value: '',
        //   required: !row.id,
        //   show: !row.id
        // },
        // {
        //   label: '确认密码',
        //   field: 'resPassword',
        //   type: 6,
        //   maxlength: 64,
        //   value: '',
        //   required: !row.id,
        //   show: !row.id
        // },
        {
          label: '备注信息',
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
      let params = { ...form }
      if(this.row && this.row.hasOwnProperty('id')) {
        params.id = this.row.id
        // delete params.password
      } else {
        // const { password, resPassword } = params
        // if (password !== resPassword) {
        //   this.$msgError('两次密码输入不一致')
        //   return false
        // }
      }
      params.password = '666666'
      // delete params.resPassword
      this.$emit('submit', params)
    }
  },
  mounted() {
    this.initForm(this.row)
  }
}

</script>

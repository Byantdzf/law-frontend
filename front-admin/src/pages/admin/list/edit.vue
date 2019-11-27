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
import { mapActions } from 'vuex'
export default {
  mixins: [AppForm],
  props: {
    row: Object
  },
  data(){
    return {
      data: {}
    }
  },
  methods: {
    async initForm(form) {
      let row = { ...form }

      this.formResave = true

      this.$set(this.formInit, 'labelWidth', '100px')
     
      if(row.id){
        let res = await this.managerDetail({id: row.id})
        this.data = res.data
      }
      this.formItems = [
        {
          label: '账号',
          field: 'userName',
          type: 1,
          value: this.data.userName,
          placeholder: '字母、下划线，不可修改',
          required: true
        },
        {
          label: '登录密码',
          field: 'password',
          type: 6,
          value: this.data.password,
          required: true
        },
        {
          label: '确认密码',
          field: 'passwordConfirm',
          type: 6,
          value: this.data.passwordConfirm,
          required: true
        },
        {
          label: '角色选择',
          field: 'roleId',
          type: 2,
          value: this.data.roleId ? + this.data.roleId : '',
          options: []
        },
        {
          label: '姓名',
          field: 'realName',
          type: 1,
          value: this.data.realName,
        },
        {
          label: '手机',
          field: 'phone',
          type: 1,
          value: this.data.phone,
          number: true
        },
        {
          label: '邮箱',
          field: 'email',
          type: 1,
          value: this.data.email
        },
        {
          label: '备注',
          field: 'remark',
          type: 5,
          value: this.data.remark
        },
        {
          label: '启用状态',
          field: 'isDisable',
          type: 3,
          value: this.data.isDisable || 0,
          options: this.$t('rs.isDisable')
        }
      ]
      this.roleKV().then(res => {
        this.updateFormItem('roleId', 'options', res.data || [])
      })
    },
    // 表单提交
    formSubmit(form) {
      let params = { ...form }
      if(this.row && this.row.hasOwnProperty('id')) {
        params.id = this.row.id
      }
      this.$emit('submit', params)
    },
    ...mapActions('data', ['roleKV']),
    ...mapActions('admin', ['managerDetail'])
  },
  mounted() {
    this.initForm(this.row)
  }
}

</script>

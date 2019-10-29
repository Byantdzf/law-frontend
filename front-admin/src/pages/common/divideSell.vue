<template>
  <app-form
    ref="appForm"
    class="app-dialog-form"
    :init="formInit"
    :items="formItems"
    :btns="formBtns"
    :resave="formResave"
    @confirm="formSubmit"
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
        const row = { ...form }

        this.formResave = true

        this.$set(this.formInit, 'labelWidth', '100px')
        
        this.formItems = [
          {
            labelWidth: '0px',
            field: 'userId',
            type: 3,
            value: this.$val(row, 'sellBo.userId'),
            options: []
          }
        ]

        this.formResaveDone()
      },
      // 表单提交
      formSubmit({ userId }) {
        const curUser = this.users.find(v => v.id == userId) || {}
        let params = {
          tenantId: this.row.id,
          userId: userId,
          userName: curUser.name
        }
        this.$emit('submit', params)
      },
      ...mapActions('user', ['userGetKV'])
    },
    mounted() {
      this.initForm(this.row)
      this.userGetKV().then(res => {
        this.users = res.data || []
        this.updateFormItem('userId', 'options', res.data || [])
      })
    }
  }

</script>

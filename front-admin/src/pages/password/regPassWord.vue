<template>
  <app-form
    class="app-dialog-form update-pwd-form"
    ref="appForm"
    :init="formInit"
    :items="formItems"
    :btns="formBtns"
    :resave="formResave"
    @confirm="formSubmit"
  />
</template>

<script>
  import { mapActions } from "vuex";
  import test from "@/utils/test";
  import AppForm from "@/mixins/form";
  import Bus from '@/utils/bus'
  const md5 = require('md5')
  export default {
    mixins: [AppForm],
    props: {
      row: Object
    },
    data() {
      return {
        test,
        isLoading: false
      };
    },
    mounted(){
      console.log(this.row);
      this.initForm();
    },
    methods: {
      async initForm() {
        this.$set(this.formInit, "labelWidth", "0px");
        this.formResave = true;

        this.formItems = [
          {
            label: '新密码',
            placeholder: "请输入6位以上新密码",
            field: "password",
            type: 6,
            required: true
          },
          {
            label: '确认密码',
            placeholder: "请再次输入新密码",
            field: "confirmPassword",
            type: 6,
            required: true
          },
        ];

        this.formBtns = [
          {
            label: "确认",
            code: "confirm",
            size: "large",
            loading: this.isLoading
          }
        ];

      },
      // 表单提交
      async formSubmit(form) {
        let { password, confirmPassword } = form

        try {
          await this.test.string({
            label: "新密码",
            value: password,
            min: 6
          })

          if (password !== confirmPassword) {
            this.$msgError('两次新密码输入不一致');
            return false;
          }

          const params = {
            password: btoa(password),
            confirmPassword: btoa(confirmPassword),
            token: this.row.token,
          }
          this.resetPassword(params).then(()=>{
            let _t=this;
            this.$msgSuccess('密码重置成功！请使用新密码登录！',1500);
            setTimeout(function () {
              _t.$emit("switch",'LoginForm')
            },1500)
          })

        } catch (e) {
          this.$msgError(e.message || this.$val(e, 'data.msg', '出错啦'))
        }
      },
      ...mapActions("data", [
        "resetPassword",
      ]),
    },
  };
</script>

<style lang="less">
  .update-pwd-form {
    .el-form-item__label {
      font-size: 0;
      padding-right: 0 !important;
    }
    .app-form__btns {
      padding-bottom: 20px;
      .el-button {
        width: 100%;
        border-radius: 4px;
        font-size: 16px;
        &:hover {
          opacity: 0.9;
        }
      }
    }
  }
</style>


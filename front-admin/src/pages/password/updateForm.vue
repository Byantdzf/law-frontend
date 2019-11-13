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
  data() {
    return {
      test,
      isLoading: false
    };
  },
  methods: {
    async initForm() {
      this.$set(this.formInit, "labelWidth", "0px");
      this.formResave = true;

      this.formItems = [
        {
          label: '旧密码',
          placeholder: "请输入旧密码",
          field: "oldPassword",
          type: 6,
          required: true
        },
        {
          label: '新密码',
          placeholder: "请输入新密码",
          field: "newPassword",
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

      this.formResaveDone();
    },
    // 表单提交
    async formSubmit(form) {
      let { oldPassword, newPassword, confirmPassword } = form

      try {
        // await this.test.string({
        //   label: "新密码",
        //   value: newPassword,
        //   min: 6
        // })

        if (newPassword !== confirmPassword) {
          this.$msgError('两次新密码输入不一致');
          return false;
        }
        
        const params = {
          password: oldPassword,
          newPassword: newPassword,
          newPasswordConfirm: confirmPassword
        }
        this.isLoading = true
        this.$set(this.formBtns[0], 'loading', true)
        await this.updatePassword(params)
        this.isLoading = false
        this.$set(this.formBtns[0], 'loading', false)
        this.$emit('submit')
      } catch (e) {
        // error
        this.isLoading = false
        this.$set(this.formBtns[0], 'loading', false)
        this.$msgError(e.message || this.$val(e, 'data.msg', '出错啦'))
      }
    },
    ...mapActions("auth", [
      "updatePassword"
    ])
  },
  mounted() {
    this.initForm();
    Bus.$on('keyup', () => {
      if (!this.isLoading) {
        const { appForm } = this.$refs
        const params = appForm ? appForm.formData : {}
        this.formSubmit(params)
      }
    })
  },
  beforeDestroy() {
    Bus.$off('keyup')
  }
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


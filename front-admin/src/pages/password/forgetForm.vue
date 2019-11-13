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
    mounted(){
      this.initForm();
    },
    methods: {
      async initForm() {
        this.$set(this.formInit, "labelWidth", "0px");
        this.formResave = true;

        this.formItems = [
          {
            placeholder: "请输入你的手机号码",
            field: "mobile",
            type: 1,
            append: '获取验证码',
            appendClick: true,
            required: true,
            countTime: 60,
            on: {
              click: ({ value }) => {
                this.sendCodeSms(value);
              }
            }
          },
          {
            label: '验证码',
            placeholder: "请输入验证码",
            field: "smsCode",
            type: 1,
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
        let { mobile, smsCode } = form
        try {
          await this.test.string({
            label: "验证码",
            value: smsCode,
          })
          await this.test.string({
            label: "手机号码",
            value: mobile,
          })
          this.forgetPassword(form).then((res)=>{
            let params={
              name:'RegPassWord',
              token:res.data
            };
            this.isLoading = false;
            this.$emit('switch',params)
          });

        } catch (e) {
          // error
          this.isLoading = false
          this.$msgError(e.message || this.$val(e, 'data.msg', '出错啦'))
        }
      },
      sendCodeSms(value){
        let params={
          'mobile':value,
          'type':2
        }
        this.validateCodeSms(params).then(() => {
          this.$msgSuccess("验证码获取成功！");
        })
      },
      ...mapActions("data", [
        "register",
        "validateCodeSms",
        "forgetPassword",
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


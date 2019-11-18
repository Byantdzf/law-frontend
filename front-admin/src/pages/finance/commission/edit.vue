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
import AppForm from "@/mixins/form";
export default {
  mixins: [AppForm],
  props: {
    row: Object
  },
  watch: {
    row: {
      handler: function(newval) {
        this.initForm(newval);
      },
      deep: true
    }
  },
  methods: {
    initForm(form) {
      let row = { ...form };
      row.lawyerRatio = (row.lawyerRatio * 100)
      row.platformRatio = (row.platformRatio * 100)

      this.formResave = true;

      this.$set(this.formInit, "labelWidth", "100px");

      this.formItems = [
        {
          label: "律师比例",
          field: "lawyerRatio",
          type: 1,
          value: row.lawyerRatio,
          append: "%",
          on: {
            change: e => {
              let val = e.value
              if (val > 100 || val < 0) {
                this.$msgError('输入不能大于100，小于0')
                this.updateFormItem('lawyerRatio', 'value', row.lawyerRatio)
              } else {
                this.updateFormItem('platformRatio', 'value', 100 - val)
              }
            }
          }
        },
        {
          label: "平台比例",
          field: "platformRatio",
          type: 1,
          value: row.platformRatio,
          append: "%",
          on: {
            change: e => {
              let val = e.value
              if (val > 100 || val < 0) {
                this.$msgError('输入不能大于100，小于0')
                this.updateFormItem('platformRatio', 'value', row.platformRatio)
              } else {
                this.updateFormItem('lawyerRatio', 'value', 100 - val)
              }
            }
          }
        }
      ];

      this.formResaveDone();
    },
    // 表单提交
    formSubmit(form) {
      // console.log(form)
      let params = { ...form };
      if (this.row && this.row.hasOwnProperty("id")) {
        params.id = this.row.id;
      }
      if (params.lawyerRatio) {
        params.lawyerRatio = params.lawyerRatio / 100
      }
      if (params.platformRatio) {
        params.platformRatio = params.platformRatio / 100
      }
      this.$emit("submit", params);
    }
  },
  mounted() {
    this.initForm(this.row);
  }
};
</script>

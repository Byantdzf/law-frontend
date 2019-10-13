import AppForm from '@/components/app-form'

export default {
  components: {
    AppForm
  },
  data() {
    return {
      // 是否重新保存form表单的初始值
      formResave: false,
      // form样式配置
      formInit: {
        inline: false,
        itemWidth: '100%'
      },
      formResaveTimer: null,
      formItems: [],
      formBtns: [{
        label: '确认',
        code: 'confirm'
      }]
    }
  },
  methods: {
    getFormItemVm(key) {
      if(this.$refs['appForm']) {
        return this.$refs['appForm'].getFormItemVm(key)
      }
    },
    updateFormItem(arg1, arg2, arg3) {
      if(this.$refs['appForm']) {
        this.$refs['appForm'].updateFormItem(arg1, arg2, arg3)
      }
    },
    formResaveDone() {
      this.formResaveTimer = setTimeout(() => {
        this.formResave = false
        clearTimeout(this.formResaveTimer)
        this.formResaveTimer = null
      }, 0)
    },
    resetForm() {
      this.$refs.appForm &&
      this.$refs.appForm.resetForm()
    }
  },
  destroyed () {
    this.formResaveTimer && clearTimeout(this.formResaveTimer)
    this.formResaveTimer = null
  }
}

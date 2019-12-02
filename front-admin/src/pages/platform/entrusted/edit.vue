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
import AppUpload from '@/components/app-upload'
export default {
  mixins: [AppForm, AppUpload],
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
          label: '服务类型名称',
          field: 'title',
          type: 1,
          value: row.title,
          required: true
        },
        {
          label: '封面图片',
          field: 'instructionPic',
          value: row.instructionPic || '',
          component: AppUpload,
          config: {
            max: 1,
            preview: true,
            dataType: 'string',
            fileType: 'jpg,jpeg,png',
            btnIcon: 'el-icon-plus',
            tips: '建议300*300'
          }
        },
        {
          label: '价格',
          field: 'price',
          type: 1,
          value: row.price,
          required: true
        },
        {
          label: '服务说明',
          field: 'instruction',
          type: 5,
          value: row.instruction,
          required: true
        },
        {
          label: '适用范围说明',
          field: 'serviceRange',
          type: 5,
          value: row.serviceRange,
          required: true
        },
        {
          label: '服务流程说明',
          field: 'serviceSteps',
          type: 5,
          value: row.serviceSteps,
          required: true
        },
        {
          label: '真实销量数据',
          field: 'salesCount',
          type: 1,
          value: row.salesCount,
          required: true
        },
        {
          label: '置展示销量',
          field: 'saleCountType',
          type: 3,
          value: row.saleCountType || row.saleCountType === 2 ? +row.saleCountType : 1,
          options: this.$t('rs.saleCountType')
        },
        {
          label: '展示销量数据',
          field: 'showCount',
          type: 1,
          value: row.showCount
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
      params.category = 3;
      debugger
      this.$emit('submit', params)
    }
  },
  mounted() {
    this.initForm(this.row)
  }
}

</script>

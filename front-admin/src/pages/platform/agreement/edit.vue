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
          label: '文件名称',
          field: 'fileName',
          type: 1,
          value: row.fileName,
          required: true
        },
        {
          label: '所属分类',
          field: 'businessType',
          required: true,
          type: 2,
          value: row.businessType ? +row.businessType : '',
          options: this.$t('rs.orderBusinessType')
        },
        {
          label: '更新时间',
          field: 'updateTime',
          type: 9,
          value: row.updateTime,
          format: 'yyyy-MM-dd hh:mm:ss',
          valueFormat: 'yyyy-MM-dd hh:mm:ss',
          required: true
        },
        {
          label: '价格',
          field: 'price',
          type: 1,
          value: row.price,
          required: true
        },
        {
          label: '文件简介',
          field: 'brief',
          type: 5,
          value: row.brief,
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
          label: '文件封面图',
          field: 'image',
          value: row.image || '',
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
          label: '文件上传',
          field: 'doc',
          value: row.doc || '',
          component: AppUpload,
          config: {
            max: 1,
            preview: false,
            dataType: 'string',
            fileSize: 1024 * 1024 * 500,
            // btnIcon: 'el-icon-plus'
          }
        },
        {
          label: '真实销量数据',
          field: 'realSales',
          type: 1,
          value: row.realSales,
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
          field: 'sales',
          type: 1,
          value: row.sales
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
      params.category = 1;
      this.$emit('submit', params)
    }
  },
  mounted() {
    this.initForm(this.row)
  }
}

</script>

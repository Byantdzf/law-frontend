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
          label: '端口选择',
          field: 'terminal',
          type: 2,
          value: +row.terminal || 1,
          options: this.$t('rs.articleTerminal')
        },
        {
          label: '类型选择',
          field: 'type',
          type: 2,
          value: +row.type || 1,
          options: this.$t('rs.articleType'),
          on: {
            change: ({ value }) => {
              this.updateFormItem('protocolId', 'show', value == 1)
            }
          }
        },
        {
          label: '',
          field: 'protocolId',
          type: 2,
          show: row.type ? row.type == 1 : true,
          value: +row.protocolId || 1,
          options: this.$t('rs.articleProtocol')
        },
        {
          label: '文章标题',
          field: 'title',
          type: 1,
          value: row.title,
          required: true
        },
        {
          label: '封面图片',
          field: 'pic',
          value: row.pic || '',
          component: AppUpload,
          config: {
            max: 1,
            preview: true,
            dataType: 'string',
            fileType: 'jpg,jpeg,png',
            btnIcon: 'el-icon-plus'
          }
        },
        {
          label: '显示状态',
          field: 'status',
          type: 3,
          value: row.status || row.status === 0 ? +row.status : 1,
          options: this.$t('rs.articleStatus')
        },
        {
          label: '内容描述',
          field: 'content',
          type: 5,
          value: row.content
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
      this.$emit('submit', params)
    }
  },
  mounted() {
    this.initForm(this.row)
  }
}

</script>

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
import {VueEditor} from "vue2-editor" 
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
          label: '广告名称',
          field: 'advName',
          type: 1,
          value: row.advName,
          required: true
        },
        {
          label: '排序',
          field: 'sort',
          type: 1,
          value: row.sort,
          required: true,
          number: true
        },
        {
          label: '所属广告位',
          field: 'terminal',
          type: 2,
          value: +row.terminal || 1,
          options: this.$t('rs.adTerminal')
        },
        {
          label: '广告位置',
          field: 'location',
          type: 2,
          value: +row.location || 1,
          options: this.$t('rs.adLocation')
        },
        {
          label: '广告类型',
          field: 'type',
          type: 2,
          value: +row.type || 1,
          options: this.$t('rs.adType'),
          on: {
            change: ({ value }) => {
              this.updateFormItem('url', 'show', value == 2)
              this.updateFormItem('content', 'show', value == 1)
            }
          }
        },
        {
          label: '封面图片',
          field: 'coverPhoto',
          value: row.coverPhoto || '',
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
          label: '显示状态',
          field: 'showed',
          type: 3,
          value: +row.showed || 1,
          options: this.$t('rs.adStatus')
        },
        {
          label: '发布时间',
          field: 'publishTime',
          type: 9,
          value: row.publishTime,
          format: 'yyyy-MM-dd hh:mm:ss',
          valueFormat: 'yyyy-MM-dd hh:mm:ss'
        },
        {
          show: row.type == 2,
          label: 'URL链接',
          field: 'url',
          type: 1,
          value: row.url,
        },
        {
          show: row.type == 2 ? false : true,
          label: '内容详情',
          field: 'content',
          type: 5,
          value: row.content,
          component: VueEditor
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

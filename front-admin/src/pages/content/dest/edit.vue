<template>
  <app-form
    class="app-dialog-form"
    :init="formInit"
    :items="formItems"
    :btns="formBtns"
    :resave="formResave"
    @confirm="formSubmit"
    ref="appForm"
  />
</template>

<script>
import AppForm from '@/mixins/form'
import AreaQuery from '@/mixins/areaQuery'
import AppUploadFile from '@/components/app-upload'
import AppEditor from '@/components/app-editor'
export default {
  mixins: [AppForm, AreaQuery],
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
        Object.assign({
          itemWidth: '50%',
          required: true
        }, this.buildCountryItem({ row })),
        Object.assign({
          itemWidth: '50%',
          links: 'name|cityName',
          required: true
        }, this.buildCityItem({ row })),
        {
          label: '',
          field: 'name|cityName',
          type: 1,
          value: row.name,
          show: false
        },
        {
          label: '介绍',
          field: 'recommend',
          type: 5,
          value: row.recommend,
          component: AppEditor
        },
        {
          label: '图片：',
          field: 'picture',
          value: row.picture || '',
          config: {
            preview: true,
            dataType: 'string',
            fileType: 'jpg,jpeg,png',
            btnIcon: 'el-icon-plus'
          },
          component: AppUploadFile
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

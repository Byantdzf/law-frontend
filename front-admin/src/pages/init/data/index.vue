<template>
  <el-card class="table-card pt-20">
    <app-form
      class="app-dialog-form"
      :init="formInit"
      :items="formItems"
      :btns="formBtns"
      :resave="formResave"
      @confirm="formSubmit"
      ref="appForm"
    />
  </el-card>
</template>

<script>
import { get, post, postJson } from '@/utils/xhr'
import AppForm from '@/mixins/form'
export default {
  mixins: [AppForm],
  methods: {
    initForm() {

      this.formResave = true

      this.$set(this.formInit, 'labelWidth', '100px')
      
      this.formItems = [
        {
          label: 'path：',
          field: 'path',
          type: 1,
          value: '',
          required: true
        },
        {
          label: 'method：',
          field: 'method',
          type: 3,
          value: 'get',
          options: ['get', 'post', 'postJson']
        },
        {
          label: 'params：',
          field: 'params',
          type: 1,
          required: true
        }
      ]

      this.formResaveDone()
    },
    // 表单提交
    formSubmit({ path, method, params }) {
      if (path.indexOf('/') === 0) {
        path = path.replace('/', '')
      }
      let p = {}
      params.split('&').forEach(param => {
        let [k, v] = param.split('=')
        p[k] = v
      })
      if (method === 'get') {
        get(path, p)
      } else if (method === 'post') {
        post(path, p)
      } else {
        postJson(path, p)
      }
    }
  },
  mounted() {
    this.initForm()
  }
}

</script>

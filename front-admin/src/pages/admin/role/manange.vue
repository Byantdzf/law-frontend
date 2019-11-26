<template>
  <div>
    <tree
    :data="data"
    default-expand-all
    show-checkbox
    >
    </tree>
    <div class="btn-box">
        <el-button type="primary">确定</el-button>
        <el-button>关闭</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import {Tree} from "element-ui"
import AppForm from '@/mixins/form'
export default {
  mixins: [AppForm],
  components: {Tree},
  data(){
      return {
          data: [{
              id: 0,
              label: "功能菜单",
              children: [
                {
                    id: 4,
                    label: '二级 1-1',
                },{
                    id: 10,
                    label: '三级 1-1-2'
                }
              ]
          }]
      }
  },
  methods: {
    async initForm(form) {
        console.log(this.data)
      let res = await this.permsList()
      let children = res.data.map(item=>{
          return {
              id: item.id,
              label: item.permName
          }
      })
      this.data[0].children = children
    },
    // 表单提交
    formSubmit(form) {
      // console.log(form)
      let params = { ...form }
      if(this.row && this.row.hasOwnProperty('id')) {
        params.id = this.row.id
      }
      this.$emit('submit', params)
    },
    ...mapActions('admin', [
        'permsList'
    ])
  },
  mounted() {
    this.initForm(this.row)
  }
}

</script>

<style scoped>
.btn-box{
    margin-top: 10px;
    text-align: center
}
</style>

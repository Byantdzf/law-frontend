<template>
  <div>
    <tree
    :data="data"
    ref="tree"
    default-expand-all
    node-key="id"
    :default-checked-keys="defaultCheckedKeys"
    show-checkbox
    >
    </tree>
    <div class="btn-box">
        <el-button type="primary" @click="formSubmit">确定</el-button>
        <el-button @click="$emit('cancel')">关闭</el-button>
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
  props: {row: Object},
  data(){
      return {
          data: [{
              id: 0,
              label: "功能菜单",
              children: []
          }],
          defaultCheckedKeys: []
      }
  },
  methods: {
    async initForm(form) {
        this.getList()
        this.getSlectPerm()
    },
    async getSlectPerm(){
        let res = await this.getslectedPerm(this.row.id)
        this.defaultCheckedKeys = res.data.map(item=>item.id)
        console.log(this.defaultCheckedKeys)
    },
    async getList(){
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
    async formSubmit(form) {
      // console.log(form)
      let payload = {
          id: this.row.id,
          params: this.$refs.tree.getCheckedKeys()
      }
      await this.updateSelectedPerm(payload)
      this.$emit('cancel')
    },
    ...mapActions('admin', [
        'permsList',
        'getslectedPerm',
        'updateSelectedPerm'
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

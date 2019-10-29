<template>
  <el-row class="dialog-scroll-box">
    <el-row class="dialog-scroll-box_con">
      <app-tree
        :data="menus"
        dataType="tree"
        :defaultProps="defaultProps"
        :defaultCheckedKeys="checkedKeys"
        showCheckbox
        ref="appTree"
      />
    </el-row>
    <el-row class="dialog-scroll-box_btn">
      <el-button type="primary" size="small" @click="formSubmit">确认</el-button>
    </el-row>
  </el-row>
</template>

<script>
import { mapActions } from 'vuex'
import AppTree from "@/components/app-tree"
export default {
  components: {
    AppTree
  },
  props: {
    row: Object
  },
  data() {
    return {
      defaultProps: {
        label: 'name',
        id: 'id'
      },
      checkedKeys: [],
      menus: []
    }
  },
  watch: {
    row: {
      handler: function(nv) {
        this.initForm(nv)
      },
      deep: true
    }
  },
  methods: {
    async initForm(row) {
      const menus = await this.getAllMenus()
      this.menus = menus || []
      this.checkedKeys = []
      const res = await this.getPermissionMenus({ userId: row.id })
      this.checkedKeys = res.data || []
    },
    // 表单提交
    formSubmit() {
      let checkeds =  this.$refs.appTree.getDatas('checked') || []
      let params = {
        userId: this.row.id,
        menuIds: checkeds.map(v => v.id).join(',')
      }
      this.$emit('submit', params)
    },
    ...mapActions('auth', [
      'getAllMenus',
      'getPermissionMenus',
    ])
  },
  mounted() {
    this.initForm(this.row)
  }
}

</script>

<style lang="less">
  .dialog-scroll-box {
    position: relative;
    width: 100%;
    padding-bottom: 40px;
  }
  .dialog-scroll-box_con {
    max-height: 550px;
    overflow-y: auto;
  }
  .dialog-scroll-box_btn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
  }
</style>

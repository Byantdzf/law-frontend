<template>
  <el-row>
    <el-card class="table-card">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">平台客服电话设置</span>
        </el-row>
      </el-row>
      <el-form class="page-inner-form" :inline="true">
        <el-form-item>
          <el-input v-model="telphone" :readonly="!isEdit"></el-input>
        </el-form-item>
        <el-form-item v-if="!isEdit">
          <el-button type="primary" @click="isEdit = true">编辑</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button type="primary" plain @click="isEdit = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
</template>

<script>
  import { mapActions } from 'vuex'
  export default {
    components: {
      
    },
    mixins: [],
    data() {
      return {
        telphone: '',
        isEdit: false
      }
    },
    methods: {
      // 初始化页面
      initPage() {
        
      },
      // 表单提交
      async onSubmit(form) {
        try {
          
        } catch (e) {
          // error
        }
      },
      ...mapActions('tenant', [
        'tenantView',
        'tenantDivideHq',
        'tenantGetKV'
      ])
    },
    created() {
      this.initPage()
    }
  }
</script>

<style lang="less">
  .page-inner-form {
    padding: 40px;
  }
</style>

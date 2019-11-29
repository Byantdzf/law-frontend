<template>
  <el-row>
    <el-card class="table-card">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">平台客服电话设置</span>
        </el-row>
      </el-row>
      <el-form class="page-inner-form">
        <el-form-item label="客服热线">
          <el-input class="input" v-model="phone" :readonly="!isEdit"></el-input>
          <span  v-if="!isEdit">
            <el-button type="primary" @click="isEdit = true">编辑</el-button>
          </span>
          <span v-else>
            <el-button type="primary" @click="onSubmit('phone')">保存</el-button>
            <el-button type="primary" plain @click="handleCancel">取消</el-button>
          </span>
        </el-form-item>
        <el-form-item label="投诉热线">
          <el-input class="input" v-model="complaint_phone" :readonly="!complaintIsEdit"></el-input>
          <span  v-if="!complaintIsEdit">
            <el-button type="primary" @click="complaintIsEdit = true">编辑</el-button>
          </span>
          <span v-else>
            <el-button type="primary" @click="onSubmit('complaint_phone')">保存</el-button>
            <el-button type="primary" plain @click="handleCancel">取消</el-button>
          </span>
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
        phone: '',
        isEdit: false,
        complaintIsEdit: false,
        complaint_phone: ""
      }
    },
    methods: {
      async fetchData() {
        const res = await this.servicePhoneQuery()
        this.phone = res.data.phone || '';
        this.complaint_phone = res.data.complaint_phone || ""
      },
      // 表单提交
      async onSubmit(key) {
        try {
          let dictCode = 1;
          let params = {
            dictCode,
            code: key == 'phone' ? this.phone : this.complaint_phone,
            name: key
          }
          await this.servicePhoneSetting(params)
          this.$msgSuccess('更新成功！')
          this.handleCancel(key)
        } catch (e) {
          // error
        }
      },
      handleCancel(key) {
        if(key == 'phone'){
          this.isEdit = false
        }else{
          this.complaintIsEdit = false;
        }
        this.fetchData()
      },
      ...mapActions('system', [
        'servicePhoneQuery',
        'servicePhoneSetting'
      ])
    },
    created() {
      this.fetchData()
    }
  }
</script>

<style lang="less" scoped>
  .page-inner-form {
    padding: 40px;
  }
  .input{
    float: left;
    margin-right: 10px;
    width: 200px;
  }
</style>

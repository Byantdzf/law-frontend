<template>
  <el-row class="dialog-detail">
    <h3 class="title">反馈意见</h3>
    <el-form label-width="100px">
      <el-form-item label="用户昵称">
        <span>{{ $val(row, 'userName') }}</span>
      </el-form-item>
      <el-form-item label="发送时间">
        <span>{{ $val(row, 'feedBackTime') }}</span>
      </el-form-item>
      <el-form-item label="消息内容">
        <span>{{ $val(row, 'content') }}</span>
      </el-form-item>
    </el-form>
    <h3 class="title mt-10">回复详情</h3>
    <el-form label-width="100px">
      <el-form-item label="回复人">
        <span v-if="$val(row, 'dealStatus') == 1">{{ $val(row, 'dealer') }}</span>
        <span v-else>{{ userName }}</span>
      </el-form-item>
      <el-form-item label="回复时间" v-if="$val(row, 'dealStatus') == 1">
        <span>{{ $val(row, 'dealTime') }}</span>
      </el-form-item>
      <el-form-item label="回复内容">
        <span v-if="$val(row, 'dealStatus') == 1">{{ $val(row, 'respInfo') }}</span>
        <el-input type="textarea" v-model="respInfo" v-else></el-input>
      </el-form-item>
      <el-form-item v-if="$val(row, 'dealStatus') == 0">
        <el-button type="primary" @click="formSubmit">发送</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    row: Object
  },
  data() {
    return {
      respInfo: ''
    }
  },
  computed: {
    ...mapState(['userName'])
  },
  methods: {
    // 表单提交
    formSubmit() {
      let params = {
        content: this.respInfo,
        question: this.$val(this.row, 'content')
      }
      if(this.row && this.row.hasOwnProperty('id')) {
        params.userId = this.row.id
      }
      this.$emit('submit', params)
    }
  }
}

</script>

<style lang="less">
  .dialog-detail {
    .title {
      font-size: 14px;
      margin-bottom: 10px;
    }
    .el-form-item {
      margin-bottom: 5px !important;
    }
  }
</style>

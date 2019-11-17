<template>
  <el-row class="baseInfo-box">
    <el-row>
      <span class="label cl-999">专业态度：</span>
      <span class="con">
        <AppScore :value="$val(row, 'orderScore.professionalAttitudeScore')" readonly/>
      </span>
    </el-row>
    <el-row>
      <span class="label cl-999">服务态度：</span>
      <span class="con">
        <AppScore :value="$val(row, 'orderScore.serviceAttitudeScore')" readonly/>
      </span>
    </el-row>
    <el-row>
      <span class="label cl-999">评论内容：</span>
      <span class="con">{{ $val(row, 'orderScore.content') }}</span>
    </el-row>
  </el-row>
</template>

<script>
import AppScore from '@/components/app-score'
export default {
  components: {
    AppScore
  },
  props: {
    row: Object
  }
}
</script>
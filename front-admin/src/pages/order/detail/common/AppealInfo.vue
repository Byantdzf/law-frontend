<template>
  <el-row class="baseInfo-box">
    <el-row>
      <span class="label cl-999">申诉时间：</span>
      <span class="con">{{ $val(row, 'userOperateRecord.createTime') }}</span>
    </el-row>
    <el-row>
      <span class="label cl-999">申诉类型：</span>
      <span class="con">{{ $t('rs.appealType')[$val(row, 'userOperateRecord.appealType')] }}</span>
    </el-row>
    <el-row>
      <span class="label cl-999">申诉内容：</span>
      <span class="con">{{ $val(row, 'userOperateRecord.remark') }}</span>
    </el-row>
    <el-row>
      <span class="label cl-999">是否已处理：</span>
      <span class="con">{{ $t('rs.dealStatus')[$val(row, 'userOperateRecord.dealStatus')] }}</span>
    </el-row>
  </el-row>
</template>

<script>
export default {
  props: {
    row: Object
  }
}
</script>
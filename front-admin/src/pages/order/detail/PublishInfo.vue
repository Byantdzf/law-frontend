<template>
  <el-row class="baseInfo-box">
    <el-row>
      <span class="label cl-999">发布人昵称：</span>
      <span class="con fw-b cl-primary">{{ $val(row, 'name') }}</span>
    </el-row>
    <el-row>
      <span class="label cl-999">发布人ID：</span>
      <span class="con">{{ $val(row, 'userId') }}</span>
    </el-row>
    <el-row>
      <span class="label cl-999">发布人头像：</span>
      <span class="con">{{ $val(row, 'userAvatarUrl') }}</span>
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
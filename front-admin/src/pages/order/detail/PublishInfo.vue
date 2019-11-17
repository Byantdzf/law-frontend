<template>
  <el-row class="baseInfo-box">
    <el-row>
      <span class="label cl-999">昵称：</span>
      <span class="con">{{ $val(row, 'name') }}</span>
    </el-row>
    <el-row>
      <span class="label cl-999">头像：</span>
      <span class="con">
        <el-image 
          style="width: 70px; height: 70px; border-radius: 4px;"
          :src="$val(row, 'lawyerDto.pic')" 
          :preview-src-list="[$val(row, 'userAvatarUrl')]">
        </el-image>
      </span>
    </el-row>
    <el-row>
      <span class="label cl-999">ID：</span>
      <span class="con">{{ $val(row, 'userId') }}</span>
    </el-row>
    <el-row>
      <span class="label cl-999">手机号：</span>
      <span class="con">{{ $val(row, 'contactMobile') }}</span>
    </el-row>
    <el-row>
      <span class="label cl-999">地区：</span>
      <span class="con">{{ $val(row, 'province') }} - {{ $val(row, 'city') }}</span>
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
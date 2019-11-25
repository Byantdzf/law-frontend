<template>
  <el-row class="publishInfo-box baseInfo-box clearfix">
    <el-row class="fl">
      <el-image 
        style="width: 70px; height: 70px; border-radius: 4px;"
        :src="$val(row, 'userAvatarUrl')" 
        :preview-src-list="[$val(row, 'userAvatarUrl')]">
      </el-image>
    </el-row>
    <el-row class="fl">
      <el-row>
        <span class="label cl-999">昵称：</span>
        <span class="con">{{ $val(row, 'name') }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">ID：</span>
        <span class="con">{{ $val(row, 'userId') }}</span>
      </el-row>
      <template v-if="type === '2'">
        <el-row>
          <span class="label cl-999">手机号：</span>
          <span class="con">{{ $val(row, 'contactMobile') }}</span>
        </el-row>
        <el-row>
          <span class="label cl-999">地区：</span>
          <span class="con">{{ $val(row, 'province') }} - {{ $val(row, 'city') }}</span>
        </el-row>
      </template>
    </el-row>
  </el-row>
</template>

<script>
export default {
  props: {
    row: Object,
    type: {
      type: String,
      default: '2'
    }
  }
}
</script>

<style lang="less">
  .publishInfo-box.baseInfo-box {
    padding-left: 40px;
    .label {
      width: 70px !important;
    }
    .con {
      margin-left: -70px;
      padding-left: 70px;
    }
  }
</style>
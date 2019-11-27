<template>
  <el-row class="lawyerInfo-box baseInfo-box">
    <el-row class="fl">
      <el-image 
        style="width: 70px; height: 70px; border-radius: 4px;"
        :src="$val(row, 'lawyerDto.pic')" 
        :preview-src-list="[$val(row, 'lawyerDto.pic')]">
      </el-image>
    </el-row>
    <el-row class="fl">
      <el-row>
        <span class="label cl-999">律师姓名：</span>
        <span class="con">{{ $val(row, 'lawyerDto.name') }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">律师ID：</span>
        <span class="con">{{ $val(row, 'lawyerDto.id') }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">律师评分：</span>
        <span class="pl-10 cl-red">{{ $val(row, 'lawyerDto.score') }}分</span>
      </el-row>
      <template v-if="type === '2'">
        <el-row>
          <span class="label cl-999">接单时间：</span>
          <span class="con">{{ $val(row, 'acceptTime') }}</span>
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
      default: '1'
    }
  },
}
</script>

<style lang="less">
  .lawyerInfo-box.baseInfo-box {
    padding-left: 40px;
    .label {
      width: 90px !important;
    }
    .con {
      margin-left: -90px;
      padding-left: 90px;
    }
  }
</style>
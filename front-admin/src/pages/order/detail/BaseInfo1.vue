<template>
  <el-row class="baseInfo-box" :gutter="10">
    <el-col :span="8">
      <el-row>
        <span class="label cl-999">订单号：</span>
        <span class="con fw-b cl-primary">{{ $val(row, 'orderNo') }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">订单状态：</span>
        <span class="con">{{ orderStatus }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">订单金额：</span>
        <span class="con">{{ $val(row, 'amount') }}元</span>
      </el-row>
    </el-col>
    <el-col :span="8">
      <el-row>
        <span class="label cl-999">订单类型：</span>
        <span class="con">{{ $t('rs.orderType')[$val(row, 'orderType')] }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">订单种类：</span>
        <span class="con">{{ $t('rs.orderCategory')[$val(row, 'orderCategory')] }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">所属分类：</span>
        <span class="con">{{ $t('rs.orderBusinessType')[$val(row, 'fileType')] }}</span>
      </el-row>
    </el-col>
    <el-col :span="8">
      <el-row>
        <span class="label cl-999">是否紧急：</span>
        <span class="con">{{ $t('rs.orderEmergency')[$val(row, 'emergency')] }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">派单方式：</span>
        <span class="con">{{ $t('rs.orderRule')[$val(row, 'dispatchWay')] }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">接单路径：</span>
        <span class="con">{{ $t('rs.orderSource')[$val(row, 'orderSource')] }}</span>
      </el-row>
    </el-col>
    <el-col :span="24">
      <el-row>
        <span class="label cl-999">咨询内容：</span>
        <span class="con">{{ $val(row, 'content') }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">备注：</span>
        <span class="con">{{ $val(row, 'remark') }}</span>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    row: Object
  },
  computed: {
    orderStatus() {
      const stauts = this.$val(this.row, 'orderStatus')
      return this.$t('rs.orderStatus')[stauts]
    }
  }
}
</script>
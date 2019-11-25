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
    </el-col>
    <el-col :span="8">
      <el-row>
        <span class="label cl-999">发布时间：</span>
        <span class="con">{{ $val(row, 'orderTime') }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">交付期限：</span>
        <span class="con">{{ $val(row, 'deliveryDeadDate') }}</span>
      </el-row>
    </el-col>
    <el-col :span="24">
      <el-row>
        <span class="label cl-999">用户要求：</span>
        <span class="con">{{ $val(row, 'customerRequirement') }}</span>
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
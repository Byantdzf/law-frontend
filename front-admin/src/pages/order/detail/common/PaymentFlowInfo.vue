<template>
  <el-row class="baseInfo-box" :gutter="10">
    <el-col :span="8">
      <el-row>
        <span class="label cl-999">订单应付金额：</span>
        <span class="con">{{ $val(row, 'paymentInfoDto.orgAmount') }}元</span>
      </el-row>
      <el-row>
        <span class="label cl-999">订单实付金额：</span>
        <span class="con">{{ $val(row, 'paymentInfoDto.amount') }}元</span>
      </el-row>
      <el-row>
        <span class="label cl-999">平台利润：</span>
        <span class="con">{{ $val(row, 'paymentInfoDto.platformProfit') }}元</span>
      </el-row>
    </el-col>
    <el-col :span="8">
      <el-row>
        <span class="label cl-999">支付方式：</span>
        <span class="con">{{ $val(row, 'paymentInfoDto.payWay') }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">支付账号：</span>
        <span class="con">{{ $val(row, 'paymentInfoDto.payAccount') }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">支付时间：</span>
        <span class="con">{{ $val(row, 'paymentInfoDto.payTime') }}</span>
      </el-row>
    </el-col>
    <el-col :span="8">
      <el-row>
        <span class="label cl-999">是否使用优惠券：</span>
        <span class="con">{{ $val(row, 'paymentInfoDto.isUseCoupon') ? '是' : '否' }}</span>
      </el-row>
      <template v-if="$val(row, 'paymentInfoDto.isUseCoupon')">
        <el-row>
          <span class="label cl-999">优惠券编号：</span>
          <span class="con">{{ $val(row, 'paymentInfoDto.coupon.id') }}</span>
        </el-row>
        <el-row>
          <span class="label cl-999">优惠券类型：</span>
          <span class="con">{{ $t('rs.couponScene')[$val(row, 'paymentInfoDto.coupon.couponType')] }}</span>
        </el-row>
        <el-row>
          <span class="label cl-999">优惠券抵扣金额：</span>
          <span class="con">{{ $val(row, 'paymentInfoDto.coupon.amount') }}元</span>
        </el-row>
      </template>
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
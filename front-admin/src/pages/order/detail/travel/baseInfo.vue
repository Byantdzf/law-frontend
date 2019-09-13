<template>
  <el-row class="baseInfo-box" :gutter="10">
    <el-col :sm="12" :lg="6">
      <el-row>
        <span class="label cl-999">订单状态：</span>
        <span class="con fw-b cl-primary">{{ orderStatus }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">买家留言：</span>
        <span class="con">{{ $val(row, 'order.remarkBuyer') }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">卖家留言：</span>
        <span class="con">{{ $val(row, 'order.remarkDist') }}</span>
      </el-row>
    </el-col>
    <el-col :sm="12" :lg="8">
      <el-row>
        <span class="label cl-999">订单号：</span>
        <span class="con">{{ $val(row, 'order.orderNo') }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">外部订单号：</span>
        <span class="con">{{ $val(row, 'order.channelOrderNo') }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">商品：</span>
        <span class="con">
          <span class="cl-primary">【{{ $val(row, 'order.goodsCode') }}】{{ $val(row, 'order.goodsName') }}</span>
          <br />
          <span class="cl-sub">套餐：{{ $val(row, 'packageName') }}</span>
        </span>
      </el-row>
    </el-col>
    <el-col :sm="12" :lg="4">
      <el-row>
        <span class="label cl-999">单价/数量：</span>
        <span class="con">
          <template v-if="$val(row, 'order.qtyAdults')">
            <span>成人：</span>
            <span class="pr-10">
              <i class="cl-error">￥{{ $val(row, 'order.unitPriceAdults') }}</i> / {{ $val(row, 'order.qtyAdults') }}
            </span>
          </template>
          <template v-if="$val(row, 'order.qtyChild')">
            <span>儿童：</span>
            <span class="pr-10">
              <i class="cl-error">￥{{ $val(row, 'order.unitPriceChild') }}</i> / {{ $val(row, 'order.qtyChild') }}
            </span>
          </template>
          <template v-if="$val(row, 'order.qtyBaby')">
            <span>婴儿：</span>
            <span>
              <i class="cl-error">￥{{ $val(row, 'order.unitPriceBaby') }}</i> / {{ $val(row, 'order.qtyBaby') }}
            </span>
          </template>
          <template v-if="$val(row, 'order.qty')">
            <span>数量：</span>
            <span>
              <i class="cl-error">￥{{ $val(row, 'order.unitPrice') }}</i> / {{ $val(row, 'order.qty') }}
            </span>
          </template>
        </span>
      </el-row>
      <el-row v-if="$val(row, 'order.refundStatus') == 2">
        <span class="label cl-999">退款中：</span>
        <span class="con cl-error">￥{{ $val(row, 'order.applyRefundAmount') }}</span>
      </el-row>
      <el-row v-else>
        <span class="label cl-999">退款金额：</span>
        <span class="con cl-error">￥{{ $val(row, 'order.refundAmount') }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">附加费：</span>
        <span class="con cl-error">￥{{ $val(row, 'order.additionalAmount', 0) }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">应付金额：</span>
        <span class="con cl-error">￥{{ $val(row, 'order.orderAmount') }}</span>
      </el-row>
    </el-col>
    <el-col :sm="12" :lg="6">
      <el-row>
        <span class="label cl-999">下单时间：</span>
        <span class="con">{{ $val(row, 'order.orderTime') }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">出行日期：</span>
        <span class="con">{{ $val(row, 'order.travelDate') }}</span>
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
      const stauts = this.$val(this.row, 'order.status')
      return this.$t('rs.orderStatus')[stauts]
    }
  }
}
</script>
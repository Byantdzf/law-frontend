<template>
  <div class="table-paragraph-cell">
    <p>
      <span class="label">订单金额：</span>
      <span class="con">￥{{ $val(row, 'orderAmount') }}</span>
    </p>
    <p>
      <span class="label">附加费：</span>
      <span class="con">￥{{ $val(row, 'additionalAmount', 0) }}</span>
    </p>
    <p>
      <span class="label">已付金额：</span>
      <span class="con"></span>
    </p>
    <p class="cl-error" v-if="$val(row, 'refundStatus') == 2">
      <span class="label">退款中：</span>
      <span class="con">￥{{ $val(row, 'applyRefundAmount') }}</span>
    </p>
    <!--<p v-else>
      <span class="label">退款金额：</span>
      <span class="con">￥{{ $val(row, 'refundAmount') }}</span>
    </p>-->
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    row: Object
  }
}
</script>
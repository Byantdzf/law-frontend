<template>
  <div class="table-paragraph-cell">
    <p>
      <span class="label">订单号：</span>
      <span class="con">{{ $val(row, 'orderNo') }}</span>
    </p>
    <p>
      <span class="label">下单时间：</span>
      <span class="con">{{ $val(row, 'orderTime') }}</span>
    </p>
    <p>
      <span class="label">出行时间：</span>
      <span class="con">{{ $val(row, 'travelDate') }}</span>
    </p>
    <p>
      <span class="label">买家：</span>
      <span class="con">{{ $val(row, 'distName') }}</span>
    </p>
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
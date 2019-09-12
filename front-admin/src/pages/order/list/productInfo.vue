<template>
  <div class="table-paragraph-cell">
    <p>
      <span class="label">商品名称：</span>
      <span class="con">【{{ $val(row, 'goodsCode') }}】{{ $val(row, 'goodsName') }}</span>
    </p>
    <p>
      <span class="label">套餐：</span>
      <span class="con">{{ $val(row, 'pkgName') }}</span>
    </p>
    <p>
      <template v-if="$val(row, 'qtyAdults')">
        <span class="label">成人：</span>
        <span class="con pr-10">￥{{ $val(row, 'unitPriceAdults') }}/{{ $val(row, 'qtyAdults') }}</span>
      </template>
      <template v-if="$val(row, 'qtyChild')">
        <span class="label">儿童：</span>
        <span class="con pr-10">￥{{ $val(row, 'unitPriceChild') }}/{{ $val(row, 'qtyChild') }}</span>
      </template>
      <template v-if="$val(row, 'qtyBaby')">
        <span class="label">婴儿：</span>
        <span class="con">￥{{ $val(row, 'unitPriceBaby') }}/{{ $val(row, 'qtyBaby') }}</span>
      </template>
      <template v-if="$val(row, 'qty')">
        <span class="label">数量：</span>
        <span class="con">￥{{ $val(row, 'unitPrice') }}/{{ $val(row, 'qty') }}</span>
      </template>
    </p>
    <p>
      <span class="label">卖家：</span>
      <span class="con">爱趣</span>
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
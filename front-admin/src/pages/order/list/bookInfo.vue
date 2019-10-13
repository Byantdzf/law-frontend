<template>
  <div class="table-paragraph-cell">
    <p>
      <span class="label">联系人：</span>
      <span class="con"></span>
    </p>
    <p>
      <span class="label">联系电话：</span>
      <span class="con"></span>
    </p>
    <p>
      <span class="label">邮箱：</span>
      <span class="con"></span>
    </p>
    <p>
      <span class="label">微信号：</span>
      <span class="con"></span>
    </p>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    row: Object
  },
  computed: {
    order() {
      return {}
    }
  }
}
</script>
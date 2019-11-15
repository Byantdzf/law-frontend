
<template>
  <el-row>
    <Detail class="dialog-content" :row="row" v-show="tab == 'detail'"/>
    <OrderInfo :row="row" v-show="tab == 'orderInfo'"/>
  </el-row>
</template>

<script>
export default {
  components: {
    Detail: () => import('./detail'),
    OrderInfo: () => import('./orderInfo'),
  },
  mixins: [],
  props: {
    row: Object,
    tab: {
      type: [String, Number],
      default: 1
    }
  }
}

</script>

<style lang="less">
.dialog-content {
  width: 800px;
  margin: 0 auto;
}
</style>

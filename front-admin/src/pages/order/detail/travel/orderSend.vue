<template>
  <div class="layui-form updateBox-form pr20 sendBox">
    <div class="layui-form-item voucherBox" v-html="voucherBox"></div>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    name: 'orderSend',
    inheritAttrs: false,
    props: {
      row: Object
    },
    data() {
      return {
        voucherBox: '',
        orderId: '',
      }
    },
    mounted() {
      this.orderId=this.$route.query.orderId;
      this.getSendHtml();
    },
    methods: {
      getSendHtml() {
        let params = {
          "orderId": this.orderId
        };
        this.getSendTravelConfirmLetterHtml(params).then((res) => {
          this.voucherBox = res.data;
        })
      },
      ...mapActions('order', [
        'getSendTravelConfirmLetterHtml', 'sendTravelConfirmLetter'
      ])
    },

  }
</script>
<style scoped>
  .sendBox{
    width: 800px!important;
    margin: 0 auto;
    padding-bottom: 40px;
  }
</style>
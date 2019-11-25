<template>
  <div>
    <el-card>
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">发布人信息</span>
        </el-row>
      </el-row>
      <PublishInfo :row="row"/>
    </el-card>
    <el-card class="mt-10">
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">订单信息</span>
        </el-row>
      </el-row>
      <BaseInfo4 :row="row" />
    </el-card>
    <el-card class="mt-10" v-if="showMoreInfo">
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">支付流水信息</span>
        </el-row>
      </el-row>
      <PaymentFlowInfo :row="row" />
    </el-card>
  </div>
</template>

<script>
import PublishInfo from './common/PublishInfo'
import BaseInfo4 from './common/BaseInfo4'
import PaymentFlowInfo from './common/PaymentFlowInfo'

export default {
  components: {
    PublishInfo,
    BaseInfo4,
    PaymentFlowInfo,
  },
  props: {
    row: Object
  },
  computed: {
    showMoreInfo() {
      return ![5, 10, 70].includes(+this.$val(this.row, 'orderStatus'))
    }
  },
}
</script>
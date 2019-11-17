<template>
  <div class="order-detail">
    <el-card>
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">发布人信息</span>
        </el-row>
      </el-row>
      <PublishInfo :row="row" />
    </el-card>
    <el-card class="mt-10">
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">订单信息</span>
        </el-row>
      </el-row>
      <BaseInfo1 :row="row" v-if="$t(row, 'orderType') == 1"/>
      <BaseInfo3 :row="row" v-else-if="$t(row, 'orderType') == 4"/>
      <BaseInfo2 :row="row" v-else/>
    </el-card>
    <el-card class="mt-10">
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">支付流水信息</span>
        </el-row>
      </el-row>
      <PaymentFlowInfo :row="row" />
    </el-card>
    <el-card class="mt-10">
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">接单律师信息</span>
        </el-row>
      </el-row>
      <LawyerInfo :row="row" />
    </el-card>

    <app-dialog
      class="page-dialog"
      :width="dialogWidth"
      :height="dialogHeight"
      :title="dialogTitle"
      :visible="dialogVisible"
      :full="dialogIsFull"
      @close="closeDialog"
    >
      <component
        v-if="dialogVisible"
        ref="dialogComponent"
        :is="dialogComponent"
        :row="dialogForm"
        @cancel="closeDialog"
      />
    </app-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import PublishInfo from './PublishInfo'
import BaseInfo1 from './BaseInfo1'
import BaseInfo2 from './BaseInfo2'
import BaseInfo3 from './BaseInfo3'
import PaymentFlowInfo from './PaymentFlowInfo'
import LawyerInfo from './LawyerInfo'
import AppDialog from '@/mixins/dialog'

export default {
  components: {
    PublishInfo,
    BaseInfo1,
    BaseInfo2,
    BaseInfo3,
    PaymentFlowInfo,
    LawyerInfo,
  },
  mixins: [AppDialog],
  data() {
    return {
      row: {},
      orderStatus:'',
    }
  },
  methods: {
    sendEmail(){
      this.$router.openNewTab("/pages/order/detail/travel/orderSend", {
        orderId: this.row.orderId
      });
    },
    getOrderLog(){
      this.dialogIsFull = false;
      this.dialogWidth = "75%";
      this.dialogTitle = "订单日志";
      this.dialogForm = this.row || {};
      this.dialogVisible = true;
      this.dialogComponent = 'Log';
    },
    closeDialog(){
      this.dialogVisible = false;
    },
    async getDetails(id) {
      const res = await this.orderView(id)
      this.row = res.data || {}
      this.orderStatus=this.row.order.status
    },
    ...mapActions('order', [
      'orderView','orderLog',
    ])
  },
  mounted() {
    const { id } = this.$route.query
    this.getDetails(id)
  }
}
</script>

<style lang="less">
  .order-detail {
    .el-card__header {
      padding: 10px 20px;
      border-bottom: 0;
      .title {
        font-size: 16px;
        font-weight: bold;
      }
    }
    .el-card__body {
      padding-top: 0px;
    }
    .baseInfo-box {
      .label {
        position: relative;
        float: left;
        width: 86px;
        text-align: right;
        z-index: 10;
      }
      .con {
        float: left;
        width: 100%;
        margin-left: -86px;
        padding-left: 86px;
        line-height: 22px;
      }
      i {
        font-style: normal;
      }
    }
    .travelInfo-box {
      .label {
        width: 100px;
      }
      .con {
        margin-left: -100px;
        padding-left: 100px;
      }
    }
  }
</style>
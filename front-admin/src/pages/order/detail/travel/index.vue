<template>
  <div class="order-detail-travel">
    <el-card>
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">订单信息</span>
        </el-row>
        <el-row class="fr">
          <el-button size="mini" type="primary" @click="sendEmail" v-if="orderStatus != 1">出行确认函</el-button>
          <el-button size="mini" type="primary" @click="getOrderLog">订单日志</el-button>
        </el-row>
      </el-row>
      <BaseInfo :row="row" />
    </el-card>
    <el-card class="mt-10">
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">预定信息</span>
        </el-row>
      </el-row>
      <BookingInfo :row="row" />
    </el-card>
    <el-card class="mt-10">
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">附加项信息</span>
        </el-row>
      </el-row>
      <AddtionalInfo :row="row" />
    </el-card>
    <el-card class="mt-10">
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">出行信息（TRAVEL INFORMATION）</span>
        </el-row>
      </el-row>
      <TravelInfo :row="row" />
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
import BaseInfo from './baseInfo'
import BookingInfo from './bookingInfo'
import AddtionalInfo from './addtionalInfo'
import TravelInfo from './travelInfo'
import AppDialog from '@/mixins/dialog'
import Log from './log'


export default {
  components: {
    BaseInfo,
    BookingInfo,
    AddtionalInfo,
    TravelInfo,
    Log,
    OrderSend: () => import('./orderSend')
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
  .order-detail-travel {
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

    .travelInfo-box,
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
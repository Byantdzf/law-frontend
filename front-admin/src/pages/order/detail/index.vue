<template>
  <div class="order-detail">
    <el-card>
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">发布人信息</span>
        </el-row>
      </el-row>
      <PublishInfo :row="orderInfo" />
    </el-card>
    <el-card class="mt-10">
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">订单信息</span>
        </el-row>
      </el-row>
      <BaseInfo1 :row="orderInfo" v-if="$val(row, 'orderType') == 1"/>
      <BaseInfo3 :row="orderInfo" v-else-if="$val(row, 'orderType') == 4"/>
      <BaseInfo2 :row="orderInfo" v-else/>
    </el-card>
    <el-card class="mt-10" v-if="$val(row, 'orderStatus') != '10'">
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">支付流水信息</span>
        </el-row>
      </el-row>
      <PaymentFlowInfo :row="orderInfo" />
    </el-card>
    <el-card class="mt-10" v-if="$val(row, 'orderStatus') != '10' && $val(row, 'orderStatus') != '20'">
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">接单律师信息</span>
        </el-row>
      </el-row>
      <LawyerInfo :row="orderInfo" />
    </el-card>
    <el-card class="mt-10" v-if="$val(row, 'orderStatus') == '60'">
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">对律师评价</span>
        </el-row>
      </el-row>
      <CommentInfo :row="orderInfo" />
    </el-card>
    <el-card class="mt-10" v-if="$val(row, 'userOperateRecord.id')">
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">用户申诉信息</span>
        </el-row>
      </el-row>
      <AppealInfo :row="orderInfo" />
    </el-card>

    <el-row class="btn-box ta-c" v-if="$val(row, 'orderStatus') == '10'">
      <el-button type="primary" @click="handleCancelOrder">取消订单</el-button>
      <el-button type="primary" @click="handleConfirmOrderPay" v-if="$val(row, 'orderType') == 2 || $val(row, 'orderType') == 3">已支付</el-button>
    </el-row>

    <el-row class="btn-box ta-c" v-if="$val(row, 'orderStatus') == '20'">
      <el-button type="primary" @click="handleCancelOrder">取消订单</el-button>
      <el-button type="primary" @click="handleHealthyStatus">
        {{ $val(row, 'orderHealthyStatus') == 2 ? '暂停订单' : '继续订单' }}
      </el-button>
      <el-button type="primary" @click="handleModifyOrderDispatchWay" v-if="$val(row, 'orderType') != 4">修改派单方式</el-button>
    </el-row>

    <el-row class="btn-box ta-c" v-if="$val(row, 'orderStatus') == '40' || $val(row, 'orderStatus') == '50'">
      <el-button type="primary" @click="handleCancelOrder">取消订单</el-button>
      <el-button type="primary" @click="handleConfirmOrderDone">完成确认</el-button>
      <template v-if="$val(row, 'userOperateRecord.id')">
        <el-button type="primary">重新进行派单</el-button>
      </template>
    </el-row>

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
        @submit="formSubmit"
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
import CommentInfo from './CommentInfo'
import AppealInfo from './AppealInfo'
import AppDialog from '@/mixins/dialog'

export default {
  components: {
    PublishInfo,
    BaseInfo1,
    BaseInfo2,
    BaseInfo3,
    PaymentFlowInfo,
    LawyerInfo,
    CommentInfo,
    AppealInfo,
    OrderConfirmAmount: () => import('./OrderConfirmAmount'),
    OrderRuleEdit: () => import('../rule/edit')
  },
  mixins: [AppDialog],
  props: {
    row: Object
  },
  data() {
    return {
      orderInfo: {}
    }
  },
  watch: {
    row: {
      handler: function() {
        this.getDetails()
      },
      deep: true
    }
  },
  methods: {
    async getDetails() {
      const res = await this.orderView({ orderId: this.row.id })
      this.orderInfo = res.data || {}
    },
    closeDialog(){
      this.dialogVisible = false;
    },
    async handleCancelOrder() {
      try {
        await this.$confirm('确认取消此订单吗？', '温馨提示', { type: 'warning' })
        await this.orderCancel({ orderId: this.orderInfo.id })
        this.$msgSuccess('操作成功！')
        this.getDetails()
      } catch (error) {
        
      }
    },
    async handleConfirmOrderDone() {
      try {
        await this.$confirm('确认完成此订单吗？', '温馨提示', { type: 'warning' })
        await this.orderUpdateOrderStatus({ orderId: this.orderInfo.id, orderStatus: 60 })
        this.$msgSuccess('操作成功！')
        this.getDetails()
      } catch (error) {
        
      }
    },
    async handleHealthyStatus() {
      try {
        // 订单健康状态 1、暂停 2、正常
        if(this.orderInfo.orderHealthyStatus == 1) {
          await this.$confirm('确认继续此订单吗？', '温馨提示', { type: 'warning' })
          await this.orderModifyHealthyStatus({ orderId: this.orderInfo.id, orderHealthyStatus: 2 })
          this.$msgSuccess('操作成功！')
          this.getDetails()
        } else {
          await this.$confirm('确认暂停此订单吗？', '温馨提示', { type: 'warning' })
          await this.orderModifyHealthyStatus({ orderId: this.orderInfo.id, orderHealthyStatus: 1 })
          this.$msgSuccess('操作成功！')
          this.getDetails()
        }
      } catch (error) {
        
      }
    },
    async handleModifyOrderDispatchWay() {
      this.orderInfo.rule = this.orderInfo.dispatchWay
      this.dialogWidth = '400px'
      this.dialogTitle = '修改派单规则'
      this.dialogForm = this.orderInfo
      this.dialogComponent = 'OrderRuleEdit'
      this.dialogVisible = true
    },
    async handleConfirmOrderPay() {
      this.dialogWidth = '400px'
      this.dialogTitle = '确认订单金额'
      this.dialogForm = this.orderInfo
      this.dialogComponent = 'OrderConfirmAmount'
      this.dialogVisible = true
    },
    async formSubmit(form) {
      let { id: orderId, rule: dispatchWay, amount: fee } = form
      switch(this.dialogComponent) {
        case 'OrderRuleEdit':
          await this.orderModifyDispatchWay({ orderId, dispatchWay })
          this.$msgSuccess('操作成功！')
          this.getDetails()
          break;
        case 'OrderConfirmAmount':
          await this.orderComfirmOrderAmount({ orderId, fee })
          this.$msgSuccess('操作成功！')
          this.getDetails()
          break;
      }
    },
    ...mapActions('order', [
      'orderView',
      'orderModifyDispatchWay',
      'orderCancel',
      'orderUpdateOrderStatus',
      'orderComfirmOrderAmount',
      'orderReDispatchOrder',
      'orderModifyHealthyStatus',
    ])
  },
  mounted() {
    this.getDetails()
  }
}
</script>

<style lang="less">
  .order-detail {
    width: 900px;
    margin: 0 auto;
    .el-card__header {
      padding: 10px 20px;
      border-bottom: 0;
      .title {
        font-size: 15px;
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
        width: 120px;
        text-align: right;
        z-index: 10;
      }
      .con {
        float: left;
        width: 100%;
        margin-left: -120px;
        padding-left: 120px;
        line-height: 22px;
      }
      i {
        font-style: normal;
      }
    }
  }
</style>
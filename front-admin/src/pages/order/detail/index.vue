<template>
  <div class="order-detail">
    <component
      :is="detailComponent"
      :row="orderInfo"
    />

    <template v-if="$val(orderInfo, 'orderStatus') != '70'">
      <el-row class="btn-box ta-c" v-if="$val(orderInfo, 'orderStatus') == '10'">
        <el-button type="primary" @click="handleCancelOrder">取消订单</el-button>
        <el-button type="primary" @click="handleConfirmOrderPay" v-if="$val(orderInfo, 'orderType') == 2 || $val(orderInfo, 'orderType') == 3">已支付</el-button>
      </el-row>

      <el-row class="btn-box ta-c" v-if="$val(orderInfo, 'orderStatus') == '20'">
        <el-button type="primary" @click="handleCancelOrder">取消订单</el-button>
        <el-button type="primary" @click="handleHealthyStatus">
          {{ $val(orderInfo, 'orderHealthyStatus') == 2 ? '暂停订单' : '继续订单' }}
        </el-button>
        <el-button type="primary" @click="handleModifyOrderDispatchWay" v-if="$val(orderInfo, 'orderType') != 4">修改派单方式</el-button>
      </el-row>

      <el-row class="btn-box ta-c" v-if="$val(orderInfo, 'orderStatus') == '40' || $val(orderInfo, 'orderStatus') == '50'">
        <el-button type="primary" @click="handleCancelOrder">取消订单</el-button>
        <el-button type="primary" @click="handleConfirmOrderDone">完成确认</el-button>
        <template v-if="$val(orderInfo, 'userOperateRecord.id')">
          <el-button type="primary">重新进行派单</el-button>
        </template>
      </el-row>
    </template>

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
import AppDialog from '@/mixins/dialog'

export default {
  components: {
    Online: () => import('./Online.vue'),
    OneByOne: () => import('./OneByOne.vue'),
    Block: () => import('./Block.vue'),
    ChargingAgent: () => import('./ChargingAgent.vue'),
    RiskAgent: () => import('./RiskAgent.vue'),
    TemplateFile: () => import('./TemplateFile.vue'),
    ConfirmAmount: () => import('@/pages/order/common/ConfirmAmount'),
    OrderRule: () => import('@/pages/order/common/OrderRule')
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
  computed: {
    detailComponent() {
      let name = 'TemplateFile'
      let { orderType, orderCategory } = this.orderInfo
      if (orderType == '2') {
        name = 'Block'
      }
      if (orderCategory == '11') {
        name = 'Online'
      }
      if (orderCategory == '12') {
        name = 'OneByOne'
      }
      if (orderCategory == '31') {
        name = 'ChargingAgent'
      }
      if (orderCategory == '32') {
        name = 'RiskAgent'
      }
      return name
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
      this.dialogComponent = 'OrderRule'
      this.dialogVisible = true
    },
    async handleConfirmOrderPay() {
      this.dialogWidth = '400px'
      this.dialogTitle = '确认订单金额'
      this.dialogForm = this.orderInfo
      this.dialogComponent = 'ConfirmAmount'
      this.dialogVisible = true
    },
    async formSubmit(form) {
      let { id: orderId, rule: dispatchWay, amount: fee } = form
      try {
        switch(this.dialogComponent) {
          case 'OrderRule':
            await this.orderModifyDispatchWay({ orderId, dispatchWay })
            this.$msgSuccess('操作成功！')
            this.getDetails()
            this.closeDialog()
            break;
          case 'ConfirmAmount':
            await this.orderComfirmOrderAmount({ orderId, fee })
            this.$msgSuccess('操作成功！')
            this.getDetails()
            this.closeDialog()
            break;
        }
      } catch (error) {
        // error
        console.log(error)
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
      'orderPayed',
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
    .btn-box {
      margin-top: 20px;
    }
  }
</style>
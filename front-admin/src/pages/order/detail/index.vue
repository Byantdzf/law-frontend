<template>
  <div class="order-detail">
    <component
      :is="detailComponent"
      :row="orderInfo"
    />

    <!-- 订单取消状态，和法律文件类型订单不会有操作按钮 -->
    <template v-if="$val(orderInfo, 'orderStatus') != '70' && $val(orderInfo, 'orderType') != '4'">

      <!-- 在线法律咨询，分块法律服务, 收费委托 -->
      <el-row class="btn-box ta-c" v-if="showBtns">
        <el-button type="danger" @click="handleCancelOrder" v-if="showCancelBtn">取消订单</el-button>
        <!-- 订单待支付状态 -->
        <template v-if="$val(orderInfo, 'orderStatus') == '10' && $val(orderInfo, 'orderCategory') == '31'">
          <el-button type="primary" @click="handleModifyOrderAmount">修改订单金额</el-button>
          <el-button type="primary" @click="handleConfirmOrderPay">已支付</el-button>
        </template>
        <!-- 订单待接单状态 -->
        <template v-if="$val(orderInfo, 'orderStatus') == '20'">
          <el-button type="primary" @click="handleHealthyStatus">
            {{ $val(orderInfo, 'orderHealthyStatus') == 2 ? '暂停订单' : '继续订单' }}
          </el-button>
          <el-button type="primary" @click="handleModifyOrderDispatchWay">修改派单方式</el-button>
        </template>
        <!-- 用户申诉 -->
        <template v-if="$val(orderInfo, 'userOperateRecord.id')">
          <el-button type="primary" @click="handleFixImmediately" v-if="$val(orderInfo, 'userOperateRecord.dealStatus') == 0">立即解决</el-button>
          <el-button type="primary" @click="handleReDispatch">重新进行派单</el-button>
        </template>
        <!-- 订单完成待确认状态 -->
        <el-button type="primary" @click="handleConfirmOrderDone" v-if="$val(orderInfo, 'orderStatus') == '40'">完成确认</el-button>
      </el-row>

      <!-- 风险委托 -->
      <el-row class="btn-box ta-c" v-if="$val(orderInfo, 'orderCategory') == '32'">
        <el-button type="primary" @click="handleModifyOrderStatus" v-if="showModifyStatusBtn">修改订单状态</el-button>
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
    OrderRule: () => import('@/pages/order/common/OrderRule'),
    OrderLawyers: () => import('@/pages/order/common/OrderLawyers'),
    OrderModifyStatus: () => import('@/pages/order/common/OrderModifyStatus'),
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
    // 显示哪种订单类型的详情页
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
    },
    // 显示各种按钮
    showBtns() {
      const orderType = this.$val(this.orderInfo, 'orderType')
      const orderCategory = this.$val(this.orderInfo, 'orderCategory')
      return orderType == '1' || orderType == '2' || orderCategory == '31'
    },
    // 是否显示取消订单按钮
    showCancelBtn() {
      const status = this.$val(this.orderInfo, 'orderStatus')
      return !(status == '50' || status == '60' || status == '70')
    },
    // 是否显示修改订单状态的按钮
    showModifyStatusBtn() {
      const status = this.$val(this.orderInfo, 'orderStatus')
      return !(status == '60' || status == '70')
    },
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
    // 获取订单详情
    async getDetails() {
      const res = await this.orderView({ orderId: this.row.id })
      this.orderInfo = res.data || {}
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    // 取消此订单
    async handleCancelOrder() {
      try {
        await this.$confirm('确认取消此订单吗？', '温馨提示', { type: 'warning' })
        await this.orderCancel({ orderId: this.orderInfo.id })
        this.$msgSuccess('操作成功！')
        this.getDetails()
      } catch (error) {
        
      }
    },
    // 确认订单完成
    async handleConfirmOrderDone() {
      try {
        await this.$confirm('确认完成此订单吗？', '温馨提示', { type: 'warning' })
        await this.orderConfirm({ orderId: this.orderInfo.id })
        this.$msgSuccess('操作成功！')
        this.getDetails()
      } catch (error) {
        
      }
    },
    // 暂停或者继续订单
    async handleHealthyStatus() {
      const { id: orderId, orderHealthyStatus } = this.orderInfo
      try {
        // 订单健康状态 1、暂停 2、正常
        if(this.orderInfo.orderHealthyStatus == 1) {
          await this.$confirm('确认继续此订单吗？', '温馨提示', { type: 'warning' })
          await this.orderModifyHealthyStatus({ orderId, orderHealthyStatus: 2 })
          this.$msgSuccess('操作成功！')
          this.getDetails()
        } else {
          await this.$confirm('确认暂停此订单吗？', '温馨提示', { type: 'warning' })
          await this.orderModifyHealthyStatus({ orderId, orderHealthyStatus: 1 })
          this.$msgSuccess('操作成功！')
          this.getDetails()
        }
      } catch (error) {
        
      }
    },
    // 点击修改派单规则按钮
    async handleModifyOrderDispatchWay() {
      this.orderInfo.rule = this.orderInfo.dispatchWay
      this.dialogWidth = '400px'
      this.dialogTitle = '修改派单规则'
      this.dialogForm = this.orderInfo
      this.dialogComponent = 'OrderRule'
      this.dialogVisible = true
    },
    // 确认订单已支付
    async handleConfirmOrderPay() {
      try {
        await this.$confirm('确认此订单已支付？', '温馨提示', { type: 'warning' })
        await this.orderPayed({ orderId: this.orderInfo.id })
        this.$msgSuccess('操作成功！')
        this.getDetails()
      } catch (error) {
        
      }
    },
    // 点击修改订单金额按钮
    handleModifyOrderAmount() {
      this.dialogWidth = '400px'
      this.dialogTitle = '确认订单金额'
      this.dialogForm = this.orderInfo
      this.dialogComponent = 'ConfirmAmount'
      this.dialogVisible = true
    },
    // 点击修改订单状态按钮
    handleModifyOrderStatus() {
      this.dialogWidth = '400px'
      this.dialogTitle = '修改订单状态'
      this.dialogForm = this.orderInfo
      this.dialogComponent = 'OrderModifyStatus'
      this.dialogVisible = true
    },
    // 立即解决用户申诉
    async handleFixImmediately() {
      await this.orderImmediateSolution({ id: this.orderInfo.id })
      this.$msgSuccess('操作成功！')
      this.getDetails()
    },
    // 重新进行派单
    async handleReDispatch() {
      await this.$confirm('确认重新派单？', '温馨提示', { type: 'warning' })
      await this.orderReDispatchOrder({ orderId: this.orderInfo.id })
      this.$msgSuccess('操作成功！')
      this.getDetails()
    },
    // 对话框表单提交
    async formSubmit(form) {
      const orderId = this.orderInfo.id
      let { rule: dispatchWay, amount: fee, lawyerId, orderStatus } = form
      try {
        switch(this.dialogComponent) {
          case 'OrderRule':
            if (dispatchWay == 1) {
              await this.orderModifyDispatchWay({ orderId, dispatchWay })
              this.$msgSuccess('操作成功！')
              this.getDetails()
              this.closeDialog()
            } else {
              this.dialogWidth = '800px'
              this.dialogTitle = '选择律师发送'
              this.dialogForm = this.orderInfo
              this.dialogComponent = 'OrderLawyers'
              this.dialogVisible = true
            }
            break;
          case 'OrderLawyers':
            await this.orderModifyDispatchWay({ orderId, dispatchWay: 2, lawyerId })
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
          case 'OrderModifyStatus':
            await this.orderUpdateOrderStatus({ orderId, orderStatus })
            if(fee || fee === 0) {
              await this.orderComfirmOrderAmount({ orderId, fee })
            }
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
      'orderConfirm',
      'orderUpdateOrderStatus',
      'orderComfirmOrderAmount',
      'orderReDispatchOrder',
      'orderModifyHealthyStatus',
      'orderPayed',
      'orderImmediateSolution',
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
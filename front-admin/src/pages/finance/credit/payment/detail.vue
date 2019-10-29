<template>
  <div class="dialog-detail">
    <div class="app-rows">
      <el-row class="app-row">
        <span class="label ib">商户名称：</span>
        <span class="ib">{{ row.tenantName }}</span>
      </el-row>
      <el-row class="app-row">
        <span class="label ib">结算订单金额：</span>
        <span class="ib cl-error price">￥{{ row.paymentAmount }}</span>
      </el-row>
      <el-row class="app-row">
        <span class="label ib">付款时间：</span>
        <span class="ib">{{ row.paymentTime }}</span>
      </el-row>
      <el-row class="app-row" v-if="row.paymentType == 1">
        <span class="label ib">付款方式：</span>
        <span class="ib">{{ $t('rs.onlinePayType')[row.onlinePayType] }}</span>
      </el-row>
      <el-row class="app-row" v-else>
        <span class="label ib">收款账户：</span>
        <span class="ib">{{ row.receiptBankName }}</span>
      </el-row>
      <el-row class="app-row" v-if="row.paymentType == 1">
        <span class="label ib">收款流水号：</span>
        <span class="ib">{{ row.serialNumber }}</span>
      </el-row>
      <el-row class="app-row">
        <span class="label ib">收款状态：</span>
        <span :class="['ib status', statusClassNames]">{{ $t('rs.billStatus')[row.billStatus] }}</span>
      </el-row>
      <el-row class="app-row" v-if="row.billStatus == 3">
        <span class="label ib">驳回原因：</span>
        <span class="ib">{{ row.remark }}</span>
      </el-row>
      <el-row class="app-row">
        <el-image
          v-for="(img, idx) in certificates"
          :key="idx"
          :src="img"
          :preview-src-list="certificates">
        </el-image>
      </el-row>
    </div>
    <el-row class="btn-box mt-10 ta-r" v-if="row.billStatus == 1">
      <el-button type="primary" @click="handleBtnAction('confirm')">
        确认到账
      </el-button>
      <el-button type="warning" @click="handleBtnAction('rejection')">
        驳回
      </el-button>
    </el-row>
    <app-dialog
      class="page-dialog"
      title="驳回到账"
      width="500px"
      :visible="dialogVisible"
      @close="closeDialog"
    >
      <el-form label-width="90px">
        <el-form-item label="驳回原因：">
          <el-input type="textarea" v-model="remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="dialog-btn" type="primary" @click="submitForm">确定</el-button>
        </el-form-item>
      </el-form>
    </app-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import AppDialog from "@/mixins/dialog";
export default {
  mixins: [AppDialog],
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      remark: ''
    }
  },
  computed: {
    certificates() {
      return this.$val(this.row, 'certificate').split(',').filter(v => !!v)
    },
    statusClassNames() {
      const status = this.$val(this.row, 'billStatus')
      let n = ''
      switch (+status) {
        case 2:
          n = "cl-primary";
          break;
        case 0:
        case 1:
          n = "cl-warning";
          break;
        case 3:
        case 4:
        case 5:
          n = "cl-error";
          break;
      }
      return n
    }
  },
  methods: {
    async handleBtnAction(type) {
      try {
        const { id, tenantId } = this.row
        switch(type) {
          case 'confirm':
            await this.$confirm('确认到账金额一致！！！', '确认到账', {
              type: 'warning'
            })
            await this.paymentConfirmReceipt({ id, tenantId })
            this.$emit('refresh')
            break;
          case 'rejection':
            this.dialogVisible = true
            break;
        }
      } catch (error) {
        // error
      }
    },
    async submitForm() {
      const { id, tenantId } = this.row
      await this.paymentRejection({ id, tenantId, remark: this.remark })
      this.$emit('refresh')
      this.dialogVisible = false
    },
    ...mapActions('finance', [
      'paymentConfirmReceipt',
      'paymentRejection'
    ])
  }
}
</script>

<style lang="less">
  .dialog-detail {
    .app-rows {
      max-height: 500px;
      overflow: auto;
    }
    .app-row {
      padding: 10px 0;
      .label {
        min-width: 100px;
      }
      .price {
        font-size: 20px;
        font-weight: bold;
      }
      .status {
        font-size: 16px;
        font-weight: bold;
      }
    }
    .btn-box {
      .el-button {
        min-width: 100px;
      }
    }
  }
  .dialog-btn {
    min-width: 100px;
  }
</style>
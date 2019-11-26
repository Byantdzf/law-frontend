<template>
  <el-row class="dialog-detail orderModifyStatus">
    <el-form label-width="100px">
      <el-form-item label="订单状态：">
        <el-radio-group v-model="orderStatus" size="small">
          <el-radio
            v-for="(item, index) in items"
            :key="index"
            :label="item.id">
            {{ item.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="订单金额：" v-if="orderStatus == 60">
        <el-input v-model="amount"></el-input>
        <p class="cl-999">请输入该订单金额，方便系统统计</p>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="$emit('cancel')">取消</el-button>
        <el-button type="primary" @click="formSubmit">确认</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>
export default {
  props: {
    row: Object
  },
  data() {
    let items = []
    for(let k in this.$t('rs.orderStatus')) {
      if (!(k == 5 || k == 50 || k == 70)) {
        items.push({
          id: +k,
          name: this.$t('rs.orderStatus')[k]
        })
      }
    }
    return {
      items,
      orderStatus: +this.$val(this.row, 'orderStatus', 20),
      amount: this.$val(this.row, 'amount')
    }
  },
  methods: {
    // 表单提交
    formSubmit() {
      let params = {
        orderStatus: this.orderStatus,
        amount: this.amount,
        orderId: this.$val(this.row, 'id'),
      }
      if (this.orderStatus == 60 && !(this.amount || this.amount === 0)) {
        this.$msgError('请输入订单金额')
        return false
      }
      this.$emit('submit', params)
    }
  }
}

</script>

<style lang="less">
  .dialog-detail.orderModifyStatus {
    .title {
      font-size: 14px;
      margin-bottom: 10px;
    }
    .el-radio {
      display: block;
      line-height: 28px;
    }
  }
</style>

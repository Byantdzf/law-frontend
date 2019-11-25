<template>
  <el-row class="dialog-detail">
    <el-form label-width="100px">
      <el-form-item label="订单金额">
        <el-input v-model="amount"></el-input>
      </el-form-item>
      <el-form-item>
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
    let { amount } = this.row || {}
    return {
      amount,
    }
  },
  methods: {
    // 表单提交
    formSubmit() {
      let params = {
        amount: this.amount,
        id: this.$val(this.row, 'id'),
      }
      this.$emit('submit', params)
    }
  }
}

</script>

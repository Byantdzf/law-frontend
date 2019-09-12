<template>
  <el-row class="travelInfo-box" :gutter="10">
    <el-col :sm="12" :lg="6">
      <h4 class="sub-title mb-10">联系人信息</h4>
      <el-row>
        <span class="label cl-999">姓名：</span>
        <span class="con">{{ $val(row, 'orderContact.name') }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">姓名拼音：</span>
        <span class="con">{{ $val(row, 'orderContact.familyNamePinyin') }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">邮箱：</span>
        <span class="con">{{ $val(row, 'orderContact.email') }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">国内手机号：</span>
        <span class="con">{{ $val(row, 'orderContact.phoneChina') }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">境外手机号：</span>
        <span class="con">{{ $val(row, 'orderContact.phoneForeign') }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">微信号：</span>
        <span class="con">{{ $val(row, 'orderContact.wechat') }}</span>
      </el-row>
    </el-col>
    <el-col :sm="12" :lg="8">
      <h4 class="sub-title mb-10">客人行程信息</h4>
      <el-row v-for="(item, index) in orderTrip" :key="index">
        <span class="label cl-999">{{ item.itemName }}：</span>
        <span class="con">{{ item.itemValue }}</span>
      </el-row>
    </el-col>
    <el-col :sm="12" :lg="4">
      <h4 class="sub-title mb-10">接送附加费</h4>
      <el-row>
        <span class="label cl-999">附加费金额：</span>
        <span class="con">
          <i class="cl-error">￥{{ $val(row, 'orderAdditional.unitAmount', 0) }}</i>
          <span v-if="$val(row, 'orderAdditional.shuttleType') == 2">/趟</span>
          <span v-else>/人</span>
        </span>
      </el-row>
      <el-row>
        <span class="label cl-999">附加费总额：</span>
        <span class="con cl-error">￥{{ $val(row, 'orderAdditional.totalAmount', 0) }}</span>
      </el-row>
      <el-row>
        <span class="label cl-999">支付凭证：</span>
        <span class="con">{{ $val(row, 'orderAdditional.paidVoucher') }}</span>
      </el-row>
    </el-col>
    <el-col :sm="12" :lg="6">
      <h4 class="sub-title mb-10">出行人信息</h4>
      <el-row v-for="(item, index) in orderTravellers" :key="index">
        <el-row v-for="(v, idx) in item.orderTravellersItems" :key="idx">
          <span class="label cl-999">{{ v.itemName }}：</span>
          <span class="con">{{ v.itemValue }}</span>
        </el-row>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    row: Object
  },
  computed: {
    orderTrip() {
      const items = this.$val(this.row, 'orderTrip', [])
      
      return items.filter(item => item.checkbox == 1)
    },
    orderTravellers() {
      const items = this.$val(this.row, 'orderTravellers', [])
      return items.map(item => {
        let arr = item.orderTravellersItems || []
        item.orderTravellersItems = arr.filter(v => v.checkbox == 1)
        return item
      })
    }
  }
}
</script>
<template>
  <el-table
    :data="$val(row, 'orderAmendJourneyBoList', [])"
    border
    style="width: 100%"
  >
    <el-table-column prop="goodsName" label="商品" align="center">
      <template slot-scope="scope">
        <p class="cl-primary">
          <span v-if="scope.row.skuId">【{{ scope.row.skuId }}】</span>
          <span>{{ $val(scope.row, 'goodsName') }}</span>
        </p>
        <p>
          <span class="cl-999">套餐类型：</span>
          <span>{{ $val(scope.row, 'packageName') }}</span>
        </p>
      </template>
    </el-table-column>
    <el-table-column prop="qty" label="数量" align="center">
      <template slot-scope="scope">
        <template v-if="$val(row, 'order.saleUnit') == 2">
          <span>数量：{{ $val(scope.row, 'qty') }}</span>
        </template>
        <template v-else>
          <p v-if="saleUnitItems.includes('1')">成人：{{ $val(scope.row, 'adultQty') }}</p>
          <p v-if="saleUnitItems.includes('2')">
            {{ saleUnitItems.includes('5') ? '占床儿童' : '儿童' }}：
            {{ $val(scope.row, 'childQty') }}
          </p>
          <p v-if="saleUnitItems.includes('5')">不占床儿童：{{ $val(scope.row, 'noBedChildQty') }}</p>
          <p v-if="saleUnitItems.includes('3')">婴儿：{{ $val(scope.row, 'babyQty') }}</p>
          <p v-if="saleUnitItems.includes('6')">单房差：{{ $val(scope.row, 'roomDisparityQty') }}</p>
        </template>
      </template>
    </el-table-column>
    <el-table-column prop="travelDate" label="出行日期" align="center"></el-table-column>
  </el-table>
</template>

<script>
import { Table, TableColumn } from 'element-ui'
export default {
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  props: {
    row: Object
  },
  computed: {
    saleUnitItems() {
      return this.$val(this.row, 'order.saleUnitItems').split(',')
    }
  }
}
</script>
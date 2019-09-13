<template>
  <el-table
    :data="$val(row, 'additionItemBos', [])"
    border
    style="width: 100%"
  >
    <el-table-column prop="pkgName" label="附加项" align="center"></el-table-column>
    <el-table-column prop="qty" label="数量" align="center">
      <template slot-scope="scope">
        <template v-if="$val(scope.row, 'qty')">
          <span>数量：{{ $val(scope.row, 'qty') }}</span>
        </template>
        <template v-else>
          <p v-if="$val(scope.row, 'adultQty')">成人：{{ $val(scope.row, 'adultQty') }}</p>
          <p v-if="$val(scope.row, 'childQty')">儿童：{{ $val(scope.row, 'childQty') }}</p>
          <p v-if="$val(scope.row, 'babyQty')">婴儿：{{ $val(scope.row, 'babyQty') }}</p>
        </template>
      </template>
    </el-table-column>
    <el-table-column prop="ivyPrice" label="单价" align="center">
      <template slot-scope="scope">
        <template v-if="$val(scope.row, 'qty')">
          <span>{{ $val(scope.row, 'ivyPrice') }}</span>
        </template>
        <template v-else>
          <p v-if="$val(scope.row, 'adultQty')">成人：{{ $val(scope.row, 'ivyPriceAdult') }}</p>
          <p v-if="$val(scope.row, 'childQty')">儿童：{{ $val(scope.row, 'ivyPriceChild') }}</p>
          <p v-if="$val(scope.row, 'babyQty')">婴儿：{{ $val(scope.row, 'ivyPriceBaby') }}</p>
        </template>
      </template>
    </el-table-column>
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
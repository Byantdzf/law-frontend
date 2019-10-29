<template>
  <el-row class="dialog-orders">
    <div class="mb-10">
      <span class="cl-sub">合计：</span>
      <span class="cl-error price">￥{{ orderAmount }}</span>
    </div>
    <app-table
      ref="appTable"
      url="/ptFinanceTenantCredit/payment/queryPageDetail"
      :params="tableParams"
      :columns="columns"
      :max-height="500"
      column-type="index"
    />
  </el-row>
</template>

<script>
  import AppTable from '@/mixins/table'
  export default {
    mixins: [AppTable],
    props: {
      row: Object
    },
    data() {
      const { tenantId, id: paymentId } = this.row || {} 
      return {
        tableParams: {
          tenantId,
          paymentId
        },
        columns: [
          {
            label: '订单编号',
            field: 'orderNo',
          },{
            label: '订单金额',
            field: 'orderAmount',
            width: 120,
            align: 'center',
            formater: (row) => '￥' + (row.orderAmount || 0)
          },{
            label: '商户名称',
            field: 'tenantName',
            align: 'center'
          },{
            label: '下单时间',
            field: 'orderTime',
            align: "center"
          },{
            label: '出行时间',
            field: 'travelDate',
            align: "center",
            formater({ travelDate }) {
              if (travelDate) {
                return new Date(travelDate).format('yyyy-MM-dd')
              } else {
                return ''
              }
            }
          }
        ]
      }
    },
    computed: {
      orderAmount() {
        return this.row.paymentAmount || 0
      }
    },
    watch: {
      row: {
        handler: function(nv) {
          const { tenantId, id: paymentId } = nv || {}
          this.tableParams = {
            tenantId,
            paymentId
          }
        },
        deep: true
      }
    }
  }
</script>

<style lang="less">
  .dialog-orders {
    .price {
      font-size: 20px;
      font-weight: bold;
    }
  }
</style>

<template>
  <el-row class="dialog-orders">
    <div class="mb-10">
      <span class="cl-sub">合计：</span>
      <span class="cl-error price">￥{{ orderAmount }}</span>
    </div>
    <app-table
      ref="appTable"
      url="/ptFinanceTenantCredit/creditOrder/queryPage"
      :params="tableParams"
      :columns="columns"
      :max-height="500"
    />
  </el-row>
</template>

<script>
  import { mapActions } from 'vuex'
  import AppTable from '@/mixins/table'
  import AppRsText from '@/components/app-table/lib/rsText'
  export default {
    components: {
      
    },
    mixins: [AppTable],
    props: {
      row: Object
    },
    data() {
      const { tenantId } = this.row || {} 
      return {
        tableParams: {
          tenantId
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
            label: '订单状态',
            field: 'orderStatus',
            width: 120,
            align: 'center',
            component: AppRsText,
            propsHandler: ({ row, value }) => this.getOrderStatusTag(row, value)
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
        ],
        orderAmount: 0
      }
    },
    watch: {
      row: {
        handler: function(nv) {
          const { tenantId } = nv || {}
          this.tableParams = {
            tenantId
          }
          this.getOrderAmmount(tenantId)
        },
        deep: true
      }
    },
    methods: {
      async getOrderAmmount(tenantId) {
        const res = await this.queryOrderAmount({ tenantId })
        this.orderAmount = res.data || 0
      },
      getOrderStatusTag(row, value) {
        let type = "warning";
        let rsKey = "orderStatus";
        if (row.orderType == 3) {
          rsKey = "hotOrderStatus";
          switch (+value) {
            case 2:
            case 20:
              type = "success";
              break;
            case 5:
            case 8:
              type = "info";
              break;
          }
        } else {
          rsKey = "orderStatus";
          switch (+value) {
            case 9:
            case 10:
              type = 'success'
              break;
            case 4:
            case 5:
              type = 'danger'
              break;
          }
        }

        return { type, rsKey };
      },
      ...mapActions('finance', [
        'queryOrderAmount',
      ])
    },
    created() {
      if (this.row && this.row.tenantId) {
        this.getOrderAmmount(this.row.tenantId)
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

<template>
  <el-row>
    <h3 class="mb-10">合计：{{ total }}</h3>
    <app-table 
      ref="appTable"
      url="/salesCount/queryOrderList"
      list-key="orderList"
      :columns="columns"
      :params="tableParams"
      max-height="600"
      @dataReady="handleDateReady"
    />
    <app-dialog
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
        @cancel="closeDialog"
      />
    </app-dialog>
  </el-row>
</template>

<script>
  import { mapActions } from 'vuex'
  import AppTable from '@/mixins/table'
  import AppDialog from '@/mixins/dialog'
  import AppRsText from '@/components/app-table/lib/rsText'

  export default {
    components: {
      TravelOrderDetail: () => import('@/pages/order/detail/travel')
    },
    mixins: [AppTable, AppDialog],
    props: {
      row: Object
    },
    data() {
      const { tenantId, tenantType, params } = this.row || {}
      return {
        columns: [
          {
            label: '订单编号',
            field: 'orderNo',
            type: 'button',
            align: 'center',
            default: '详情',
            on: {
              click: ({ row }) => {
                this.handleBtnAction('detail', row)
              }
            }
          },{
            label: '订单状态',
            field: 'status',
            rs: 'orderStatus',
            width: 110,
            align: 'center',
            component: AppRsText,
            propsHandler ({ value }) {
              let type = 'warning'
              switch (+value) {
                case 9:
                  type = 'success'
                  break;
                case 4:
                case 5:
                case 10:
                  type = 'danger'
                  break;
              }
              return { type }
            }
          },{
            label: '下单时间',
            field: 'createTime',
            width: 140
          },{
            label: '出行时间',
            field: 'travelDate',
            width: 100,
            formater({ travelDate }) {
              if (travelDate) {
                return new Date(travelDate).format('yyyy-MM-dd')
              } else {
                return ''
              }
            }
          },{
            label: '订单总金额',
            field: 'orderAmount',
            width: 120
          },{
            label: '出行人数',
            field: 'nums',
            formater: (row) => {
              const { qty, qtyAdults, qtyChild, qtyBaby } = row
              
              if (qty) {
                return `数量：${ qty }`
              } else {
                let arr = []
                if (qtyAdults) {
                  arr.push(`成人：${ qtyAdults }`)
                }
                if (qtyChild) {
                  arr.push(`儿童：${ qtyChild }`)
                }
                if (qtyBaby) {
                  arr.push(`婴儿：${ qtyBaby }`)
                }
                return arr.join(' ')
              }
            }
          }
        ],
        tableParams: {
          ...params,
          tenantId,
          tenantType
        },
        total: 0
      }
    },
    watch: {
      row: {
        handler: function(nv) {
          const { tenantId, tenantType, params } = nv
          this.tableParams = {
            ...params,
            tenantId,
            tenantType
          }
        },
        deep: true
      }
    },
    methods: {
      // 按钮点击事件
      async handleBtnAction(type, row) {
        switch (type) {
          case 'detail':
            this.$router.openNewTab('/order/detail/travel', { id: row.orderId })
            break;
        }
      },
      handleDateReady({ res }) {
        this.total = this.$val(res, 'data.sumAmount', 0)
      },
      ...mapActions('order', [
        'orderView',
      ])
    }
  }
</script>

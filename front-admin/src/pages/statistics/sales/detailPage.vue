<template>
  <el-row>
    <app-table 
      ref="appTable"
      url="/salesCount/querySalesDetailPage"
      :params="params"
      :columns="columns"
      :max-height="tableMaxHieght"
    />
  </el-row>
</template>

<script>
  import AppTable from '@/mixins/table'
  import AppRsText from '@/components/app-table/lib/rsText'
  export default {
    mixins: [AppTable],
    props: {
      params: Object
    },
    data() {
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
          },{
            label: '出行时间',
            field: 'travelDate',
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
          },{
            label: '商户名称',
            field: 'tenantName',
          },{
            label: '商户类别',
            field: 'tenantTypeName',
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
          },{
            label: '所属销售',
            field: 'name',
          }
        ]
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
      }
    }
  }
</script>

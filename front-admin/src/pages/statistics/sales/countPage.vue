<template>
  <el-row>
    <app-table 
      ref="appTable"
      url="/salesCount/querySalesCountPage"
      :columns="columns"
      :params="params"
      :max-height="tableMaxHieght"
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
  import AppTable from '@/mixins/table'
  import AppDialog from '@/mixins/dialog'
  export default {
    components: {
      SalesOrderList: () => import('./orderList')
    },
    mixins: [AppTable, AppDialog],
    props: {
      params: Object
    },
    data() {
      return {
        columns: [
          {
            label: '商户名称',
            field: 'tenantName',
          },{
            label: '商户类别',
            field: 'tenantTypeName',
          },{
            label: '订单总金额（元）',
            field: 'orderAmount',
          },{
            label: '最近下单时间',
            field: 'createTime'
          },{
            label: '商户所属销售',
            field: 'name',
            align: 'center'
          },{
            label: '操作',
            field: 'operate',
            type: 'button',
            align: 'center',
            default: '查看订单',
            width: 110,
            on: {
              click: ({ row }) => {
                this.handleBtnAction('check', row)
              }
            }
          }
        ]
      }
    },
    methods: {
      // 按钮点击事件
      async handleBtnAction(type, row) {
        switch (type) {
          case 'check':
            this.dialogWidth = '1000px'
            this.dialogTitle = `订单清单-${ row.tenantName }-${ row.tenantTypeName }`
            this.dialogForm = { ...row, params: this.params }
            this.dialogComponent = 'SalesOrderList'
            this.dialogVisible = true
            break;
        }
      }
    }
  }
</script>

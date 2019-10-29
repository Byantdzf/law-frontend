<template>
  <app-table
    ref="appTable"
    url="/ptFinanceTenantCredit/log/queryPage"
    :params="tableParams"
    :columns="columns"
    :max-height="600"
  />
</template>

<script>
  import AppTable from '@/mixins/table'
  export default {
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
            label: '操作类型',
            field: 'label',
            width: 120,
            align: 'center'
          },{
            label: '操作人',
            field: 'operatior',
            width: 140,
            align: 'center'
          },{
            label: '操作时间',
            field: 'operationTime',
            align: 'center',
            width: 140
          },{
            label: '操作内容',
            field: 'content',
            align: 'left'
          }
        ]
      }
    },
    watch: {
      row: {
        handler: function() {
          const { tenantId } = this.row
          this.tableParams = {
            tenantId
          }
        },
        deep: true
      }
    }
  }
</script>

<template>
  <el-row>
    <el-card class="table-card">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">派单规则</span>
        </el-row>
      </el-row>
      <app-table 
        ref="appTable"
        url="/order/rule"
        :columns="columns"
        @selection-change="tableSelect"
      />
    </el-card>
    <app-dialog
      :width="dialogWidth"
      :height="dialogHeight"
      :title="dialogTitle"
      :visible="dialogVisible"
      @close="closeDialog"
    >
      <component
        v-if="dialogVisible"
        :is="dialogComponent"
        :row="dialogForm"
        @submit="formSubmit"
        @cancel="closeDialog"
        ref="dialogComponent"
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
      OrderRule: () => import("../common/OrderRule"),
    },
    mixins: [AppTable, AppDialog],
    data() {
      return {
        columns: [
          {
            label: '序号',
            field: 'index',
            width: 70
          },{
            label: '订单类型',
            field: 'orderType',
            formater: ({ orderType }) => this.$t('rs.orderType')[orderType]
          },{
            label: '订单种类',
            field: 'orderCategory',
            formater: ({ orderCategory }) => this.$t('rs.orderCategory')[orderCategory]
          },{
            label: '当前派单方式',
            field: 'rule',
            formater: ({ rule }) => this.$t('rs.orderRule')[rule]
          },{
            label: '操作',
            field: 'operate',
            align: 'center',
            width: 120,
            type: 'button',
            default: '修改',
            on: {
              click: ({ row }) => {
                this.handleBtnAction(row, 'edit')
              }
            }
          }
        ]
      }
    },
    methods: {
      // 初始化页面
      initPage() {
      },
      // 表单提交
      async formSubmit(form) {
        try {
          if ('id' in form) {
            await this.orderRuleUpdate(form)
            this.closeDialog()
            this.refreshTable()
            this.$msgSuccess('修改成功')
          } else {
            await this.orderRuleAdd(form)
            this.closeDialog()
            this.refreshTable()
            this.$msgSuccess('添加成功')
          }
        } catch (e) {
          // error
        }
      },
      async handleBtnAction(row, type) {
        switch (type) {
          case 'edit':
            this.dialogWidth = '400px'
            this.dialogTitle = '修改派单规则'
            this.dialogForm = row
            this.dialogComponent = 'OrderRule'
            this.dialogVisible = true
            break;
          case 'del':
            await this.$confirm('确认删除此派单规则吗?', '温馨提示', { type: 'warning' })
            await this.orderRuleDel(row.id)
            this.$msgSuccess('操作成功！')
            this.refreshTable()
            break;
        }
      },
      ...mapActions('order', [
        'orderRuleUpdate',
        'orderRuleDel',
      ])
    },
    created() {
      this.initPage()
    }
  }
</script>

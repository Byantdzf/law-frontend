<template>
  <el-row>
    <el-card class="table-card mt-10">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">分佣管理</span>
        </el-row>
      </el-row>
      <app-table 
        ref="appTable"
        url="/mng/financialManage/queryPlatformCommissionRatio"
        :params="tableParams"
        :columns="columns"
        :columns-props="columnsProps"
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
  import AppSearch from '@/mixins/search'
  import AppRsText from '@/components/app-table/lib/rsText'
  export default {
    components: {
      Edit: () => import("./edit"),
    },
    mixins: [AppTable, AppDialog, AppSearch],
    data() {
      return {
        columns: [
          {
            label: '服务类型',
            field: 'orderType',
            formater: ({ orderType }) => this.$t('rs.orderType')[orderType]
          },{
            label: '服务种类',
            field: 'orderCategory',
            formater: ({ orderCategory }) => this.$t('rs.orderCategory')[orderCategory]
          },{
            label: '律师佣金比例',
            field: 'lawyerRatio',
            formater: ({lawyerRatio}) => {
              return (lawyerRatio * 100) + '%'
            }
          },{
            label: '平台佣金比例',
            field: 'platformRatio',
            formater: ({platformRatio}) => {
              return (platformRatio * 100) + '%'
            }
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
        ],
        columnsProps: {
          minWidth: 100,
        }
      }
    },
    methods: {
      // 初始化页面
      initPage() {
      },
      // 表单提交
      async formSubmit(form) {
        try {
          switch (this.dialogComponent) {
            case 'Edit':
              // await this.commissionUpdate(params)
              this.$msgSuccess('操作成功')
              this.closeDialog()
              this.refreshTable()
              break;
          }
        } catch (e) {
          // error
        }
      },
      async handleBtnAction(row, type) {
        let res = {}
        switch (type) {
          case 'edit':
              this.dialogWidth = '300px'
              this.dialogTitle = '分佣'
              this.dialogForm = row
              this.dialogComponent = 'Edit'
              this.dialogVisible = true
            break;
        }
      },
      ...mapActions('finance', [
        'commissionUpdate'
      ])
    },
    created() {
      this.initPage()
    }
  }
</script>

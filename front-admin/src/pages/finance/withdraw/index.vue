<template>
  <el-row>
    <el-card class="search-card">
      <app-form
        class="app-search"
        :init="searchFormInit"
        :items="searchItems"
        :btns="searchBtns"
        @confirm="confirmSearch"
        @reset="confirmSearch"
        ref="searchForm"
      />
    </el-card>
    <el-card class="table-card mt-10">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">提现管理</span>
        </el-row>
        <el-row class="fr">
          <el-button type="primary" @click="handleMultiPass">审核通过</el-button>
          <el-button type="primary" @click="handleMultiRefuse">审核不通过</el-button>
          <el-button type="primary" @click="handleMultiSubmit">确认转帐</el-button>
          <el-button type="primary" @click="handleMultiExport">导出</el-button>
        </el-row>
      </el-row>
      <app-table 
        ref="appTable"
        url="/mng/financialManage/queryCapitalApprovalInfoList"
        columnType="selection"
        :params="tableParams"
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
  import AppSearch from '@/mixins/search'
  import AppRsText from '@/components/app-table/lib/rsText'
  export default {
    components: {
      Edit: () => import("./edit"),
      Audit: () => import("./audit"),
      // Detail: () => import("./detail"),
      // HqDivide: () => import("./hqDivide"),
    },
    mixins: [AppTable, AppDialog, AppSearch],
    data() {
      return {
        defaultColumns: [
          {
            label: '序号',
            field: 'index',
            width: 100
          },{
            label: '律师姓名',
            field: 'lawyerName',
          },{
            label: '律师ID',
            field: 'lawyerId',
          },{
            label: '审核状态',
            field: 'approvalStatus',
            formater: ({ approvalStatus }) => this.$t('rs.approvalStatus')[approvalStatus]
          },{
            label: '提现金额',
            field: 'amount',
          },{
            label: '账号类型',
            field: 'cashOutAccountType',
            formater: ({ approvalStatus }) => this.$t('rs.payment')[approvalStatus]
          },{
            label: '提现账号',
            field: 'cashOutAccount',
          },{
            label: '账号姓名',
            field: 'cashOutAccountName',
          },{
            label: '申请时间',
            field: 'applyTime',
          },{
            label: '审核人',
            field: 'approverName',
          },{
            label: '备注',
            field: 'remark',
          }
        ]
      }
    },
    computed: {
      columns() {
        let operateItem = {
          label: '操作',
          field: 'operate',
          align: 'center',
          width: 120,
          type: 'button',
          formater: (row) => {
            let items = [{ label: '修改备注', code: 'edit' }]
            if (row.approvalStatus == '0') {
              items.push({ label: '审核', code: 'audit' })
            } else if (row.approvalStatus == '2') {
              items.push({ label: '确认转帐', code: 'submit' })
            }
            return items
          },
          on: {
            click: ({ row, btn }) => {
              this.handleBtnAction(row, btn.code)
            }
          }
        }
        return this.defaultColumns.concat([operateItem])
      }
    },
    methods: {
      // 初始化页面
      initPage() {
        this.$set(this.searchFormInit, 'align', 'left')

        this.searchItems = [
          {
            label: '申请时间',
            field: ['startDate', 'endDate'],
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间',
            type: 10
          },
          {
            label: '会员号',
            field: 'lawyerId',
            type: 1,
          },
          {
            label: '&nbsp;',
            field: 'keyWord',
            type: 1,
          },
        ]

        this.searchBtns = [
          {
            label: '确认',
            code: 'confirm'
          }, {
            label: '重置',
            code: 'reset',
            type: 'default'
          }
        ]
      },
      // 表单提交
      async formSubmit(form) {
        try {
          switch (this.dialogComponent) {
            case 'Edit':
              await this.withDrawStatics(form)
              this.closeDialog()
              this.refreshTable()
              this.$msgSuccess('修改成功')
              break;
            case 'Audit':
              if (form.actionType == 'submit') {
                delete(form.actionType)
                await this.authSubmit(form)
              } else {
                delete(form.actionType)
                await this.authRefuse(form)
              }
              this.closeDialog()
              this.refreshTable()
              this.$msgSuccess('修改成功')
              break;
          }
        } catch (e) {
          // error
        }
      },
      async handleBtnAction(row, type) {
        try {
          // let res = {}
          switch (type) {
            case 'submit':
              await this.$confirm('确认转帐?', '温馨提示', { type: 'warning' })
              await this.withDrawTransfer({ id: row.id })
              this.$msgSuccess('操作成功！')
              this.refreshTable()
              break;
            case 'audit':
              this.dialogIsFull = false
              this.dialogWidth = '400px'
              this.dialogTitle = '确认订单金额'
              this.dialogForm = row
              this.dialogComponent = 'Audit'
              this.dialogVisible = true
              break;
            case 'edit':
              this.dialogWidth = '600px'
              this.dialogTitle = '编辑备注'
              this.dialogForm = row
              this.dialogComponent = 'Edit'
              this.dialogVisible = true
              break;
          }
        } catch (error) {
          // error
        }
      },
      handleMultiPass() {},
      handleMultiRefuse() {},
      handleMultiSubmit() {},
      handleMultiExport() {},
      ...mapActions('finance', [
        'withDrawStatics',
        'withDrawAuthSubmit',
        'withDrawAuthRefuse',
        'withDrawTransfer'
      ])
    },
    created() {
      this.initPage()
    }
  }
</script>

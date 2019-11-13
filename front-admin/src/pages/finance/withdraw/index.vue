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
          <el-button type="primary">审核通过</el-button>
          <el-button type="primary">审核不通过</el-button>
          <el-button type="primary">确认转帐</el-button>
          <el-button type="primary">导出</el-button>
        </el-row>
      </el-row>
      <app-table 
        ref="appTable"
        url="/pc/coupon/pool"
        columnType="selection"
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
      // Detail: () => import("./detail"),
      // HqDivide: () => import("./hqDivide"),
    },
    mixins: [AppTable, AppDialog, AppSearch],
    data() {
      return {
        columns: [
          {
            label: '序号',
            field: 'index',
            width: 100
          },{
            label: '律师姓名',
            field: 'couponName',
          },{
            label: '律师ID',
            field: 'scene',
          },{
            label: '审核状态',
            field: 'type',
          },{
            label: '提现金额',
            field: 'remark',
          },{
            label: '账号类型',
            field: 'sendCount',
          },{
            label: '提现账号',
            field: 'account',
          },{
            label: '账号姓名',
            field: 'name',
          },{
            label: '申请时间',
            field: 'applyTime',
          },{
            label: '审核人',
            field: 'rangeStartTime',
          },{
            label: '备注',
            field: 'rangeEndTime',
          },{
            label: '操作',
            field: 'operate',
            align: 'center',
            width: 120,
            type: 'button',
            default: ['审核', '确认转帐', '修改备注'],
            on: {
              click: ({ row }) => {
                this.handleBtnAction(row, index == 0 ? 'audit' : index == 1 ? 'submit' : 'edit')
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
        this.$set(this.searchFormInit, 'align', 'left')

        this.searchItems = [
          {
            label: '申请时间',
            field: ['rangeStartTime', 'rangeEndTime'],
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间',
            type: 10
          },
          {
            label: '会员号',
            field: 'couponName',
            type: 1,
          },
          {
            label: '&nbsp;',
            field: 'couponName',
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
          const searchForm = this.$refs.searchForm
          const tenantId = this.$val(form, 'tenant.id')
          let params = {
            tenantId: this.curRow.id,
            hqTenantId: form
          }
          switch (this.dialogComponent) {
            case 'HqDivide':
              await this.tenantDivideHq(params)
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
          case 'detail':
            this.dialogWidth = '800px'
            this.dialogTitle = row.tenantName
            res = await this.tenantView({ id: row.id })
            this.dialogForm = res.data || {}
            this.dialogComponent = 'Detail'
            this.dialogVisible = true
            break;
          case 'hqDivide':
            this.dialogWidth = '1000px'
            this.dialogTitle = '选择总部'
            res = await this.tenantView({ id: row.id })
            this.curRow = res.data
            this.dialogForm = res.data || {}
            this.dialogComponent = 'HqDivide'
            this.dialogVisible = true
            break;
        }
      },
      ...mapActions('tenant', [
        'tenantView',
        'tenantDivideHq',
        'tenantGetKV'
      ])
    },
    created() {
      this.initPage()
    }
  }
</script>

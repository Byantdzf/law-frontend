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
          <el-button type="primary">启用</el-button>
          <el-button type="primary">禁用</el-button>
          <el-button type="primary">删除</el-button>
          <el-button type="primary">导出</el-button>
        </el-row>
      </el-row>
      <app-table 
        ref="appTable"
        url="/member/user/list"
        columnType="selection"
        :params="tableParams"
        :columns="columns"
        :columns-props="columnsProps"
        :max-height="tableMaxHieght"
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
  import AppTableImgs from '@/components/app-table/lib/imgs'
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
            label: '微信头像',
            field: 'avatarUrl',
            width: 100,
            component: AppTableImgs
          },{
            label: '微信昵称',
            field: 'name',
          },{
            label: '微信号',
            field: 'account',
          },{
            label: '手机号',
            field: 'phone',
          },{
            label: '近一周登陆次数',
            field: 'loginCount',
          },{
            label: '最近登陆时间',
            field: 'createTime',
          },{
            label: '下单次数',
            field: 'orderCount',
            width: 120,
            align: 'center'
          },{
            label: '状态',
            field: 'status',
            width: 110,
            align: 'center',
            component: AppRsText,
            propsHandler ({ col, row }) {
              return {
                col,
                row,
                type: row[col.prop] == 1 ? 'success' : 'danger'
              } 
            }
          },{
            label: '操作',
            field: 'operate',
            align: 'center',
            width: 120,
            type: 'button',
            items: ['修改', '查看'],
            on: {
              click: ({ row, index }) => {
                this.handleBtnAction(row, index == 0 ? 'edit' : 'detail')
              }
            }
          }
        ],
        columnsProps: {
          minWidth: 100,
        },
        tableParams: {
          // tenantType: 6
        }
      }
    },
    methods: {
      // 初始化页面
      initPage() {
        this.$set(this.searchFormInit, 'align', 'left')

        this.searchItems = [
          {
            labelWidth: '70px',
            label: '状态：',
            field: 'status',
            type: 2,
            options: this.$t('rs.status')
          },
          {
            label: '最近登录时间：',
            field: ['startTime', 'endTime'],
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间',
            type: 10
          },
          {
            labelWidth: '70px',
            label: '关键词：',
            field: 'keyword',
            type: 1,
            placeholder: '微信号、微信昵称'
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

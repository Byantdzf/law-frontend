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
          <span class="title">意见反馈列表</span>
        </el-row>
        <el-row class="fr">
          <el-button type="primary">标记已处理</el-button>
          <el-button type="danger">删除</el-button>
        </el-row>
      </el-row>
      <app-table 
        ref="appTable"
        url="/feedback"
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
  import AppTableImgs from '@/components/app-table/lib/imgs'
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
            field: 'index'
          },{
            label: '反馈人昵称',
            field: 'userName',
          },{
            label: 'ID号',
            field: 'id',
          },{
            label: '反馈时间',
            field: 'feedBackTime',
          },{
            label: '反馈内容',
            field: 'content',
          },{
            label: '状态',
            field: 'dealStatus',
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
            label: '处理人',
            field: 'dealer'
          },{
            label: '处理时间',
            field: 'dealTime'
          },{
            label: '操作',
            field: 'operate',
            align: 'center',
            width: 200,
            type: 'button',
            items: ['标记为已处理', '查看', '删除'],
            on: {
              click: ({ row, index }) => {
                this.handleBtnAction(row, ['mark', 'detail', 'del'][index])
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
            label: '反馈时间：',
            field: ['startTime', 'endTime'],
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间',
            type: 10
          },
          {
            label: '状态：',
            field: 'dealStatus',
            type: 2,
            options: this.$t('rs.dealStatus')
          },
          {
            label: '关键词：',
            field: 'keyword',
            type: 1
          }
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

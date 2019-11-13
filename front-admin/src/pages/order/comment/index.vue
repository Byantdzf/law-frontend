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
          <span class="title">评论列表</span>
        </el-row>
        <el-row class="fr">
          <el-button type="primary">置顶</el-button>
          <el-button type="primary">隐藏</el-button>
          <el-button type="primary">删除</el-button>
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
            label: '评论人昵称',
            field: 'couponName',
          },{
            label: '评论人ID号',
            field: 'scene',
          },{
            label: '评论时间',
            field: 'type',
          },{
            label: '评论星级',
            field: 'remark',
          },{
            label: '评论内容',
            field: 'sendCount',
          },{
            label: '评论状态',
            field: 'status',
          },{
            label: '关联的类型',
            field: 'type',
          },{
            label: '关联的订单',
            field: 'order',
          },{
            label: '操作',
            field: 'operate',
            align: 'center',
            width: 120,
            type: 'button',
            default: ['隐藏','删除','置顶'],
            on: {
              click: ({ row, index }) => {
                this.handleBtnAction(row, index == 0 ? 'edit' : index == 1 ? 'del' : 'top')
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
            label: '昵称',
            field: 'nickName',
            type: 1,
          },
          {
            label: '用户ID',
            field: 'userId',
            type: 1,
          },
          {
            label: '评论状态',
            field: 'status',
            type: 2,
          },
          {
            label: '时间',
            field: ['rangeStartTime', 'rangeEndTime'],
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间',
            type: 10
          },
          {
            label: '订单类型',
            field: 'orderType',
            type: 2,
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

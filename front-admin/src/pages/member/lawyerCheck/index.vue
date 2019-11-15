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
          <span class="title">律师审核管理</span>
        </el-row>
      </el-row>
      <app-table 
        ref="appTable"
        url="/member/lawyer/audit"
        :params="tableParams"
        :columns="columns"
      />
    </el-card>
    <app-dialog
      :width="dialogWidth"
      :height="dialogHeight"
      :title="dialogTitle"
      :visible="dialogVisible"
      :full="true"
      @close="closeDialog"
    >
      <component
        class="dialog-content"
        v-if="dialogVisible"
        :is="dialogComponent"
        :row="dialogForm"
        showBtns
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
      Detail: () => import('../lawyer/detail'),
    },
    mixins: [AppTable, AppDialog, AppSearch],
    data() {
      return {
        columns: [
          {
            label: '序号',
            field: 'index',
            width: 70
          },{
            label: '姓名',
            field: 'name',
          },{
            label: '手机号',
            field: 'phone',
          },{
            label: '执业证号',
            field: 'lawyerLicenseNo',
          },{
            label: '执业律所',
            field: 'belongs',
          },{
            label: '申请时间',
            field: 'createTime',
          },{
            label: '操作',
            field: 'operate',
            align: 'center',
            width: 120,
            type: 'button',
            items: ['查看详情'],
            on: {
              click: ({ row }) => {
                this.handleBtnAction(row, 'detail')
              }
            }
          }
        ]
      }
    },
    methods: {
      // 初始化页面
      initPage() {
        this.$set(this.searchFormInit, 'align', 'left')

        this.searchItems = [
          {
            labelWidth: '80px',
            label: '所在律所：',
            field: 'belongs',
            type: 2,
            options: []
          },
          {
            label: '提交时间：',
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
            placeholder: '姓名、手机号、执业证号'
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
      async formSubmit() {
        this.closeDialog()
        this.refreshTable()
      },
      async handleBtnAction(row, type) {
        let res = {}
        let data = {}
        switch (type) {
          case 'detail':
            res = await this.lawyerAuditView(row.id)
            data = res.data || {}
            data.id = row.id
            this.dialogTitle = '认证详情页面'
            this.dialogForm = data
            this.dialogComponent = 'Detail'
            this.dialogVisible = true
            break;
        }
      },
      ...mapActions('member', [
        'lawyerAuditView',
        'lawyerUpdateStatus',
      ])
    },
    created() {
      this.initPage()
    }
  }
</script>

<style lang="less">
.dialog-content {
  width: 800px;
  margin: 0 auto;
}
</style>

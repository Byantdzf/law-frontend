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
          <span class="title">咨询者会员管理</span>
        </el-row>
        <el-row class="fr">
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
        @selection-change="tableSelect"
      />
    </el-card>
    <app-dialog
      :width="dialogWidth"
      :height="dialogHeight"
      :title="dialogTitle"
      :visible="dialogVisible"
      :full="dialogIsFull"
      @close="closeDialog"
    >
      <template slot="title" v-if="showHeaderTab">
        <el-radio-group v-model="curDialogTab" size="small">
          <el-radio-button label="detail">个人资料</el-radio-button>
          <el-radio-button label="orderInfo">订单信息</el-radio-button>
        </el-radio-group>
      </template>
      <component
        v-if="dialogVisible"
        :is="dialogComponent"
        :row="dialogForm"
        :tab="curDialogTab"
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
      Edit: () => import("./edit"),
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
            align: 'center',
          },{
            label: '最近登陆时间',
            field: 'createTime',
            align: 'center',
          },{
            label: '下单次数',
            field: 'orderCount',
            width: 100,
            align: 'center'
          },{
            label: '状态',
            field: 'status',
            width: 100,
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
        showHeaderTab: false,
        curDialogTab: ''
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
        this.dialogIsFull = true
        switch (type) {
          case 'detail':
            this.curDialogTab = 'detail'
            this.showHeaderTab = true
            res = await this.memberView(row.id)
            this.dialogForm = res.data || {}
            this.dialogComponent = 'Edit'
            this.dialogVisible = true
            break;
          case 'edit':
            
            break;
        }
      },
      ...mapActions('member', [
        'memberView',
      ])
    },
    created() {
      this.initPage()
    }
  }
</script>

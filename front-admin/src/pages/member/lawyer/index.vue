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
          <span class="title">律师管理</span>
        </el-row>
        <el-row class="fr">
          <el-button type="primary">启用</el-button>
          <el-button type="primary">禁用</el-button>
          <el-button type="danger" @click="handleMultiDel">删除</el-button>
          <el-button type="primary">导出</el-button>
        </el-row>
      </el-row>
      <app-table 
        ref="appTable"
        url="/member/lawyer/pending"
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
  import AppTableImgs from '@/components/app-table/lib/imgs'
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
            label: '序号',
            field: 'index',
            width: 70
          },{
            label: '微信头像',
            field: 'pic',
            width: 100,
            component: AppTableImgs
          },{
            label: '姓名',
            field: 'name',
          },{
            label: '微信号',
            field: 'account',
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
            label: '接单次数',
            field: 'orderCount',
            width: 80,
            align: 'center'
          },{
            label: '近一周登陆次数',
            field: 'loginCount',
            align: 'center',
          },{
            label: '最近登陆时间',
            field: 'createTime',
          },{
            label: '状态',
            field: 'status',
            width: 70,
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
            width: 100,
            type: 'button',
            formater: (row) => [ row.status == 1 ? '禁用' : '启用', '查看'],
            on: {
              click: ({ row, index }) => {
                this.handleBtnAction(row, index == 0 ? 'status' : 'detail')
              }
            }
          }
        ],
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
            labelWidth: '80px',
            label: '所在律所：',
            field: 'belongs',
            type: 2,
            options: []
          },{
            labelWidth: '60px',
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
      async formSubmit(form) {
        try {
          
        } catch (e) {
          // error
        }
      },
      async handleBtnAction(row, type) {
        let res = {}
        let data = {}
        let tips = ''
        this.dialogIsFull = true
        switch (type) {
          case 'detail':
            this.curDialogTab = 'detail'
            this.showHeaderTab = true
            res = await this.lawyerView(row.id)
            data = res.data || {}
            data.id = row.id
            this.dialogForm = data
            this.dialogComponent = 'Edit'
            this.dialogVisible = true
            break;
          case 'status':
            tips = `确认${ row.status == 1 ? '禁用' : '启用' }律师${ row.name }吗？`
            await this.$confirm(tips, '温馨提示', { type: 'warning' })
            await this.lawyerUpdateStatus(row.id)
            this.$msgSuccess('操作成功！')
            break;
        }
      },
      async handleMultiDel() {
        if (this.tableSelected.length) {
          try {
            let ids = this.tableSelected.map(v => v.id).join(',')
            await this.$confirm('确认删除选中的律师吗?', '温馨提示', { type: 'warning' })
            await this.lawyerDel(ids)
            this.$msgSuccess('操作成功！')
            this.refreshTable()
          } catch (error) {
            // error
          }
        } else {
          this.$msgError('请选择需要删除的数据')
        }
      },
      ...mapActions('member', [
        'lawyerView',
        'lawyerUpdateStatus',
        'lawyerDel',
      ])
    },
    created() {
      this.initPage()
    }
  }
</script>

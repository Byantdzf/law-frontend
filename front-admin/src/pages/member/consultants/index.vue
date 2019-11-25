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
          <el-button type="primary" @click="changeStatusBatch('0')">启用</el-button>
          <el-button type="primary" @click="changeStatusBatch('1')">禁用</el-button>
          <el-button type="primary" @click="removeLawyer">删除</el-button>
          <el-button type="primary">导出</el-button>
        </el-row>
      </el-row>
      <app-table 
        ref="appTable"
        url="/member/user/list"
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
            // items: ['修改', '查看'],
            formater: (row) => [ row.status == 1 ? '禁用' : '启用', '查看'],
            on: {
              click: ({ row, index }) => {
                this.handleBtnAction(row, index == 0 ? 'status' : 'detail')
              }
            }
          }
        ],
        showHeaderTab: false,
        curDialogTab: '',
        selectedLawyers: []
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
            res = await this.memberView(row.id)
            data = res.data || {}
            data.id = row.id
            this.dialogForm = data
            this.dialogComponent = 'Edit'
            this.dialogVisible = true
            break;
          case 'status':
            tips = `确认${ row.status == 1 ? '禁用' : '启用' }会员${ row.name }吗？`
            let params = {status: row.status == 0 ? 1 : 0}
            this.changeStatus(tips, row.id, params)
            break;
        }
      },
      async changeStatus(tips, ids, params){
        await this.$confirm(tips, '温馨提示', { type: 'warning' })
        if(ids instanceof Array) { 
          ids = ids.join(",")
        }
        let payload = {ids, params }
        await this.memberUpdateStatus(payload)
        this.$msgSuccess('操作成功！')
        this.refreshTable()
      },
      changeStatusBatch(status){
        let names = this.selectedLawyers.map(item=>item.name).join("、");
        let ids = this.selectedLawyers.map(item=>item.id).join(",");
        let tips = `确认${ status == 1 ? '禁用' : '启用' }会员${ names }吗`;
        let params = {status}
        changeStatus( tips, ids, params)
      },
      async removeLawyer(){
        let idList = this.selectedLawyers.map(item => item.id).join(",");
        this.memberDel(idList);
        this.refreshTable();
      },
      tableSelect(val){
        this.selectedLawyers = val;
      },
      ...mapActions('member', [
        'memberView',
        'memberUpdateStatus',
        'memberDel'
      ])
    },
    created() {
      this.initPage()
    }
  }
</script>

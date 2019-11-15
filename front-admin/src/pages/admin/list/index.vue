<template>
  <el-row>
    <el-card class="table-card">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">管理员列表</span>
        </el-row>
        <el-row class="fr">
          <el-button type="primary" @click="handleBtnAction({}, 'add')">新增</el-button>
          <el-button type="danger">删除</el-button>
        </el-row>
      </el-row>
      <app-table 
        ref="appTable"
        url="/manage"
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
            label: '管理员账号',
            field: 'userName',
          },{
            label: '姓名',
            field: 'realName',
          },{
            label: '角色',
            field: 'roleName',
          },{
            label: '手机',
            field: 'phone'
          },{
            label: '累积登录次数',
            field: 'loginCount'
          },{
            label: '上次登录时间',
            field: 'lastLoginTime'
          },{
            label: '状态',
            field: 'isDisable',
            align: 'center',
            component: AppRsText,
            propsHandler ({ col, row }) {
              return {
                col,
                row,
                type: row[col.prop] == 0 ? 'success' : 'danger'
              } 
            }
          },{
            label: '操作',
            field: 'operate',
            align: 'center',
            width: 150,
            type: 'button',
            items: ['编辑', '查看', '删除'],
            on: {
              click: ({ row, index }) => {
                this.handleBtnAction(row, ['edit', 'detail', 'del'][index])
              }
            }
          }
        ]
      }
    },
    methods: {
      // 初始化页面
      initPage() {

      },
      // 表单提交
      async formSubmit(form) {
        try {
          // const searchForm = this.$refs.searchForm
          // const tenantId = this.$val(form, 'tenant.id')
          // let params = {
          //   tenantId: this.curRow.id,
          //   hqTenantId: form
          // }
          // switch (this.dialogComponent) {
          //   case 'HqDivide':
          //     await this.tenantDivideHq(params)
          //     this.$msgSuccess('操作成功')
          //     this.closeDialog()
          //     this.refreshTable()
          //     break;
          // }
        } catch (e) {
          // error
        }
      },
      async handleBtnAction(row, type) {
        let res = {}
        switch (type) {
          case 'detail':
            // this.dialogWidth = '800px'
            // this.dialogTitle = row.tenantName
            // res = await this.tenantView({ id: row.id })
            // this.dialogForm = res.data || {}
            // this.dialogComponent = 'Detail'
            // this.dialogVisible = true
            break;
          case 'add':
            this.dialogWidth = '500px'
            this.dialogTitle = '新增管理员'
            this.dialogForm = null
            this.dialogComponent = 'Edit'
            this.dialogVisible = true
            break;
        }
      },
      ...mapActions('admin', [
        'managerAdd',
        'managerUpdate',
        'managerDel'
      ])
    },
    created() {
      this.initPage()
    }
  }
</script>

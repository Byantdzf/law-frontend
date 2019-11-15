<template>
  <el-row>
    <el-card class="table-card">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">角色列表</span>
        </el-row>
        <el-row class="fr">
          <el-button type="primary" @click="handleBtnAction({}, 'add')">新增</el-button>
          <el-button type="danger">删除</el-button>
        </el-row>
      </el-row>
      <app-table 
        ref="appTable"
        url="/role/list"
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
            label: '角色名称',
            field: 'roleValue',
          },{
            label: '备注',
            field: 'remark',
          },{
            label: '账号数量',
            field: 'accountNum',
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
            label: '创建时间',
            field: 'createTime'
          },{
            label: '操作',
            field: 'operate',
            align: 'center',
            width: 120,
            type: 'button',
            items: ['编辑', '删除'],
            on: {
              click: ({ row, index }) => {
                this.handleBtnAction(row, ['edit', 'del'][index])
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
          console.log(form)
          if ('id' in form) {
            await this.roleUpdate(form)
            this.closeDialog()
            this.refreshTable()
            this.$msgSuccess('修改成功')
          } else {
            await this.roleAdd(form)
            this.closeDialog()
            this.refreshTable()
            this.$msgSuccess('添加成功')
          }
        } catch (e) {
          // error
        }
      },
      async handleBtnAction(row, type) {
        let res = {}
        switch (type) {
          case 'add':
            this.dialogWidth = '400px'
            this.dialogTitle = '新增角色'
            this.dialogForm = null
            this.dialogComponent = 'Edit'
            this.dialogVisible = true
            break;
          case 'edit':
            this.dialogWidth = '400px'
            this.dialogTitle = '编辑角色'
            this.dialogForm = row
            this.dialogComponent = 'Edit'
            this.dialogVisible = true
            break;
        }
      },
      ...mapActions('admin', [
        'roleAdd',
        'roleUpdate',
        'roleDel'
      ])
    },
    created() {
      this.initPage()
    }
  }
</script>

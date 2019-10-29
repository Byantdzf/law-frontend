<template>
  <el-row>
    <el-card class="table-card">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">成员列表</span>
        </el-row>
        <el-row class="fr">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="handleBtnAction({}, 'add')"
          >
            添加
          </el-button>
        </el-row>
      </el-row>
      <app-table 
        ref="appTable"
        url="ptUser/queryPage"
        :columns="columns"
        :columns-props="columnsProps"
        max-height="600"
        tooltip-effect="light"
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
        ref="dialogComponent"
        :is="dialogComponent"
        :row="dialogForm"
        @submit="formSubmit"
        @cancel="closeDialog"
      />
    </app-dialog>
  </el-row>
</template>

<script>
  import { mapActions } from 'vuex'
  import AppTable from '@/mixins/table'
  import AppDialog from '@/mixins/dialog'
  import AppTableSwitch from '@/components/app-table/lib/switch'
  export default {
    components: {
      Edit: () => import("./edit"),
      Role: () => import("./role")
    },
    mixins: [AppTable, AppDialog],
    data() {
      return {
        columns: [
          {
            label: '用户名',
            field: 'account',
          },{
            label: '姓名',
            field: 'name',
          },{
            label: '邮箱地址',
            field: 'email',
          },{
            label: '添加时间',
            field: 'createTime',
          },{
            label: '最后登录',
            field: 'lastLoginTime',
          },{
            label: '是否启用',
            field: 'status',
            width: 100,
            disabledRow:[
              {account:'admin'},
            ],
            component: AppTableSwitch,
            propsHandler ({ value }) {
              return {
                value: value == 1 ? true : false
              }
            },
            on: {
              change: this.handleStatusChange
            }
          },{
            label: '操作',
            field: 'operate',
            type: 'button',
            align: 'center',
            width: 130,
            formater: ({ role }) => role != 1 ? ['权限', '编辑', '删除'] : [],
            on: {
              click: ({ row, index }) => {
                this.handleBtnAction(row, ['role', 'edit', 'del'][index])
              }
            }
          }
        ],
        columnsProps: {
          minWidth: 100
        }
      }
    },
    methods: {
      // 表单提交
      async formSubmit(form) {
        try {
          switch (this.dialogComponent) {
            case 'Edit':
              if(form.id) {
                await this.userUpdate(form)
                this.$msgSuccess(this.$t("message.updateSuccess"))
              } else {
                await this.userAdd(form)
                this.$msgSuccess(this.$t("message.addSuccess"))
              }
              this.closeDialog()
              this.refreshTable()
              break;
            case 'Role':
              await this.userAuthMenus(form)
              this.$msgSuccess('操作成功！')
              this.closeDialog()
              this.refreshTable()
              break;
          }
          
        } catch (e) {
          // error
        }
      },
      // 按钮点击事件
      async handleBtnAction(row, type) {
        try {
          switch (type) {
            case 'del':
              await this.$confirm(`确认删除用户名${ row.account }吗？`, this.$t('text.tips'), {
                type: 'warning'
              })
              await this.userDelete(row.id)
              this.refreshTable()
              break;
            case 'role':
              this.dialogWidth = '600px'
              this.dialogTitle = `设置成员权限 -- ${ row.name }`
              this.dialogForm = row
              this.dialogComponent = 'Role'
              this.dialogVisible = true
              break;
            case 'add':
            case 'edit':
              this.dialogWidth = '600px'
              if (type == 'edit') {
                this.dialogTitle = '编辑成员'
                this.dialogForm = row
              } else {
                this.dialogTitle = '新增成员'
                this.dialogForm = null
              }
              this.dialogComponent = 'Edit'
              this.dialogVisible = true
              break;
          }
        } catch (e) {
          // error
        }
      },
      // 启用，禁用
      async handleStatusChange({ row }) {
        try {
          if (row.status == 1) {
            await this.userDisable(row.id)
          } else {
            await this.userEnable(row.id)
          }
          this.refreshTable()
        } catch (error) {
          this.refreshTable()
        }
      },
      ...mapActions('user', [
        'userAdd',
        'userUpdate',
        'userDelete',
        'userEnable',
        'userDisable',
        'userAuthMenus',
      ])
    }
  }
</script>

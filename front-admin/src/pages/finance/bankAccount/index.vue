<template>
  <el-row>
    <el-card class="table-card">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">银行账户列表</span>
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
        url="ptBankAccount/queryPage"
        :columns="columns"
        :max-height="tableMaxHieght"
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
      Edit: () => import("./edit")
    },
    mixins: [AppTable, AppDialog],
    data() {
      return {
        columns: [
          {
            label: '账户名称',
            field: 'name',
          },{
            label: '账户名',
            field: 'accountName',
          },{
            label: '账户号',
            field: 'accountNumber',
          },{
            label: '银行',
            field: 'bank',
          },{
            label: '分行/支行',
            field: 'branch',
          },{
            label: '银行地址',
            field: 'bankAddress',
          },{
            label: '银行电话',
            field: 'bankPhone',
          },{
            label: '银行传真',
            field: 'bankFax',
          },{
            label: 'Swift-code',
            field: 'swiftCode',
          },{
            label: '备注',
            field: 'remark'
          },{
            label: '状态',
            field: 'status',
            width: 80,
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
            default: '编辑',
            width: 80,
            on: {
              click: ({ row }) => {
                this.handleBtnAction(row, 'edit')
              }
            }
          }
        ]
      }
    },
    methods: {
      // 表单提交
      async formSubmit(form) {
        try {
          if(form.id) {
            await this.bankAccountUpdate(form)
            this.$msgSuccess(this.$t("message.updateSuccess"))
          } else {
            await this.bankAccountAdd(form)
            this.$msgSuccess(this.$t("message.addSuccess"))
          }
          this.closeDialog()
          this.refreshTable()
        } catch (e) {
          // error
        }
      },
      // 按钮点击事件
      async handleBtnAction(row, type) {
        let res = {}
        switch (type) {
          case 'detail':
            this.curDialogTab = 'detail'
            this.showHeaderTab = true
            res = await this.bankAccountView({ id: row.id })
            this.dialogForm = res.data || {}
            this.dialogComponent = 'Edit'
            this.dialogVisible = true
            break;
          case 'add':
          case 'edit':
            this.dialogWidth = '600px'
            if (type == 'edit') {
              this.dialogTitle = '编辑银行账户'
              res = await this.bankAccountView({ id: row.id })
              this.dialogForm = res.data || {}
            } else {
              this.dialogTitle = '新增银行账户'
              this.dialogForm = null
            }
            this.dialogComponent = 'Edit'
            this.dialogVisible = true
            break;
        }
      },
      // 设置默认等级
      async handleStatusChange({ row }) {
        try {
          if (row.status == 1) {
            await this.bankAccountDisable(row.id)
          } else {
            await this.bankAccountEnable(row.id)
          }
          this.refreshTable()
        } catch (error) {
          this.refreshTable()
        }
      },
      ...mapActions('finance', [
        'bankAccountView',
        'bankAccountAdd',
        'bankAccountUpdate',
        'bankAccountEnable',
        'bankAccountDisable',
      ])
    }
  }
</script>

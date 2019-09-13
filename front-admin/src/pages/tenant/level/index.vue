<template>
  <el-row>
    <el-card class="table-card">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">商户等级列表</span>
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
        url="ptTenantLevel/queryPage"
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
      Edit: () => import("./edit")
    },
    mixins: [AppTable, AppDialog],
    data() {
      return {
        columns: [
          {
            label: '等级名称',
            field: 'name',
          },{
            label: '默认商户等级',
            field: 'defaultTenant',
            component: AppTableSwitch,
            propsHandler ({ value }) {
              return {
                value: value == 1 ? true : false,
                disabled: value == 1 ? true : false
              } 
            },
            on: {
              change: this.handleDefaultChange
            }
          },{
            label: '成长值满足点',
            field: 'growingValue',
          },{
            label: '备注',
            field: 'remark'
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
          if(form.id) {
            await this.tenantLevelUpdate(form)
            this.$msgSuccess(this.$t("message.updateSuccess"))
          } else {
            await this.tenantLevelAdd(form)
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
            res = await this.tenantLevelView({ id: row.id })
            this.dialogForm = res.data || {}
            this.dialogComponent = 'Edit'
            this.dialogVisible = true
            break;
          case 'add':
          case 'edit':
            this.dialogWidth = '600px'
            if (type == 'edit') {
              this.dialogTitle = '编辑商户等级'
              res = await this.tenantLevelView({ id: row.id })
              this.dialogForm = res.data || {}
            } else {
              this.dialogTitle = '新增商户等级'
              this.dialogForm = null
            }
            this.dialogComponent = 'Edit'
            this.dialogVisible = true
            break;
        }
      },
      // 设置默认等级
      async handleDefaultChange({ row }) {
        try {
          await this.tenantLevelSetDefault({ id: row.id })
          this.refreshTable()
        } catch (error) {
          this.refreshTable()
        }
      },
      ...mapActions('tenant', [
        'tenantLevelView',
        'tenantLevelAdd',
        'tenantLevelUpdate',
        'tenantLevelSetDefault'
      ])
    }
  }
</script>

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
        @change="searchChange"
        @more-filter="moreFilter"
        ref="searchForm"
      />
    </el-card>
    <el-card class="table-card mt-10">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">商户列表</span>
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
        url="ptTenant/queryPage"
        tooltip-effect="light"
        :params="tableParams"
        :columns="columns"
        :max-height="tableMaxHieght"
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
          <el-radio-button label="detail">商户详情</el-radio-button>
          <el-radio-button label="edit">编辑资料</el-radio-button>
          <el-radio-button label="logs">登录日志</el-radio-button>
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
  import { TableColumn } from 'element-ui'
  import AppTable from '@/mixins/table'
  import AppDialog from '@/mixins/dialog'
  import AppSearch from '@/mixins/search'
  import AppRsText from '@/components/app-table/lib/rsText'
  export default {
    components: {
      [TableColumn.name]: TableColumn,
      DivideSell: () => import('@/pages/common/divideSell'),
      Edit: () => import('./edit'),
      MoreFilter: () => import('./moreFilter')
    },
    mixins: [AppTable, AppDialog, AppSearch],
    data() {
      return {
        columns: [
          {
            label: '商户ID',
            field: 'tenantNo',
          },{
            label: '商户账号',
            field: 'tenantAccount',
            width: 220
          },{
            label: '商户名称',
            field: 'tenantName',
          },{
            label: '商户等级',
            field: 'tenantLevel',
            width: 140,
            align: 'center'
          },{
            label: '商户类别',
            field: 'tenantTypeName',
            width: 140,
            align: 'center'
          },{
            label: '对应销售',
            field: 'sellName',
            type: 'button',
            width: 140,
            default: '待分配',
            align: 'center',
            formater: (row) => {
              return this.$val(row, 'sellBo.userName')
            },
            on: {
              click: ({ row }) => {
                this.handleBtnAction(row, 'divideSell')
              }
            }
          },{
            label: '账户启用状态',
            field: 'status',
            width: 110,
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
            items: ['查看', '编辑'],
            on: {
              click: ({ row, index }) => {
                this.handleBtnAction(row, index == 0 ? 'detail' : 'edit')
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
        const tenantTypeMap = this.$t('rs.tenantType')
        let tenantTypeOptions = []

        for (let k in tenantTypeMap) {
          tenantTypeOptions.push({
            id: +k,
            name: tenantTypeMap[k]
          })
        }

        this.$set(this.searchFormInit, 'align', 'left')

        this.searchItems = [
          {
            label: '商户账号：',
            field: 'tenantNo',
            placeholder: '商户账号/ID',
            type: 1
          },
          {
            label: '商户名称：',
            field: 'tenantId|id',
            placeholder: '模糊搜索',
            type: 1,
            autofill: true,
            fetchSuggestions: (value, cb) => {
              const name = value.trim()
              const tenantType = this.tenantType
              let params = {}

              if (!name) {
                cb([])
                return false
              } else {
                params.name = name
                if (tenantType) {
                  params.tenantType = tenantType
                }
              }

              this.tenantGetKV(params).then(res => {
                cb(res.data || [])
              }).catch(() => {
                cb([])
              })
            }
          },
          {
            label: '商户类别：',
            field: 'tenantType',
            type: 2,
            options: tenantTypeOptions,
            clearable: true
          }
        ]

        this.searchBtns = [
          {
            label: '确认',
            code: 'confirm'
          }, {
            label: '高级检索',
            code: 'more-filter'
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
          switch (this.dialogComponent) {
            case 'Edit':
              if(form.id) {
                await this.tenantUpdate(form)
                this.$msgSuccess(this.$t('message.updateSuccess'))
              } else {
                await this.tenantAdd(form)
                this.$msgSuccess(this.$t('message.addSuccess'))
              }
              this.closeDialog()
              this.refreshTable()
              break;
            case 'MoreFilter':
              this.searchTenant = form.tenant
              this.tableParams = {
                ...this.tableParams,
                ...form,
                tenantId
              }
              delete this.tableParams.tenant
              if (searchForm) {
                searchForm.updateFormItem('tenantId|id', 'value', form.tenant)
                searchForm.updateFormItem('tenantNo', 'value', form.tenantNo)
                searchForm.updateFormItem('tenantType', 'value', form.tenantType)
              }
              this.closeDialog()
              break;
            case 'DivideSell':
              await this.tenantDivideSell(form)
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
          case 'divideSell':
            this.showHeaderTab = false
            this.dialogIsFull = false
            this.dialogWidth = '600px'
            this.dialogTitle = '分配销售'
            this.dialogForm = row
            this.dialogComponent = 'DivideSell'
            this.dialogVisible = true
            break;
          case 'detail':
            this.curDialogTab = 'detail'
            this.showHeaderTab = true
            res = await this.tenantView({ id: row.id })
            this.dialogForm = res.data || {}
            this.dialogComponent = 'Edit'
            this.dialogVisible = true
            break;
          case 'add':
          case 'edit':
            this.dialogWidth = '600px'
            if (type == 'edit') {
              this.dialogTitle = '编辑商户 ' + row.tenantName
              this.curDialogTab = 'edit'
              this.showHeaderTab = true
              res = await this.tenantView({ id: row.id })
              this.dialogForm = res.data || {}
            } else {
              this.dialogTitle = '新增商户'
              this.curDialogTab = 'edit'
              this.showHeaderTab = false
              this.dialogForm = null
            }
            this.dialogComponent = 'Edit'
            this.dialogVisible = true
            break;
        }
      },
      searchChange({ field, value }) {
        if(field == 'tenantId|id') {
          this.searchTenant = value
        }
      },
      moreFilter() {
        this.dialogIsFull = false
        this.showHeaderTab = false
        this.dialogTitle = '高级检索'
        this.dialogForm = { ...this.tableParams, tenant: this.searchTenant }
        this.dialogComponent = 'MoreFilter'
        this.dialogVisible = true
      },
      ...mapActions('tenant', [
        'tenantView',
        'tenantAdd',
        'tenantUpdate',
        'tenantGetKV',
        'tenantDivideSell'
      ])
    },
    created() {
      this.initPage()
    },
    destroyed() {}
  }
</script>

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
        @more-filter="moreFilter"
        ref="searchForm"
      />
    </el-card>
    <el-card class="table-card mt-10">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">门店列表</span>
        </el-row>
      </el-row>
      <app-table 
        ref="appTable"
        url="ptTenant/queryPage"
        tooltip-effect="light"
        :params="tableParams"
        :columns="columns"
        :columns-props="columnsProps"
        :max-height="tableMaxHieght"
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
  import { TableColumn } from 'element-ui'
  import AppTable from '@/mixins/table'
  import AppDialog from '@/mixins/dialog'
  import AppSearch from '@/mixins/search'
  import AppRsText from '@/components/app-table/lib/rsText'
  export default {
    components: {
      [TableColumn.name]: TableColumn,
      Detail: () => import("./detail"),
      HqDivide: () => import("./hqDivide"),
      MoreFilter: () => import("./moreFilter"),
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
            width: 200
          },{
            label: '商户名称',
            field: 'tenantName',
          },{
            label: '商户等级',
            field: 'tenantLevel',
            width: 140,
            align: 'center'
          },{
            label: '归属总部',
            field: 'hqName',
          },{
            label: '对应销售',
            field: 'sellName',
            type: 'button',
            width: 140,
            align: 'center',
            default: '待分配'
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
            items: ['查看', '总部划分'],
            on: {
              click: ({ row, index }) => {
                this.handleBtnAction(row, index == 0 ? 'detail' : 'hqDivide')
              }
            }
          }
        ],
        columnsProps: {
          minWidth: 100,
        },
        tableParams: {
          tenantType: 6
        }
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
            value: 6,
            options: tenantTypeOptions,
            disabled: true
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
          }
        } catch (e) {
          // error
        }
      },
      async handleBtnAction(row, type) {
        let res = {}
        switch (type) {
          case 'detail':
            this.dialogWidth = '800px'
            this.dialogTitle = row.tenantName
            res = await this.tenantView({ id: row.id })
            this.dialogForm = res.data || {}
            this.dialogComponent = 'Detail'
            this.dialogVisible = true
            break;
          case 'hqDivide':
            this.dialogWidth = '1000px'
            this.dialogTitle = '选择总部'
            res = await this.tenantView({ id: row.id })
            this.curRow = res.data
            this.dialogForm = res.data || {}
            this.dialogComponent = 'HqDivide'
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
        this.dialogTitle = '高级检索'
        this.dialogForm = { ...this.tableParams, tenant: this.searchTenant }
        this.dialogComponent = 'MoreFilter'
        this.dialogVisible = true
      },
      ...mapActions('tenant', [
        'tenantView',
        'tenantDivideHq',
        'tenantGetKV'
      ])
    },
    created() {
      this.initPage()
    }
  }
</script>

<template>
  <el-row>
    <el-card class="search-card">
      <app-form
        ref="searchForm"
        class="app-search"
        :init="searchFormInit"
        :items="searchItems"
        :btns="searchBtns"
        @confirm="confirmSearch"
        @reset="confirmSearch"
      />
    </el-card>
    <el-card class="table-card mt-10">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">商户账户列表</span>
        </el-row>
      </el-row>
      <app-table
        ref="appTable"
        url="/ptFinanceTenantAccount/queryPage"
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
      <component
        class="dialog-content"
        ref="dialogComponent"
        v-if="dialogVisible"
        :is="dialogComponent"
        :row="dialogForm"
        @cancel="closeDialog"
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
  import AppTableSwitch from '@/components/app-table/lib/switch.js'
  export default {
    components: {
      [TableColumn.name]: TableColumn,
      Detail: () => import('@/pages/tenant/list/detail')
    },
    mixins: [AppTable, AppDialog, AppSearch],
    data() {
      return {
        columns: [
          {
            label: '商户名称',
            field: 'tenantName',
          },{
            label: '商户类别',
            field: 'tenantTypeName',
            width: 140,
            align: 'center'
          },{
            label: '账户名',
            field: 'bankAccountName',
            align: 'center'
          },{
            label: '账户号',
            field: 'bankAccountNo',
            align: 'center'
          },{
            label: '开户银行',
            field: 'bankOpenBranch',
            align: 'center'
          },{
            label: '开启授信',
            field: 'creditStatus',
            width: 80,
            align: 'center',
            component: AppTableSwitch,
            propsHandler ({ row, value }) {
              let text = ''
              if (row.isCreditStatus == 2) {
                text = 'NA'
              }

              return {
                text,
                value: value == 1 ? true : false
              } 
            },
            on: {
              change: this.handleStatusChange
            }
          },{
            label: '已结算金额',
            field: 'settlementAmount',
            align: 'center',
            width: 90
          },{
            label: '未结算金额',
            field: 'unsettledAmount',
            align: 'center',
            width: 90
          },{
            label: '操作',
            field: 'operate',
            align: 'center',
            width: 80,
            type: 'button',
            items: ['查看'],
            on: {
              click: ({ row }) => {
                this.handleBtnAction(row, 'detail')
              }
            }
          }
        ]
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
            label: '重置',
            code: 'reset',
            type: 'default'
          }
        ]
      },
      async handleBtnAction(row, type) {
        let res = {}
        this.dialogIsFull = true
        switch (type) {
          case 'detail':
            this.dialogTitle = '商户详情'
            res = await this.tenantView({ id: row.id })
            this.dialogForm = res.data || {}
            this.dialogComponent = 'Detail'
            this.dialogVisible = true
            break;
        }
      },
      async handleStatusChange({ row }) {
        const { creditStatus, id } = row
        try {
          if (creditStatus == 1) {
            await this.tenantCreditDisable(id)
          } else {
            await this.tenantCreditEnable(id)
          }
          this.refreshTable()
        } catch (error) {
          this.refreshTable()
        }
      },
      ...mapActions('tenant', [
        'tenantView',
        'tenantGetKV'
      ]),
      ...mapActions('finance', [
        'tenantCreditEnable',
        'tenantCreditDisable'
      ])
    },
    created() {
      this.initPage()
    },
    destroyed() {}
  }
</script>

<style lang="less">
.dialog-content {
  width: 800px;
  margin: 0 auto;
}
</style>

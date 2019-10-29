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
          <span class="title">数据列表</span>
        </el-row>
      </el-row>
      <app-table
        ref="appTable"
        url="/ptFinanceTenantCredit/queryPage"
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
        ref="dialogComponent"
        v-if="dialogVisible"
        :is="dialogComponent"
        :row="dialogForm"
        @submit="formSubmit"
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
      Detail: () => import('@/pages/tenant/list/detail'),
      Logs: () => import('../common/logs'),
      Orders: () => import('../common/orders'),
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
            label: '授信额度',
            field: 'creditAmount',
            align: 'center'
          },{
            label: '剩余额度',
            field: 'availableAmount',
            align: 'center'
          },{
            label: '未结订单',
            field: 'orders',
            type: 'button',
            align: 'center',
            formater: (row) => String(row.orders || 0),
            on: {
              click: ({ row }) => {
                this.handleBtnAction(row, 'orders')
              }
            }
          },{
            label: '对应销售',
            field: 'sellName',
            align: 'center',
            width: 140,
            default: '--'
          },{
            label: '额度状态',
            field: 'amountStatus',
            width: 80,
            align: 'center',
            component: AppRsText,
            propsHandler ({ value }) {
              const type = ['success', 'warning', 'danger'][value - 1]
              return {
                type
              } 
            }
          },{
            label: '操作',
            field: 'operate',
            align: 'center',
            width: 140,
            type: 'button',
            items: ['查看', '日志'],
            on: {
              click: ({ row, index }) => {
                const type = ['detail', 'logs'][index]
                this.handleBtnAction(row, type)
              }
            }
          }
        ]
      }
    },
    methods: {
      // 初始化页面
      initPage() {
        let tenantTypeOptions = this.rsMapToArray('tenantType', [1, 2, 3, 6])
        let statusOptions = this.rsMapToArray('amountStatus')

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
          },
          {
            label: '额度状态：',
            field: 'amountStatus',
            type: 2,
            options: statusOptions,
            clearable: true
          },
          {
            label: '对应销售：',
            field: 'sellId|id',
            placeholder: '销售名称',
            type: 1,
            autofill: true,
            fetchSuggestions: (value, cb) => {
              const name = value.trim()

              if (!name) {
                cb([])
                return false
              }

              this.userGetKV({ name }).then(res => {
                cb(res.data || [])
              }).catch(() => {
                cb([])
              })
            }
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
      rsMapToArray(key, filters = []) {
        const map = this.$t(`rs.${ key }`)
        let arr = []

        filters = filters.map(v => String(v))

        for (let k in map) {
          if (!filters.includes(k)) {
            arr.push({
              id: +k,
              name: map[k]
            })
          }
        }

        return arr
      },
      async handleBtnAction(row, type) {
        let res = {}
        this.dialogIsFull = true
        switch (type) {
          case 'detail':
            this.dialogTitle = '商户详情'
            res = await this.tenantView({ id: row.tenantId })
            this.dialogForm = res.data || {}
            this.dialogComponent = 'Detail'
            this.dialogVisible = true
            break;
          case 'logs':
          case 'orders':
            this.dialogIsFull = false
            this.dialogWidth = '1000px'
            if (type == 'logs') {
              this.dialogTitle = '操作日志 - ' + row.tenantName
              this.dialogComponent = 'Logs'
            } else {
              this.dialogTitle = '未结订单 - ' + row.tenantName
              this.dialogComponent = 'Orders'
            }
            this.dialogForm = row
            this.dialogVisible = true
            break;
        }
      },
      // 表单提交
      async formSubmit() {
        
      },
      ...mapActions('tenant', [
        'tenantView',
        'tenantGetKV'
      ]),
      ...mapActions('user', [
        'userGetKV'
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

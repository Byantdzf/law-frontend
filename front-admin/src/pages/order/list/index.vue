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
      <el-row slot="header">
        <el-radio-group class="table-card-tabs fl" v-model="orderStatus">
          <el-radio-button
            v-for="(item, index) in orderStatusItems"
            :key="index"
            :label="item.id"
          >
            {{ item.name }}
          </el-radio-button>
        </el-radio-group>
        <el-row class="fr">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-printer"
            @click="handleBtnAction({}, 'export')"
          >
            导出
          </el-button>
        </el-row>
      </el-row>
      <app-table
        ref="appTable"
        tooltip-effect="light"
        :url="url"
        :params="tableParams"
        :columns="columns"
        :column-type="['selection']"
        :columns-props="columnsProps"
        :max-height="tableMaxHieght"
        @selection-change="tableSelect"
      />
    </el-card>
    <app-dialog
      class="page-dialog"
      :width="dialogWidth"
      :height="dialogHeight"
      :title="dialogTitle"
      :visible="dialogVisible"
      :full="dialogIsFull"
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
  import AppSearch from '@/mixins/search'
  import AppRsText from '@/components/app-table/lib/rsText'
  import OrderInfo from './orderInfo'
  import ProductInfo from './productInfo'
  import BookInfo from './bookInfo'
  import PriceInfo from './priceInfo'

  export default {
    components: {
      DetailTravel: () => import('@/pages/order/detail/travel'),
      FilterForm: () => import('./filterForm')
    },
    mixins: [AppTable, AppDialog, AppSearch],
    props: {
      url: {
        type: String,
        required: true
      },
      statusItems: Array
    },
    data() {
      return {
        orderStatus: '-1',
        orderStatusItems: [
          {
            id: '-1',
            name: '全部'
          }
        ],
        columns: [
          {
            label: '订单信息',
            field: 'orderInfo',
            width: 240,
            component: OrderInfo
          },{
            label: '产品信息',
            field: 'productInfo',
            minWidth: 300,
            component: ProductInfo
          },{
            label: '预定人信息',
            field: 'bookInfo',
            width: 200,
            component: BookInfo
          },{
            label: '价格信息',
            field: 'priceInfo',
            width: 160,
            component: PriceInfo
          },{
            label: '支付方式',
            field: 'payType',
            width: 120,
            align: 'center',
            default: '--'
          },{
            label: '订单来源',
            field: 'orderSource',
            width: 120,
            align: 'center',
            formater: ({ value }) => {
              return this.$t('rs.orderSource')[value] || '--'
            }
          },{
            label: '订单状态',
            field: 'status',
            rs: 'orderStatus',
            width: 110,
            align: 'center',
            component: AppRsText,
            propsHandler ({ value }) {
              let type = 'warning'
              switch (+value) {
                case 9:
                  type = 'success'
                  break;
                case 4:
                case 5:
                case 10:
                  type = 'danger'
                  break;
              }
              return { type }
            }
          },{
            label: '操作',
            field: 'operate',
            type: 'button',
            align: 'center',
            default: '查看订单',
            width: 100,
            on: {
              click: ({ row }) => {
                this.handleBtnAction(row, 'detail')
              }
            }
          }
        ],
        columnsProps: {
          minWidth: 100,
        }
      }
    },
    watch: {
      orderStatus(nval) {
        this.tableParams = {
          ...this.tableParams,
          orderStatus: nval == -1 ? '' : nval
        }
      }
    },
    methods: {
      // 初始化页面
      initPage() {

        this.$set(this.searchFormInit, 'align', 'left')

        this.searchItems = [
          {
            label: '订单号：',
            field: 'orderNo',
            placeholder: '订单编号',
            type: 1
          },
          {
            label: '下单商户：',
            field: 'tenantId|id',
            placeholder: '模糊搜索',
            type: 1,
            fetchSuggestions: (value, cb) => {
              const name = value.trim()
              let params = {}

              if (!name) {
                cb([])
                return false
              } else {
                params.name = name
              }

              this.tenantGetKV(params).then(res => {
                cb(res.data || [])
              }).catch(() => {
                cb([])
              })
            }
          },
          {
            label: '供应商户：',
            field: 'tenantId|id',
            placeholder: '模糊搜索',
            type: 1,
            fetchSuggestions: (value, cb) => {
              const name = value.trim()
              let params = {}

              if (!name) {
                cb([])
                return false
              } else {
                params.name = name
              }

              this.tenantGetKV(params).then(res => {
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
            label: '高级检索',
            code: 'more-filter'
          }, {
            label: '重置',
            code: 'reset',
            type: 'default'
          }
        ]

        const statusMap = this.$t('rs.orderStatus')

        for(let k in statusMap) {
          this.orderStatusItems.push({
            id: k,
            name: statusMap[k]
          })
        }
      },
      // 表单提交
      async formSubmit(form) {
        try {
          const searchForm = this.$refs.searchForm
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
            case 'FilterForm':
              this.tableParams = {
                ...this.tableParams,
                ...form
              }
              if (searchForm) {
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
            this.dialogIsFull = true
            res = await this.orderView(row.id)
            this.dialogTitle = '订单号：' + row.orderNo
            this.dialogForm = res.data || {}
            this.dialogComponent = 'DetailTravel'
            this.dialogVisible = true
            break;
        }
      },
      moreFilter() {
        this.dialogIsFull = false
        this.dialogTitle = '高级检索'
        this.dialogForm = this.tableParams
        this.dialogComponent = 'FilterForm'
        this.dialogVisible = true
      },
      ...mapActions('order', [
        'orderView',
      ])
    },
    created() {
      this.initPage()
    },
    destroyed() {}
  }
</script>

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
  import { getTimestamp } from '@/utils/tools'
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
      TravelOrderDetail: () => import('@/pages/order/detail/travel'),
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
            formater: ({ payType }) => {
              return this.$t('rs.payType')[payType] || '--'
            }
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
            label: '地接团号：',
            field: 'groupNo',
            placeholder: '地接团号',
            type: 1
          },
          {
            label: '下单商户：',
            field: 'tenantId|id',
            placeholder: '模糊搜索',
            type: 1,
            autofill: true,
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
            label: '下单时间：',
            field: ['orderTimeStart', 'orderTimeEnd'],
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间',
            type: 10,
            pickerOptions: {
              disabledDate(time) {
                return time.getTime() > Date.now()
              }
            }
          },
          {
            label: '出行时间：',
            field: ['travelDateStart', 'travelDateEnd'],
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间',
            type: 10
          }
        ]

        this.searchBtns = [
          {
            label: '确认',
            code: 'confirm'
          }, 
          // {
          //   label: '高级检索',
          //   code: 'more-filter'
          // }, 
          {
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
        const url = `/orderDist/export`
        const searchData = this.$refs.searchForm.getData()
        const { orderTimeStart: ots, orderTimeEnd: ote, travelDateStart: tds, travelDateEnd: tde } = searchData
        let params = []
        let ids = this.tableSelected.map(v => v.id)
        const origin = window.location.origin

        switch (type) {
          case 'detail':
            this.$router.openNewTab('/order/detail/travel', { id: row.id })
            break;
          case 'export':
            if (ids.length) {
              params.ids = ids.join(',')
            } else {
              for(let k in searchData) {
                if (searchData[k] || searchData[k] === 0) {
                  params.push(`${ k }=${ searchData[k] }`)
                }
              }
  
              if (!ots && !tds) {
                this.$msgError('请选择下单或出行的起始时间，且不超过30天')
                return false
              }
  
              if (ots && ote && (getTimestamp(ote) - getTimestamp(ots)) > 30*24*3600*1000) {
                this.$msgError('下单时间不能超过30天')
                return false
              }
  
              if (tds && tde && (getTimestamp(tde) - getTimestamp(tds)) > 30*24*3600*1000) {
                this.$msgError('出行时间不能超过30天')
                return false
              }
            }
            
            window.open(`${ origin + url }?${ params.join('&') }`)
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
      ]),
      ...mapActions('tenant', [
        'tenantGetKV'
      ])
    },
    created() {
      this.initPage()
    },
    destroyed() {}
  }
</script>

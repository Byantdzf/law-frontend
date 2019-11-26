<template>
  <el-row>
    <el-card class="table-card">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="head-label">订单类型</span>
        </el-row>
        <el-radio-group class="table-card-tabs fl" v-model="orderTypeValue">
          <el-radio-button
            v-for="(item, index) in orderType"
            :key="index"
            :label="item.id"
          >
            {{ item.name }}
          </el-radio-button>
        </el-radio-group>
      </el-row>
      
      <el-row slot="header" class="clearfix mt-10" v-if="orderCategory.length">
        <el-row class="fl">
          <span class="head-label">订单种类</span>
        </el-row>
        <el-radio-group class="table-card-tabs fl" v-model="orderCategoryValue">
          <el-radio-button
            v-for="(item, index) in orderCategory"
            :key="index"
            :label="item.id"
          >
            {{ item.name }}
          </el-radio-button>
        </el-radio-group>
      </el-row>
      <el-row slot="header" class="clearfix mt-10" v-if="orderTypeValue != 4">
        <el-row class="fl">
          <span class="head-label">订单状态</span>
        </el-row>
        <el-radio-group class="table-card-tabs fl" v-model="orderStatusValue">
          <el-radio-button
            v-for="(item, index) in orderStatus"
            :key="index"
            :label="item.id"
          >
            {{ item.name }}
          </el-radio-button>
        </el-radio-group>
      </el-row>
      
      <el-row slot="header" class="clearfix mt-10" v-if="orderTypeValue != 4">
        <el-row class="fl">
          <span class="head-label">订单来源</span>
        </el-row>
        <el-radio-group class="table-card-tabs fl" v-model="orderSourceValue">
          <el-radio-button
            v-for="(item, index) in orderSource"
            :key="index"
            :label="item.id"
          >
            {{ item.name }}
          </el-radio-button>
        </el-radio-group>
      </el-row>

      <app-table 
        ref="appTable"
        url="/mng/order/orderList"
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
      :full="dialogIsFull"
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
  // import AppRsText from '@/components/app-table/lib/rsText'
  import { cloneDeep, isString, isNumber, isPlainObject } from 'lodash-es'
  export default {
    components: {
      Detail: () => import("../detail"),
      ConfirmAmount: () => import('../common/ConfirmAmount'),
      OrderRule: () => import('../common/OrderRule'),
      OrderLawyers: () => import('@/pages/order/common/OrderLawyers'),
    },
    mixins: [AppTable, AppDialog, AppSearch],
    data() {
      let statusItems = []
      let sourceItems = []
      for(let k in this.$t('rs.orderStatus')) {
        statusItems.push({
          id: +k,
          name: this.$t('rs.orderStatus')[k]
        })
      }
      for(let k in this.$t('rs.orderSource')) {
        if (k != 4) {
          sourceItems.push({
            id: +k,
            name: this.$t('rs.orderSource')[k]
          })
        }
      }
      return {
        defaultColumns: [
          {
            label: '序号',
            field: 'index',
            width: 70
          },{
            label: '订单编号',
            field: 'orderNo'
          },{
            label: '订单时间',
            field: 'orderTime'
          },{
            label: '订单类型',
            field: 'orderType',
            formater: ({ orderType }) => this.$t('rs.orderType')[orderType]
          },{
            label: '订单种类',
            field: 'orderCategory',
            formater: ({ orderCategory }) => this.$t('rs.orderCategory')[orderCategory]
          },{
            label: '当前订单状态',
            field: 'orderStatus',
            formater: ({ orderStatus }) => this.$t('rs.orderStatus')[orderStatus]
          },{
            label: '订单当前路径',
            field: 'orderSource',
            formater: ({ orderSource }) => this.$t('rs.orderSource')[orderSource]
          },{
            label: '派单方式',
            field: 'dispatchWay',
            formater: ({ dispatchWay }) => this.$t('rs.orderRule')[dispatchWay],
            align: 'center',
            width: 90
          },{
            label: '订单金额',
            field: 'amount',
            align: 'center',
            width: 80
          }
        ],
        templateColumns: [
          {
            label: '序号',
            field: 'index',
            width: 70
          },{
            label: '订单编号',
            field: 'orderNo'
          },{
            label: '订单类型',
            field: 'orderType',
            formater: ({ orderType }) => this.$t('rs.orderType')[orderType]
          },{
            label: '订单状态',
            field: 'orderStatus',
            formater: ({ orderStatus }) => this.$t('rs.orderStatus')[orderStatus]
          },{
            label: '订单金额',
            field: 'amount'
          },{
            label: '文件类型',
            field: 'fileType',
            formater: ({ fileType }) => this.$t('rs.orderBusinessType')[fileType]
          },{
            label: '操作',
            field: 'operate',
            align: 'center',
            width: 120,
            type: 'button',
            items: ['查看详情'],
            on: {
              click: ({ row }) => {
                this.handleBtnAction(row, 'detail')
              }
            }
          }
        ],
        orderTypeValue: '',
        orderCategoryValue: '',
        orderStatusValue: '',
        orderSourceValue: '',
        orderType: [
          { id: '', name: '全部' },
          { id: 1, name: '在线法律咨询', child: [
            { id: '', name: '全部' },
            { id: 11, name: '在线律师咨询' },
            { id: 12, name: '指定律师咨询' }
          ]},
          { id: 2, name: '分块法律服务', child: [
            { id: '', name: '全部' },
            { id: 21, name: '日常法律服务' },
            { id: 22, name: '分块法律服务' }
          ]},
          { id: 3, name: '代理律师服务', child: [
            { id: '', name: '全部' },
            { id: 31, name: '收费代理' },
            { id: 32, name: '风险代理' }
          ]},
          { id: 4, name: '法律文件购买' }
        ],
        orderCategory: [],
        orderStatus: [
          { id: '', name: '全部' },
          ...statusItems
        ],
        orderSource: [
          { id: '', name: '全部' },
          ...sourceItems
        ],
      }
    },
    computed: {
      columns() {
        if (this.orderTypeValue == 4) {
          return this.templateColumns
        } else {
          let operateItem = {
            label: '操作',
            field: 'operate',
            align: 'center',
            width: 120,
            type: 'button',
            formater: (row) => {
              let items = [{ label: '查看详情', code: 'detail' }]
              if (row.orderStatus == '10') {
                items.push({ label: '修改订单金额', code: 'modifyAmount' })
              }
              if (row.orderStatus == '20') {
                items.push({ label: '修改派单方式', code: 'modifyDispatchWay' })
                items.push({ label: '置顶', code: 'topping' })
              }
              return items
            },
            on: {
              click: ({ row, btn }) => {
                this.handleBtnAction(row, btn.code)
              }
            }
          }
          return this.defaultColumns.concat([operateItem])
        }
      }
    },
		watch: {
			orderTypeValue(nv) {
        this.orderCategoryValue = ''
        this.orderStatusValue = ''
        this.orderSourceValue = ''
        this.orderCategory = []
				if (nv && nv != 4) {
          let index = this.orderType.findIndex(item => item.id == nv)
          let items = this.orderType[index]
          this.orderCategory = items.child || []
        }
        this.setTableParams()
			},
			orderCategoryValue() {
				this.setTableParams()
			},
			orderStatusValue() {
				this.setTableParams()
			},
			orderSourceValue() {
				this.setTableParams()
			}
		},
    methods: {
      setTableParams() {
        this.tableParams = {
          orderType: this.orderTypeValue,
          orderCategory: this.orderCategoryValue,
          orderStatus: this.orderStatusValue,
          orderSource: this.orderSourceValue
        }
      },
      // 表单提交
      async formSubmit(form) {
        try {
          let { id: orderId, rule: dispatchWay, amount: fee, lawyerId } = form
          switch(this.dialogComponent) {
            case 'OrderRule':
              if (dispatchWay == 1) {
                await this.orderModifyDispatchWay({ orderId, dispatchWay })
                this.$msgSuccess('操作成功！')
                this.closeDialog()
                this.refreshTable()
              } else {
                this.dialogWidth = '800px'
                this.dialogTitle = '选择律师发送'
                this.dialogForm = { id: orderId }
                this.dialogComponent = 'OrderLawyers'
                this.dialogVisible = true
              }
              break;
            case 'OrderLawyers':
              await this.orderModifyDispatchWay({ orderId, dispatchWay: 2, lawyerId })
              this.$msgSuccess('操作成功！')
              this.closeDialog()
              this.refreshTable()
              break;
            case 'ConfirmAmount':
              await this.orderComfirmOrderAmount({ orderId, fee })
              this.$msgSuccess('操作成功！')
              this.closeDialog()
              this.refreshTable()
              break;
          }
        } catch (e) {
          // error
        }
      },
      async handleBtnAction(row, type) {
        try {
          // let res = {}
          switch (type) {
            case 'topping':
              await this.$confirm('确认置顶此订单吗?', '温馨提示', { type: 'warning' })
              await this.orderUpdateOrderToTop({ orderId: row.id })
              this.$msgSuccess('操作成功！')
              this.refreshTable()
              break;
            case 'modifyAmount':
              this.dialogIsFull = false
              this.dialogWidth = '400px'
              this.dialogTitle = '确认订单金额'
              this.dialogForm = row
              this.dialogComponent = 'ConfirmAmount'
              this.dialogVisible = true
              break;
            case 'modifyDispatchWay':
              row.rule = row.dispatchWay
              this.dialogIsFull = false
              this.dialogWidth = '400px'
              this.dialogTitle = '修改派单规则'
              this.dialogForm = row
              this.dialogComponent = 'OrderRule'
              this.dialogVisible = true
              break;
            case 'detail':
              this.dialogIsFull = true
              this.dialogTitle = '订单详情'
              this.dialogForm = row
              this.dialogComponent = 'Detail'
              this.dialogVisible = true
              break;
          }
        } catch (error) {
          // error
        }
      },
      ...mapActions('order', [
        'orderView',
        'orderUpdateOrderToTop',
        'orderModifyDispatchWay',
        'orderComfirmOrderAmount'
      ])
    }
  }
</script>


<style lang="less">
  .header {
    margin-bottom: 10px;
  }
  .head-label {
    line-height: 32px; 
    margin-right:10px; 
    color:#999;
  }
</style>
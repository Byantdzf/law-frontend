<template>
  <el-row>
    <el-card class="table-card mt-10">
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
      
      <el-row slot="header" class="clearfix mt-10">
        <el-row class="fl">
          <span class="head-label">订单当前路径</span>
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
  import AppTableImgs from '@/components/app-table/lib/imgs'
  import AppRsText from '@/components/app-table/lib/rsText'
  export default {
    components: {
      // Detail: () => import("./detail"),
      // HqDivide: () => import("./hqDivide"),
    },
    mixins: [AppTable, AppDialog, AppSearch],
    data() {
      return {
        columns: [
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
            formater: ({ type }) => this.$t('rs.orderType')[type]
          },{
            label: '订单种类',
            field: 'orderCategory',
            formater: ({ type }) => this.$t('rs.orderCategory')[type]
          },{
            label: '当前订单状态',
            field: 'orderStatus',
            formater: ({ type }) => this.$t('rs.orderStatus')[type]
          },{
            label: '订单当前路径',
            field: 'orderSource'
          },{
            label: '派单方式',
            field: 'dispatchWay',
            formater: ({ type }) => this.$t('rs.orderRule')[type]
          },{
            label: '订单金额',
            field: 'amount'
          },{
            label: '操作',
            field: 'operate',
            align: 'center',
            width: 120,
            type: 'button',
            items: ['查看详情'],
            on: {
              click: ({ row, index }) => {
                this.handleBtnAction(row, 'detail')
              }
            }
          }
        ],
        articleType: 0,
        orderTypeValue: '',
        orderSourceValue: '',
        orderType: [
          { id: '', name: '全部' },
          { id: 1, name: '在线法律服务订单', child: [
            { id: '', name: '全部' },
            { id: 11, name: '在线律师咨询' },
            { id: 12, name: '指定律师咨询' }
          ]},
          { id: 2, name: '分块法律服务订单', child: [
            { id: '', name: '全部' },
            { id: 21, name: '日常法律服务' },
            { id: 22, name: '分块法律服务' }
          ]},
          { id: 3, name: ' 全案委托律师订单', child: [
            { id: '', name: '全部' },
            { id: 31, name: '收费代理' },
            { id: 32, name: '风险代理' }
          ]},
          { id: 4, name: '协议文本下载订单' }
        ],
        orderSource: [
          { id: '', name: '全部' },
          { id: 1, name: '系统推送订单' },
          { id: 2, name: '订单池订单' },
          { id: 3, name: '委托律师订单' }
        ],
        tableParams: {
          onlyAppealOrder: 'Y'
        }
      }
    },
		watch: {
			orderTypeValue(e) {
				if (e && e != 4) {
          let index = this.orderType.findIndex(item => {
            return item.id == e
          })
          let items = this.orderType[index]
          this.orderCategory = items.child || []
        } else {
          this.orderCategory = []
        }
          this.orderCategoryValue = ''
			},
			orderSourceValue(e) {
				console.log(e)
			}
		},
    methods: {
      // 初始化页面
      initPage() {
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
      ...mapActions('tenant', [
        'tenantView',
        'tenantDivideHq',
        'tenantGetKV'
      ])
    },
    created() {
      this.initPage()
    },
  }
</script>


<style lang="less">
  .header {
    margin-bottom: 10px;
  }
  .head-label {
    width:90px;
    display: inline-block;
    line-height: 32px; 
    margin-right:10px; 
    color:#999;
  }
</style>
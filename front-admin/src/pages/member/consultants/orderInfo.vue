<template>
  <el-row>
    <h3 class="pb-20">{{ $val(row, 'userInfo.name') }}的订单</h3>
    <el-row class="clearfix">
      <el-radio-group class="table-card-tabs" v-model="orderTypeValue">
        <el-radio-button
          v-for="(item, index) in orderType"
          :key="index"
          :label="item.id"
        >
          {{ item.name }}
        </el-radio-button>
      </el-radio-group>
    </el-row>
    
    <el-row class="clearfix mt-10" v-if="orderCategory.length">
      <el-radio-group class="table-card-tabs" v-model="orderCategoryValue">
        <el-radio-button
          v-for="(item, index) in orderCategory"
          :key="index"
          :label="item.id"
        >
          {{ item.name }}
        </el-radio-button>
      </el-radio-group>
    </el-row>
    <el-row class="clearfix mt-10 mb-10">
      <el-radio-group class="table-card-tabs" v-model="orderStatusValue">
        <el-radio-button
          v-for="(item, index) in orderStatus"
          :key="index"
          :label="item.id"
        >
          {{ item.name }}
        </el-radio-button>
      </el-radio-group>
    </el-row>

    <app-table 
      ref="appTable"
      :url="`/member/user/orderList/${row.id}`"
      :params="tableParams"
      :columns="columns"
    />
  </el-row>
</template>

<script>
  import AppTable from '@/mixins/table'
  import AppRsText from '@/components/app-table/lib/rsText'
  import { cloneDeep } from 'lodash-es'
  export default {
    mixins: [AppTable],
    props: {
      row: Object
    },
    data() {
      return {
        tableParams: {},
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
            formater: ({ orderType }) => this.$t('rs.orderType')[orderType],
          },{
            label: '订单种类',
            field: 'orderCategory',
            formater: ({ orderCategory }) => this.$t('rs.orderCategory')[orderCategory]
          },{
            label: '订单状态',
            field: 'orderStatus',
            formater: ({ orderStatus }) => this.$t('rs.orderStatus')[orderStatus]
          },{
            label: '订单金额',
            field: 'amount',
            width: 70
          },{
            label: '操作',
            field: 'operate',
            align: 'center',
            width: 80,
            type: 'button',
            default: '查看详情',
            on: {
              click: ({ row }) => {
                this.handleBtnAction(row)
              }
            }
          }
        ],
        orderTypeValue: '',
        orderCategoryValue: '',
        orderStatusValue: '',
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
        orderCategory: [
        ],
        orderStatus: [
          { id: '', name: '全部' },
          { id: 20, name: '待接单' },
          { id: 30, name: '已接单' },
          { id: 40, name: '完成待确认' },
          { id: 50, name: '待评价' },
          { id: 60, name: '已完成' }
        ]
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
        this.tableParams.orderType = e;
        this.orderCategoryValue = ''
        this.refreshTable()
			},
			orderCategoryValue(e) {
        console.log(e)
        this.tableParams.orderCategory = e;
        this.refreshTable()
			},
			orderStatusValue(e) {
        console.log(e)
        this.tableParams.orderStatus = e;
        this.refreshTable()
			}
		},
    methods: {
      // 初始化页面
      initPage() {
        console.log(this.row)
      },
      async handleBtnAction(row) {
        
      }
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
    line-height: 32px; 
    margin-right:10px; 
    color:#999;
  }
</style>
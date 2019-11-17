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
  export default {
    components: {
      Detail: () => import("../detail"),
    },
    mixins: [AppTable, AppDialog, AppSearch],
    data() {
      let statusItems = []
      let sourceItems = []
      for(let k in this.$t('rs.orderStatus')) {
        if (!(k == 10 || k == 20)) {
          statusItems.push({
            id: +k,
            name: this.$t('rs.orderStatus')[k]
          })
        }
      }
      for(let k in this.$t('rs.orderSource')) {
        sourceItems.push({
          id: +k,
          name: this.$t('rs.orderSource')[k]
        })
      }
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
          ]}
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
        tableParams: {
          onlyAppealOrder: 'Y'
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
          orderSource: this.orderSourceValue,
          onlyAppealOrder: 'Y'
        }
      },
      // 表单提交
      async formSubmit(form) {
        try {
          
        } catch (e) {
          // error
        }
      },
      async handleBtnAction(row, type) {
        switch (type) {
          case 'detail':
            this.dialogIsFull = true
            this.dialogTitle = '订单详情'
            this.dialogForm = row
            this.dialogComponent = 'Detail'
            this.dialogVisible = true
            break;
        }
      },
    },
    created() {

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
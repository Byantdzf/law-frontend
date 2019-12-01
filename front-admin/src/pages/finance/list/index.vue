<template>
  <el-row>
    <el-card class="table-card">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">{{typeObj.label}}</span>
        </el-row>
        <el-row class="fr">
          <el-select v-model="typeValue" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-row>
      </el-row>

      <h3 class="subtitle">交易数据统计</h3>
      <el-row class="prl-20">
        <el-row :gutter="20">
          <el-col class="statistics-box" :span="6">
            <div class="con">
              <p>昨日{{typeObj.str}}总收入（元）</p>
              <p class="num">{{staticsData.todayOrderAmount}}</p>
              <!-- <p class="fontGreen">
                <span>较上日</span>
                <i class="el-icon-bottom"></i>
                <span>5</span>
              </p> -->
            </div>
          </el-col>
          <el-col class="statistics-box" :span="6">
            <div class="con">
              <p>上周{{typeObj.str}}总收入（元）</p>
              <p class="num">{{staticsData.weeklyOrderAmount}}</p>
              <!-- <p class="fontRed">
                <span>较上周</span>
                <i class="el-icon-top"></i>
                <span>5</span>
              </p> -->
            </div>
          </el-col>
          <el-col class="statistics-box" :span="6">
            <div class="con">
              <p>上月{{typeObj.str}}总收入（元）</p>
              <p class="num">{{staticsData.monthOrderAmount}}</p>
              <!-- <p class="fontRed">
                <span>较上月</span>
                <i class="el-icon-top"></i>
                <span>5</span>
              </p> -->
            </div>
          </el-col>
          <el-col class="statistics-box" :span="6">
            <div class="con">
              <p>历史{{typeObj.str}}总收入</p>
              <p class="num">{{staticsData.historyOrderAmount}}</p>
            </div>
          </el-col>
          <el-col class="statistics-box" :span="6">
            <div class="con">
              <p>昨日{{typeObj.str}}总利润（元）</p>
              <p class="num">{{staticsData.todayEarnings}}</p>
              <!-- <p class="fontRed">
                <span>较上日</span>
                <i class="el-icon-top"></i>
                <span>5</span>
              </p> -->
            </div>
          </el-col>
          <el-col class="statistics-box" :span="6">
            <div class="con">
              <p>上周{{typeObj.str}}总利润（元）</p>
              <p class="num">{{staticsData.weeklyEarnings}}</p>
              <!-- <p class="fontRed">
                <span>较上周</span>
                <i class="el-icon-top"></i>
                <span>5</span>
              </p> -->
            </div>
          </el-col>
          <el-col class="statistics-box" :span="6">
            <div class="con">
              <p>上月{{typeObj.str}}总利润（元）</p>
              <p class="num">{{staticsData.monthEarnings}}</p>
              <!-- <p class="fontRed">
                <span>较上月</span>
                <i class="el-icon-top"></i>
                <span>5</span>
              </p> -->
            </div>
          </el-col>
          <el-col class="statistics-box" :span="6">
            <div class="con">
              <p>历史{{typeObj.str}}总利润</p>
              <p class="num">{{staticsData.historyEarnings}}</p>
            </div>
          </el-col>
        </el-row>
      </el-row>

    </el-card>
    
    <el-card class="search-card mt-10">
      <el-row class="fl">
        <app-form
          class="app-search"
          :init="searchFormInit"
          :items="searchItems"
          :btns="searchBtns"
          @confirm="confirmSearch"
          @reset="confirmSearch"
          ref="searchForm"
        />
      </el-row>
      <el-row class="fr">
        <el-button type="primary" @click="exportFile">导出</el-button>
      </el-row>
    </el-card>
    <el-card class="table-card">
      <app-table 
        ref="appTable"
        url="/mng/financialManage/queryCashOrderInfoList"
        columnType="selection"
        :params="tableParams"
        :columns="columns"
        :columns-props="columnsProps"
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

    <el-card class="table-card mt-10">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">平台收入图</span>
        </el-row>
        <el-form class="fl pl-20" :inline="true">
          <el-form-item label="时间">
            <el-select v-model="form1.dateDimension" style="width: 100px;">
              <el-option v-for="(item, index) in timeItems" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="form1.dates"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getSummaryReceipts">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row class="pa-20 radio-box">
        <el-radio-group v-model="form1.dateDimension">
          <el-radio-button v-for="item in radioItems" :key="item.id" :label="item.id">{{ item.name }}</el-radio-button>
        </el-radio-group>
      </el-row>
      <AppChartBar :data="chartData1"/>
    </el-card>
    
    <el-card class="table-card mt-10">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">平台利润图</span>
        </el-row>
        <el-form class="fl pl-20" :inline="true">
          <el-form-item label="时间">
            <el-select v-model="form2.dateDimension" style="width: 100px;">
              <el-option v-for="(item, index) in timeItems" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="form1.dates"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getSummaryProfit">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row class="pa-20 radio-box">
        <el-radio-group v-model="form2.dateDimension">
          <el-radio-button v-for="item in radioItems" :key="item.id" :label="item.id">{{ item.name }}</el-radio-button>
        </el-radio-group>
      </el-row>
      <AppChartBar :data="chartData2"/>

    </el-card>
  </el-row>
</template>


<script>
  import { mapActions } from 'vuex'
  import AppTable from '@/mixins/table'
  import AppDialog from '@/mixins/dialog'
  import AppSearch from '@/mixins/search'
  import AppChartBar from '@/components/app-chart-bar'
  import SYSTEM from '@/utils/system'
  export default {
    components: {
      AppSelect: () => import('@/components/app-select'),
      Detail: () => import("../../order/detail"),
      Edit: () => import("./edit"),
      AppChartBar
    },
    mixins: [AppTable, AppDialog, AppSearch],
    data() {
      return {
        chartData1: [],
        chartData2: [],
        staticsData: {},
        typeValue: '',
        typeObj: {},
        options: [{
          value: '',
          label: '平台收入列表',
          str: ''
        }, {
          value: '1',
          label: '咨询服务板块',
          str: '咨询服务',
          child: [
            { id: 11, name: '在线律师咨询' },
            { id: 12, name: '指定律师咨询' }
          ]
        }, {
          value: '2',
          label: '分块法律服务板块',
          str: '分块法律服务',
          child: [
            { id: 21, name: '日常法律服务' },
            { id: 22, name: '分块法律服务' }
          ]
        }, {
          value: '3',
          label: '委托律师服务板块',
          str: '委托律师服务',
          child: [
            { id: 31, name: '收费代理' },
            { id: 32, name: '风险代理' }
          ]
        }, {
          value: '4',
          label: '协议模版销售板块',
          str: '协议模版销售'
        }],
        columns: [
          {
            label: '序号',
            field: 'index',
            width: 100
          },{
            label: '订单类型',
            field: 'orderType',
            formater: ({ orderType }) => this.$t('rs.orderType')[orderType]
          },{
            label: '订单种类',
            field: 'orderCategory',
            formater: ({ orderCategory }) => this.$t('rs.orderCategory')[orderCategory]
          },{
            label: '订单号',
            field: 'orderNo',
            width: '150',
          },{
            label: '会员昵称',
            field: 'name',
          },{
            label: '会员ID',
            field: 'userId',
            width: '150',
          },{
            label: '应付金额',
            field: 'orgAmount',
          },{
            label: '优惠券',
            field: 'couponDesc',
          },{
            label: '实付金额',
            field: 'amount',
          },{
            label: '平台利润',
            field: 'platformProfitAmount',
          },{
            label: '支付方式',
            field: 'payWay',
            formater: ({ payWay }) => this.$t('rs.payment')[payWay]
          },{
            label: '支付账号',
            field: 'payAccount',
            width: '150',
          },{
            label: '支付时间',
            field: 'payTime',
          },{
            label: '备注',
            field: 'remark',
          },{
            label: '操作',
            field: 'operate',
            align: 'center',
            width: 120,
            type: 'button',
            items: ['修改备注', '详情'],
            on: {
              click: ({ row, index }) => {
                this.handleBtnAction(row, index == 0 ? 'edit' : 'detail')
              }
            }
          }
        ],
        columnsProps: {
          minWidth: 100,
        },
        form1: {
          dateDimension: -1,
          dates: []
        },
        form2: {
          dateDimension: -1,
          dates: []
        },
        radioItems: [],
        timeItems: [],
      }
    },
    watch: {
      typeValue(type) {
        this.tableParams = {
          ...this.tableParams,
          orderType: type
        }
        let obj = {}
        this.options.forEach(item => {
          if (type == item.value) {
            obj = item
          }
        })
        this.typeObj = obj
        this.selectStatics()
        this.setSearchParams()
      },
      'form1.dateDimension'() {
        this.getSummaryReceipts()
      },
      'form2.dateDimension'() {
        this.getSummaryProfit()
      },
    },
    methods: {
      // 初始化页面
      initPage() {
        this.typeObj = this.options[0]

        this.selectStatics()

        this.$set(this.searchFormInit, 'align', 'left')

        this.setSearchParams()

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

        let times = [
          {
            id: 1,
            name: '天'
          },{
            id: 2,
            name: '周'
          },{
            id: 3,
            name: '月'
          },{
            id: 4,
            name: '年'
          }
        ]

        this.radioItems = times
        
        this.timeItems = [
          {
            id: -1,
            name: '全部'
          },
          ...times
        ]
      },
      async exportFile(){
        // await this.userListexport(this.tableParams)
        SYSTEM.download(`/mng/financialManage/queryCashOrderInfoList/export`, this.tableParams)
      },
      setSearchParams() {
        this.searchItems = [
          {
            label: '支付时间',
            field: ['startDate', 'endDate'],
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间',
            type: 10
          },
          {
            label: '会员号',
            field: 'userId',
            type: 1,
          },
          {
            label: '流水号',
            field: 'cashRecordId',
            type: 1,
          }
        ]

        if (this.typeObj.value && this.typeObj.child && this.typeObj.child.length) {
          this.searchItems = [...this.searchItems, {
            label: '&nbsp;',
            field: 'orderCategory',
            type: 2,
            options: this.typeObj.child
          }]
        }

        this.searchItems = [...this.searchItems, {
            label: '&nbsp;',
            field: 'keyword',
            type: 1,
          }]
      },

      selectStatics() {
        let params = {}
        let val = this.typeObj.value
        if (val) {
          params.orderType = this.typeObj.value
        }
        this.statics(params).then(res => {
          this.staticsData = res.data || {}
        })
      },
      // 表单提交
      async formSubmit(form) {
        try {
          if ('id' in form) {
            await this.updateRemark(form)
            this.closeDialog()
            this.refreshTable()
            this.$msgSuccess('修改成功')
          }
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
          case 'edit':
            this.dialogIsFull = false
            this.dialogWidth = '600px'
            this.dialogTitle = '编辑备注'
            this.dialogForm = row
            this.dialogComponent = 'Edit'
            this.dialogVisible = true
            break;
        }
      },
      async getSummaryReceipts() {
        try {
          let params = {}
          let { dateDimension, dates } = this.form1
          if(this.typeValue) {
            params.orderType = this.typeValue
          }
          if(dateDimension != -1) {
            params.dateDimension = dateDimension
          }
          if(dates && dates.length) {
            params.startDate = dates[0]
            params.endDate = dates[1]
          }
          const res = await this.summaryReceipts(params)
          
          let items = res.data || []
          this.chartData1 = []

          items.forEach(v => {
            this.chartData1.push({
              y: v.amount,
              x: v.createTime
            })
          })

        } catch (error) {
          // error
        }
      },
      async getSummaryProfit() {
        try {
          let params = {}
          let { dateDimension, dates } = this.form2
          if(this.typeValue) {
            params.orderType = this.typeValue
          }
          if(dateDimension != -1) {
            params.dateDimension = dateDimension
          }
          if(dates && dates.length) {
            params.startDate = dates[0]
            params.endDate = dates[1]
          }
          const res = await this.summaryProfit(params)
          
          let items = res.data || []
          this.chartData2 = []

          items.forEach(v => {
            this.chartData2.push({
              y: v.amount,
              x: v.createTime
            })
          })
        } catch (error) {
          // error
        }
      },
      ...mapActions('finance', [
        'statics',
        'updateRemark',
        'summaryReceipts',
        'summaryProfit',
      ])
    },
    created() {
      this.initPage()
      this.getSummaryReceipts()
      this.getSummaryProfit()
    }
  }
</script>


<style lang="less">
  .subtitle {
    padding: 10px 20px;
    font-weight: normal;
    font-size: 14px;
  }
  .statistics-box {
    margin-bottom: 20px;
    text-align: center;
    font-size: 13px;
    .con {
      height: 95px;
      padding: 10px;
      background: #EDEDF1;
      border-radius: 3px;
    }
    .num {
      padding: 6px 0;
      font-size: 18px;
    }
  }
  .radio-box {
    margin-left: 100px;
  }
</style>

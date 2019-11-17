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
        <el-button type="primary">导出</el-button>
      </el-row>
    </el-card>
    <el-card class="table-card">
      <app-table 
        ref="appTable"
        url="/pc/coupon/pool"
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
      </el-row>

      <el-row class="prl-20">
        <el-row :gutter="20">
          <el-col class="statistics-box" :span="6">
          </el-col>
        </el-row>
      </el-row>

    </el-card>
    
    <el-card class="table-card mt-10">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">平台利润图</span>
        </el-row>
      </el-row>

      <el-row class="prl-20">
        <el-row :gutter="20">
          <el-col class="statistics-box" :span="6">
          </el-col>
        </el-row>
      </el-row>

    </el-card>
    
  </el-row>
</template>


<script>
  import { mapActions } from 'vuex'
  import AppTable from '@/mixins/table'
  import AppDialog from '@/mixins/dialog'
  import AppSearch from '@/mixins/search'
  import AppRsText from '@/components/app-table/lib/rsText'
  export default {
    components: {
      AppSelect: () => import('@/components/app-select'),
      // Detail: () => import("./detail"),
      // HqDivide: () => import("./hqDivide"),
    },
    mixins: [AppTable, AppDialog, AppSearch],
    data() {
      return {
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
          str: '咨询服务'
        }, {
          value: '2',
          label: '分块法律服务板块',
          str: '分块法律服务'
        }, {
          value: '3',
          label: '委托律师服务板块',
          str: '委托律师服务'
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
            field: 'couponName',
          },{
            label: '订单种类',
            field: 'scene',
          },{
            label: '订单号',
            field: 'type',
          },{
            label: '会员昵称',
            field: 'remark',
          },{
            label: '会员ID',
            field: 'sendCount',
          },{
            label: '应付金额',
            field: 'pay',
          },{
            label: '使用优惠券信息',
            field: 'conpon',
          },{
            label: '实付金额',
            field: 'realPay',
          },{
            label: '平台利润',
            field: 'rangeStartTime',
          },{
            label: '支付方式',
            field: 'rangeEndTime',
          },{
            label: '支付账号',
            field: 'dataStatus',
          },{
            label: '支付时间',
            field: 'dataStatus1',
          },{
            label: '备注',
            field: 'dataStatus2',
          },{
            label: '操作',
            field: 'operate',
            align: 'center',
            width: 120,
            type: 'button',
            default: ['修改备注', '详情'],
            on: {
              click: ({ row }) => {
                this.handleBtnAction(row, index == 0 ? 'edit' : 'view')
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
      typeValue(type) {
        let obj = {}
        this.options.forEach(item => {
          if (type == item.value) {
            obj = item
          }
        })
        this.typeObj = obj
        this.selectStatics()
      }
    },
    methods: {
      // 初始化页面
      initPage() {
        this.typeObj = this.options[0]

        this.selectStatics()

        this.$set(this.searchFormInit, 'align', 'left')

        this.searchItems = [
          {
            label: '支付时间',
            field: ['rangeStartTime', 'rangeEndTime'],
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间',
            type: 10
          },
          {
            label: '会员号',
            field: 'couponName',
            type: 1,
          },
          {
            label: '流水号',
            field: 'couponName',
            type: 1,
          },
          {
            label: '&nbsp;',
            field: 'couponName',
            type: 1,
          },
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
      ...mapActions('finance', [
        'statics'
      ])
    },
    created() {
      this.initPage()
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
</style>

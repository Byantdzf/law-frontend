<template>
  <el-row>
    <el-card class="table-card">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">运营数据统计</span>
        </el-row>
      </el-row>

      <h3 class="subtitle">交易数据统计</h3>
      <el-row class="prl-20">
        <el-row :gutter="20">
          <StatisticsBox title="昨日总收入（元）" subtitle="较上日" :value="smb.todayOrderAmount" :subvalue="smb.comparePreDayDiffAmount"/>
          <StatisticsBox title="上周总收入（元）" subtitle="较上周" :value="smb.weeklyOrderAmount" :subvalue="smb.comparePreWeekDiffAmount"/>
          <StatisticsBox title="上月总收入（元）" subtitle="较上月" :value="smb.monthOrderAmount" :subvalue="smb.comparePreMonthDiffAmount"/>
          <StatisticsBox title="历史总收入" :value="smb.historyOrderAmount"/>

          <StatisticsBox title="昨日总利润（元）" subtitle="较上日" :value="smb.todayEarnings" :subvalue="smb.comparePreDayDiffEarnings"/>
          <StatisticsBox title="上周总利润（元）" subtitle="较上周" :value="smb.weeklyEarnings" :subvalue="smb.comparePreWeekDiffEarnings"/>
          <StatisticsBox title="上月总利润（元）" subtitle="较上月" :value="smb.monthEarnings" :subvalue="smb.comparePreMonthDiffEarnings"/>
          <StatisticsBox title="历史总利润" :value="smb.historyEarnings"/>
        </el-row>
      </el-row>

      <h3 class="subtitle">订单信息显示</h3>
      <el-row class="prl-20">
        <el-row :gutter="20">
          <StatisticsBox title="昨日交易订单数" subtitle="较上日" :value="smo.yesterdayOrderCount" :subvalue="smo.comparePreDayOrderCount"/>
          <StatisticsBox title="上周交易订单数" subtitle="较上周" :value="smo.weekOrderCount" :subvalue="smo.comparePreWeekOrderCount"/>
          <StatisticsBox title="上月交易订单数" subtitle="较上月" :value="smo.monthOrderCount" :subvalue="smo.comparePreMonthOrderCount"/>
          <StatisticsBox title="历史交易订单数" :value="smo.historyOrderCount"/>
        </el-row>
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="orderType"
            label="订单类别"
            align="center"
            width="120">

          </el-table-column>
          <el-table-column
            prop="orderCategory"
            label="订单种类"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column align="center" prop="yesterdaySummaryCount" label="昨日订单数量"></el-table-column>
          <el-table-column align="center" prop="yesterdaySummaryAmount" label="昨日订单收入"></el-table-column>
          <el-table-column align="center" prop="weekSummaryCount" label="上周订单数量"></el-table-column>
          <el-table-column align="center" prop="weekSummaryAmount" label="上周订单收入"></el-table-column>
          <el-table-column align="center" prop="monthSummaryCount" label="上月订单数量"></el-table-column>
          <el-table-column align="center" prop="monthSummaryAmount" label="上月订单收入"></el-table-column>
          <el-table-column align="center" prop="historyCount" label="历史订单数量"></el-table-column>
          <el-table-column align="center" prop="historyAmount" label="历史订单收入"></el-table-column>
        </el-table>
      </el-row>

      <h3 class="subtitle">会员注册信息统计</h3>
      <el-row class="prl-20">
        <el-row :gutter="20">
          <StatisticsBox title="昨日注册会员数（首次使用）" subtitle="较上日" :value="smm.yesterdayUserCount" :subvalue="smm.comparePreDayUserCount"/>
          <StatisticsBox title="上周注册会员数（首次使用）" subtitle="较上周" :value="smm.weekUserCount" :subvalue="smm.comparePreWeekUserCount"/>
          <StatisticsBox title="上月注册会员数（首次使用）" subtitle="较上月" :value="smm.monthUserCount" :subvalue="smm.comparePreMonthUserCount"/>
          <StatisticsBox title="历史累计注册会员数（首次使用）" :value="smm.historyUserCount"/>

          <StatisticsBox title="昨日律师注册数" subtitle="较上日" :value="smm.yesterdayLawyerCount" :subvalue="smm.comparePreDayLawyerCount"/>
          <StatisticsBox title="上周律师注册数" subtitle="较上周" :value="smm.weekLawyerCount" :subvalue="smm.comparePreWeekLawyerCount"/>
          <StatisticsBox title="上月律师注册数" subtitle="较上月" :value="smm.monthLawyerCount" :subvalue="smm.comparePreMonthLawyerCount"/>
          <StatisticsBox title="历史累计律师注册数" :value="smm.historyLawyerCount"/>
        </el-row>
      </el-row>
    </el-card>
    <el-card class="table-card mt-10">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">代办数据统计</span>
        </el-row>
      </el-row>
      <el-row class="pa-20">
        <el-row :gutter="20">
          <StatisticsBox title="律师注册信息待审核" :value="smn.needApproveCount"/>
          <StatisticsBox title="申诉信息" :value="smn.needDealAppealCount"/>
          <StatisticsBox title="提现待审核" :value="smn.needCashOutApproveCount"/>
        </el-row>
      </el-row>
    </el-card>
    <el-card class="table-card mt-10">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">系统信息</span>
        </el-row>
      </el-row>
      <el-row class="pa-20">
        <p class="cl-999">系统名称：虎甲律师平台</p>
        <p class="cl-999">系统版本： 1.0Beta</p>
      </el-row>
    </el-card>
  </el-row>
</template>

<script>
  import { mapActions } from 'vuex'
  import { Table, TableColumn } from 'element-ui'
  import AppTable from '@/mixins/table'
  import StatisticsBox from './StatisticsBox'
  export default {
    components: {
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      StatisticsBox
    },
    mixins: [AppTable],
    data() {
      return {
        smb: {},
        smo: {},
        smm: {},
        smn: {},
        smoc: {},
        tableData: []
      }
    },
    methods: {
      // 初始化页面
      async initPage() {
        this.getSmmaryBusiness()
        this.getSummaryOrder()
        this.getaSummaryMember()
        this.getaSummaryNeedToDeal()
        this.getSummaryOrderCategory()
      },
      // 交易数据统计
      async getSmmaryBusiness() {
        const res = await this.summaryBusiness()
        this.smb = res.data || {}
      },
      // 订单信息显示 - 汇总
      async getSummaryOrder() {
        const res = await this.summaryOrder()
        this.smo = res.data || {}
      },
      // 会员注册信息统计
      async getaSummaryMember() {
        const res = await this.summaryMember()
        this.smm = res.data || {}
      },
      // 待办数据统计
      async getaSummaryNeedToDeal() {
        const res = await this.summaryNeedToDeal()
        this.smn = res.data || {}
      },
      // 订单信息显示 - 订单类型维度列表
      async getSummaryOrderCategory() {
        const res = await this.summaryOrderByOrderTypeAndOrderCategory()
        const items = res.data || []
        items.forEach(v => {
          v.orderType = this.$t('rs.orderType')[v.orderType] || v.orderType
          v.orderCategory = this.$t('rs.orderCategory')[v.orderCategory] || v.orderCategory
        });
        this.tableData = items
      },
      ...mapActions('count', [
        'summaryBusiness',
        'summaryOrder',
        'summaryMember',
        'summaryNeedToDeal',
        'summaryOrderByOrderTypeAndOrderCategory'
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

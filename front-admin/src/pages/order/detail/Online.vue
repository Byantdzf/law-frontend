<template>
  <div>
    <el-card>
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">发布人信息</span>
        </el-row>
      </el-row>
      <PublishInfo :row="row" type="1"/>
    </el-card>
    <el-card class="mt-10">
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">订单信息</span>
        </el-row>
      </el-row>
      <BaseInfo1 :row="row" />
    </el-card>
    <el-card class="mt-10" v-if="showMoreInfo">
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">支付流水信息</span>
        </el-row>
      </el-row>
      <PaymentFlowInfo :row="row" />
    </el-card>
    <el-card class="mt-10" v-if="showMoreInfo && $val(row, 'orderStatus') != '20'">
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">接单律师信息</span>
        </el-row>
      </el-row>
      <LawyerInfo :row="row" />
    </el-card>
    <el-card class="mt-10" v-if="showMoreInfo && $val(row, 'msgList', []).length">
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">回复详情</span>
        </el-row>
      </el-row>
      <MsgList :row="row" />
    </el-card>
    <el-card class="mt-10" v-if="$val(row, 'orderStatus') == '60'">
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">对律师评价</span>
        </el-row>
      </el-row>
      <CommentInfo :row="row" />
    </el-card>
    <el-card class="mt-10" v-if="$val(row, 'userOperateRecord.id')">
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">用户申诉信息</span>
        </el-row>
      </el-row>
      <AppealInfo :row="row" />
    </el-card>
  </div>
</template>

<script>
import PublishInfo from './common/PublishInfo'
import BaseInfo1 from './common/BaseInfo1'
import PaymentFlowInfo from './common/PaymentFlowInfo'
import LawyerInfo from './common/LawyerInfo'
import CommentInfo from './common/CommentInfo'
import AppealInfo from './common/AppealInfo'
import MsgList from './common/MsgList'

export default {
  components: {
    PublishInfo,
    BaseInfo1,
    PaymentFlowInfo,
    LawyerInfo,
    CommentInfo,
    AppealInfo,
    MsgList,
  },
  mixins: [],
  props: {
    row: Object
  },
  computed: {
    showMoreInfo() {
      return ![5, 10, 70].includes(+this.$val(this.row, 'orderStatus'))
    }
  },
  methods: {
    
  },
  mounted() {
    
  }
}
</script>

<style lang="less">
  
</style>
<template>
  <el-row>
    <el-card class="table-card">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">平台收入列表</span>
        </el-row>
      </el-row>

      <h3 class="subtitle">交易数据统计</h3>
      <el-row class="prl-20">
        <el-row :gutter="20">
          <el-col class="statistics-box" :span="6">
            <div class="con">
              <p>昨日总收入（元）</p>
              <p class="num">4713.5</p>
              <p>
                <span>较上日</span>
                <i class="el-icon-top"></i>
                <span>5</span>
              </p>
            </div>
          </el-col>
          <el-col class="statistics-box" :span="6">
            <div class="con">
              <p>上周总收入（元）</p>
              <p class="num">4713.5</p>
              <p>
                <span>较上周</span>
                <i class="el-icon-top"></i>
                <span>5</span>
              </p>
            </div>
          </el-col>
          <el-col class="statistics-box" :span="6">
            <div class="con">
              <p>上月总收入（元）</p>
              <p class="num">4713.5</p>
              <p>
                <span>较上月</span>
                <i class="el-icon-top"></i>
                <span>5</span>
              </p>
            </div>
          </el-col>
          <el-col class="statistics-box" :span="6">
            <div class="con">
              <p>历史总收入</p>
              <p class="num">4713.5</p>
            </div>
          </el-col>
          <el-col class="statistics-box" :span="6">
            <div class="con">
              <p>昨日总利润（元）</p>
              <p class="num">4713.5</p>
              <p>
                <span>较上日</span>
                <i class="el-icon-top"></i>
                <span>5</span>
              </p>
            </div>
          </el-col>
          <el-col class="statistics-box" :span="6">
            <div class="con">
              <p>上周总利润（元）</p>
              <p class="num">4713.5</p>
              <p>
                <span>较上周</span>
                <i class="el-icon-top"></i>
                <span>5</span>
              </p>
            </div>
          </el-col>
          <el-col class="statistics-box" :span="6">
            <div class="con">
              <p>上月总利润（元）</p>
              <p class="num">4713.5</p>
              <p>
                <span>较上月</span>
                <i class="el-icon-top"></i>
                <span>5</span>
              </p>
            </div>
          </el-col>
          <el-col class="statistics-box" :span="6">
            <div class="con">
              <p>历史总利润</p>
              <p class="num">4713.5</p>
            </div>
          </el-col>
        </el-row>
      </el-row>

    </el-card>
  </el-row>
</template>

<script>
  import { mapActions } from 'vuex'
  import { TableColumn } from 'element-ui'
  import AppTable from '@/mixins/table'
  export default {
    components: {
      [TableColumn.name]: TableColumn
    },
    mixins: [AppTable],
    data() {
      return {

      }
    },
    methods: {
      // 初始化页面
      initPage() {

      },
      ...mapActions('tenant', [
        'tenantView',
        'tenantDivideHq',
        'tenantGetKV'
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

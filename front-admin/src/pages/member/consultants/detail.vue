
<template>
  <el-row class="tenant-detail">
    <el-row class="el-table el-table--small el-table--border baseInfo-table">
      <table cellspacing="0" cellpadding="0" border="0" class="el-table__body">
        <tbody>
        <tr class="el-table__row">
          <td class="tenant-detail-tl" rowspan="4">
            <el-row class="logo-box">
              <img :src="info.avatarUrl" alt="logo" />
            </el-row>
            <el-row class="actions ta-c pt-10">
              <el-tag type="success" v-if="info.status == 1">{{ $t('rs.status')[info.status] }}</el-tag>
              <el-tag type="info" v-else>{{ $t('rs.status')[info.status] }}</el-tag>
            </el-row>
          </td>
          <td class="label">
            <div class="cell">微信昵称</div>
          </td>
          <td>
            <div class="cell">{{ info.name }}</div>
          </td>
          <td class="label">
            <div class="cell">用户ID</div>
          </td>
          <td>
            <div class="cell">{{ info.id }}</div>
          </td>
        </tr>
        <tr class="el-table__row">
          <td class="label">
            <div class="cell">微信号</div>
          </td>
          <td>
            <div class="cell">{{ info.account }}</div>
          </td>
          <td class="label">
            <div class="cell">手机号</div>
          </td>
          <td>
            <div class="cell">{{ info.phone }}</div>
          </td>
        </tr>
        <tr class="el-table__row">
          <td class="label">
            <div class="cell">下单次数</div>
          </td>
          <td>
            <div class="cell">{{ info.orderCount }}</div>
          </td>
          <td class="label">
            <div class="cell">平台消费金额</div>
          </td>
          <td>
            <div class="cell">{{ info.amount }}</div>
          </td>
        </tr>
        <tr class="el-table__row">
          <td class="label">
            <div class="cell">最近登录时间</div>
          </td>
          <td>
            <div class="cell">{{ info.createTime }}</div>
          </td>
          <td class="label">
            <div class="cell">登陆总次数</div>
          </td>
          <td>
            <div class="cell">{{ info.loginCount }}</div>
          </td>
        </tr>
        </tbody>
      </table>
    </el-row>
    <h3 class="title pt-20 pb-20">优惠券信息</h3>
    <el-table
      :data="couponList"
      border
      style="width: 100%">
      <el-table-column
        prop="couponName"
        label="优惠券名称">
      </el-table-column>
      <el-table-column
        prop="useStatus"
        label="状态"
        width="100">
        <template slot-scope="scope">
          <span>{{ $t('rs.useStatus')[scope.row.useStatus] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="rangeStartTime"
        label="优惠券有效期">
        <template slot-scope="scope">
          <span>{{ scope.row.rangeStartTime }}</span>
          <span> - </span>
          <span>{{ scope.row.rangeEndTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="fetchDate"
        label="领取时间">
      </el-table-column>
      <el-table-column
        prop="useDate"
        label="使用时间">
      </el-table-column>
    </el-table>
  </el-row>
</template>

<script>
import { Table, TableColumn } from 'element-ui'
export default {
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  props: {
    row: Object
  },
  data() {
    return {

    }
  },
  computed: {
    item() {
      return this.row || {}
    },
    info() {
      return this.$val(this.item, 'userInfo', {})
    },
    couponList() {
      return this.$val(this.item, 'couponList', [])
    }
  }
}

</script>

<style lang="less">
.tenant-detail {
  .el-table__body {
    width: 100%;
  }
  .tenant-detail-tl {
    width: 180px;
  }
  .label {
    width: 140px;
    text-align: center;
  }
  .cell {
    padding: 0 10px !important;
  }
  .logo-box {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    margin: 0 auto;
    img {
      width: 100%;
      border-radius: 4px;
    }
  }
  .baseInfo-table {
    .label {
      width: 100px;
    }
  }
}
</style>

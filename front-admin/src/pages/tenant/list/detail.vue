
<template>
  <el-row class="tenant-detail">
    <el-row class="el-table el-table--small el-table--border baseInfo-table">
      <table cellspacing="0" cellpadding="0" border="0" class="el-table__body">
        <tbody>
        <tr class="el-table__row">
          <td class="tenant-detail-tl" rowspan="5">
            <el-row class="logo-box">
              <img src="/img/default.jpg" alt="logo" />
            </el-row>
            <p class="ta-c pt-10">{{ item.tenantAccount }}</p>
            <el-row class="actions ta-c pt-10">
              <el-tag type="info" effect="dark">{{ item.tenantLevel }}</el-tag>
            </el-row>
          </td>
          <td class="label">
            <div class="cell">商户名称</div>
          </td>
          <td>
            <div class="cell">{{ item.tenantName }}</div>
          </td>
          <td class="label">
            <div class="cell">商户ID</div>
          </td>
          <td>
            <div class="cell">{{ item.tenantNo }}</div>
          </td>
        </tr>
        <tr class="el-table__row">
          <td class="label">
            <div class="cell">商户类别</div>
          </td>
          <td>
            <div class="cell">{{ item.tenantTypeName }}</div>
          </td>
          <td class="label">
            <div class="cell">对应销售</div>
          </td>
          <td>
            <div class="cell">{{ item.sellName || '待分配' }}</div>
          </td>
        </tr>
        <tr class="el-table__row">
          <td class="label">
            <div class="cell">注册时间</div>
          </td>
          <td>
            <div class="cell">{{ item.createTime }}</div>
          </td>
          <td class="label">
            <div class="cell">所在城市</div>
          </td>
          <td>
            <div class="cell">{{ info.countryName + '/' + info.cityName }}</div>
          </td>
        </tr>
        <tr class="el-table__row">
          <td class="label">
            <div class="cell">联系人</div>
          </td>
          <td>
            <div class="cell">{{ info.contactName }}</div>
          </td>
          <td class="label">
            <div class="cell">联系电话</div>
          </td>
          <td>
            <div class="cell">{{ info.contactPhone }}</div>
          </td>
        </tr>
        <tr class="el-table__row">
          <td class="label">
            <div class="cell">详细地址</div>
          </td>
          <td>
            <div class="cell">{{ info.address }}</div>
          </td>
          <td class="label">
            <div class="cell">邮箱</div>
          </td>
          <td>
            <div class="cell">{{ info.contactEmail }}</div>
          </td>
        </tr>
        </tbody>
      </table>
    </el-row>
    <h3 class="title pt-20 pb-20">财务资质</h3>
    <el-row class="el-table el-table--small el-table--border">
      <table cellspacing="0" cellpadding="0" border="0" class="el-table__body">
        <tbody>
          <tr class="el-table__row" v-for="(v, k) in idFields" :key="k">
            <td class="label">
              <div class="cell">{{ v }}</div>
            </td>
            <td>
              <div class="cell" v-if="k !== 'qualificationFile'">{{ identification[k] }}</div>
              <div class="cell" v-else>
                <el-image
                  v-for="(item, idx) in qualificationFiles"
                  :key="idx"
                  :src="`${item}?x-oss-process=image/resize,m_fill,w_66,h_66`"
                  :preview-src-list="qualificationFiles"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </el-row>
  </el-row>
</template>

<script>
export default {
  props: {
    row: Object
  },
  data() {
    return {
      idFields: {
        bankAccountName: '银行账户名',
        bankOpenBranch: '开户银行',
        bankAccountNo: '银行账号',
        contactName: '财务联系人',
        contactPhone: '联系电话',
        societyCode: '统一社会信用代码',
        qualificationFile: '资质文件'
      }
    }
  },
  computed: {
    item() {
      return this.row || {}
    },
    info() {
      return this.$val(this.item, 'info', {})
    },
    identification() {
      return this.$val(this.item, 'identification', {})
    },
    qualificationFiles() {
      let str = this.identification.qualificationFile || ''
      return str.split(',').filter(v => !!v)
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
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin: 0 auto;
    img {
      width: 100%;
      border-radius: 50%;
    }
  }
  .baseInfo-table {
    .label {
      width: 100px;
    }
  }
}
</style>

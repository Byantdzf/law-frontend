
<template>
  <el-row class="tenant-detail">
    <el-row class="el-table el-table--small el-table--border baseInfo-table">
      <table cellspacing="0" cellpadding="0" border="0" class="el-table__body">
        <tbody>
        <tr class="el-table__row">
          <td class="tenant-detail-tl" rowspan="4">
            <el-row class="logo-box">
              <img :src="info.pic" alt="头像" />
            </el-row>
            <el-row class="actions ta-c pt-10">
              <el-tag type="success" v-if="info.status == 1">{{ $t('rs.status')[info.status] }}</el-tag>
              <el-tag type="info" v-else>{{ $t('rs.status')[info.status] }}</el-tag>
            </el-row>
          </td>
          <td class="label">
            <div class="cell">姓名</div>
          </td>
          <td>
            <div class="cell">{{ info.name }}</div>
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
            <div class="cell">身份证号</div>
          </td>
          <td>
            <div class="cell">{{ info.identityCard }}</div>
          </td>
          <td class="label">
            <div class="cell">执业证号</div>
          </td>
          <td>
            <div class="cell">{{ info.lawyerLicenseNo }}</div>
          </td>
        </tr>
        <tr class="el-table__row">
          <td class="label">
            <div class="cell">执业律所</div>
          </td>
          <td>
            <div class="cell">{{ info.belongs }}</div>
          </td>
          <td class="label">
            <div class="cell">所在地区</div>
          </td>
          <td>
            <div class="cell">{{ info.province }} - {{ info.city }}</div>
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
    <h3 class="title pt-20 pb-20">其他信息</h3>
    <el-row class="el-table el-table--small el-table--border">
      <table cellspacing="0" cellpadding="0" border="0" class="el-table__body">
        <tbody>
          <tr class="el-table__row">
            <td class="label">
              <div class="cell">擅长领域</div>
            </td>
            <td>
              <div class="cell">
                {{ info.goodAt }}
              </div>
            </td>
          </tr>
          <tr class="el-table__row">
            <td class="label">
              <div class="cell">个人简介</div>
            </td>
            <td>
              <div class="cell">
                {{ info.brief }}
              </div>
            </td>
          </tr>
          <tr class="el-table__row">
            <td class="label">
              <div class="cell">证件照片</div>
            </td>
            <td>
              <div class="cell">
                <el-image
                  v-for="(item, idx) in documentFile"
                  :key="idx"
                  :src="`${item}`"
                  :preview-src-list="documentFile"
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
    <el-row class="btns pt-20 pb-20" v-if="showBtns">
      <el-button type="primary" @click="handleAction(2)">审核通过</el-button>
      <el-button type="danger" @click="handleAction(1)">审核不通过</el-button>
    </el-row>
    <app-dialog
      title="请输入审核不通过原因"
      width="400px"
      :height="dialogHeight"
      :visible="dialogVisible"
      @close="closeDialog"
    >
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入原因，系统将会反馈该原因到律师注册手机短信上"
        v-model="auditReason">
      </el-input>
      <el-row class="ta-c pt-20">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </el-row>
    </app-dialog>
  </el-row>
</template>

<script>
import { mapActions } from 'vuex'
import AppDialog from '@/mixins/dialog'
export default {
  components: {
    
  },
  mixins: [AppDialog],
  props: {
    row: Object,
    showBtns: Boolean
  },
  data() {
    return {
      auditReason: ''
    }
  },
  computed: {
    item() {
      return this.row || {}
    },
    info() {
      return this.$val(this.item, 'lawyerInfo', {})
    },
    documentFile() {
      return this.$val(this.item, 'documentFile', [])
    }
  },
  methods: {
    async handleAction(auditStatus) {
      try {
        let id = this.info.id
        if (auditStatus === 2) {
          await this.$confirm('确认要审核通过？', '温馨提示', { type: 'warning' })
          await this.lawyerAudit({ id, auditStatus })
          this.$msgSuccess('操作成功！')
          this.$emit('submit')
        } else {
          this.dialogVisible = true
        }
      } catch (error) {
        
      }
    },
    async handleConfirm() {
      try {
        let id = this.info.id
        let auditReason = this.auditReason
        let auditStatus = 1
        await this.lawyerAudit({ id, auditStatus, auditReason })
        this.dialogVisible = false
        this.$msgSuccess('操作成功！')
        this.$emit('submit')
      } catch (error) {
        
      }
    },
    ...mapActions('member', [
      'lawyerAudit',
    ])
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
  .btns {
    text-align: center;
  }
}
</style>

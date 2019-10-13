
<template>
  <el-row class="tenant-store-detail">
    <el-form label-width="100px">
      <el-form-item label="商户账号：">
        <span>{{ $val(row, 'tenantAccount') }}</span>
      </el-form-item>
      <el-form-item label="联系人姓名：">
        <span>{{ $val(row, 'contactName') }}</span>
      </el-form-item>
      <el-form-item label="联系人电话：">
        <span>{{ $val(row, 'contactPhone') }}</span>
      </el-form-item>
      <el-form-item label="E-mail：">
        <span>{{ $val(row, 'contactEmail') }}</span>
      </el-form-item>
      <el-form-item label="门店名称：">
        <span>{{ $val(row, 'tenantName') }}</span>
      </el-form-item>
      <el-form-item label="营业执照号：">
        <span>{{ $val(row, 'licenseNo') }}</span>
      </el-form-item>
      <el-form-item label="电子证件：">
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
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>
export default {
  props: {
    row: Object
  },
  data() {
    return {
      
    }
  },
  computed: {
    qualificationFiles() {
      let str = this.$val(this.row, 'identification.qualificationFile')
      return str.split(',').filter(v => !!v)
    }
  }
}

</script>

<style lang="less">
.tenant-store-detail {
  padding: 0 30px 30px;
}
</style>

<template>
  <el-row class="baseInfo-box">
    <el-row>
      <span class="label cl-999">律师姓名：</span>
      <span class="con">
        {{ $val(row, 'lawyerDto.name') }}
        <span class="pl-10 cl-red">{{ $val(row, 'lawyerDto.score') }}分</span>
      </span>
    </el-row>
    <el-row>
      <span class="label cl-999">律师头像：</span>
      <span class="con">{{ $val(row, 'lawyerDto.pic') }}</span>
      <span class="con">
        <el-image 
          style="width: 70px; height: 70px; border-radius: 4px;"
          :src="$val(row, 'lawyerDto.pic')" 
          :preview-src-list="[$val(row, 'lawyerDto.pic')]">
        </el-image>
      </span>
    </el-row>
    <el-row>
      <span class="label cl-999">律师ID：</span>
      <span class="con">{{ $val(row, 'lawyerDto.id') }}</span>
    </el-row>
    <el-row>
      <span class="label cl-999">接单时间：</span>
      <span class="con">{{ $val(row, 'acceptTime') }}</span>
    </el-row>
    <template v-if="$val(row, 'msgList', []).length">
      <span class="label cl-999">回复详情：</span>
      <div class="con">
        <p v-for="(item, index) in $val(row, 'msgList', [])" :key="index">
          <span v-if="item.msgType == 1">{{ item.content || '' }}</span>
          <span v-else-if="item.msgType == 2">
            <span class="el-icon-microphone cl-primary"></span>
            <span>{{ item.recordTime ? item.recordTime + '秒，' : '' }}点击收听</span>
          </span>
          <span v-else-if="item.msgType == 4">
            <span class="el-icon-document cl-primary"></span>
            <span>{{ item.fileName || '' }}</span>
          </span>
        </p>
      </div>
    </template>
  </el-row>
</template>

<script>
export default {
  props: {
    row: Object
  },
  computed: {
    orderStatus() {
      const stauts = this.$val(this.row, 'orderStatus')
      return this.$t('rs.orderStatus')[stauts]
    }
  }
}
</script>
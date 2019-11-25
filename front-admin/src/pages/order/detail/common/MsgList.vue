<template>
  <el-row class="baseInfo-box">
    <template v-if="$val(row, 'msgList', []).length">
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
    </template>
  </el-row>
</template>

<script>
export default {
  props: {
    row: Object
  },
}
</script>
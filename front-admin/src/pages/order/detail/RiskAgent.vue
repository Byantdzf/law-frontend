<template>
  <div>
    <el-card>
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">发布人信息</span>
        </el-row>
      </el-row>
      <PublishInfo :row="row"/>
    </el-card>
    <el-card class="mt-10">
      <el-row slot="header">
        <el-row class="fl">
          <span class="title">订单信息</span>
        </el-row>
      </el-row>
      <BaseInfo3 :row="row" />
    </el-card>
  </div>
</template>

<script>
import PublishInfo from './common/PublishInfo'
import BaseInfo3 from './common/BaseInfo3'

export default {
  components: {
    PublishInfo,
    BaseInfo3,
  },
  props: {
    row: Object
  },
}
</script>
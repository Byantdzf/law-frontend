<template>
  <div class="page-notFound">
    <img src="@/assets/images/img_404.png" />
    <p class="mt-40 cl-999">Error，页面出错啦！！   请点击返回首页或者刷新页面~</p>
    <div class="btn-box mt-40">
      <el-button type="primary" round plain @click="goHome">返回首页</el-button>
      <el-button type="primary" round>刷新页面</el-button>
    </div>
  </div>
</template>

<script>
import SYSTEM from '@/utils/system'
export default {
  methods: {
    goHome() {
      this.$router.push({ path: SYSTEM.routeHomePath })
    }
  }
}
</script>

<style lang="less">
  .page-notFound {
    padding-top: 60px;
    text-align: center;
    img {
      margin: 0 auto;
    }
    .btn-box {
      .el-button+.el-button {
        margin-left: 40px;
      }
    }
  }
</style>
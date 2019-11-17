<template>
  <div class="score-box">
    <p>
      <span>专业态度：</span>
      <AppScore :value="$val(row, 'professionalAttitudeScore')" readonly/>
    </p>
    <p>
      <span>服务态度：</span>
      <AppScore :value="$val(row, 'serviceAttitudeScore')" readonly/>
    </p>
  </div>
</template>

<script>
  import AppScore from '@/components/app-score'
  export default {
    inheritAttrs: false,
    components: {
      AppScore
    },
    props: {
      row: Object
    },
    mounted() {
      console.log(this.row)
    }
  }
</script>

<style lang="less">
  .score-box {
    .app-score .iconfont {
      font-size: 15px;
    }
  }
</style>
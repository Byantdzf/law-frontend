<template>
  <el-col class="statistics-box" :span="span">
    <div class="con">
      <p>{{ title }}</p>
      <p class="num">{{ value || 0 }}</p>
      <template v-if="subvalue || subvalue === 0">
        <p class="fontRed" v-if="subvalue > 0">
          <span>{{ subtitle }}</span>
          <i class="el-icon-top"></i>
          <span>{{ subvalue }}</span>
        </p>
        <p class="fontGreen" v-else>
          <span>{{ subtitle }}</span>
          <i class="el-icon-bottom"></i>
          <span>{{ -subvalue }}</span>
        </p>
      </template>
    </div>
  </el-col>
</template>

<script>
export default {
  props: {
    title: String,
    subtitle: String,
    value: [String, Number],
    subvalue: [String, Number],
    span: {
      type: Number,
      default: 6
    }
  }
}
</script>
<template>
  <span class="app-score">
    <i 
      v-for="item in 5"
      :key="item"
      :class="['iconfont icon-star', { 'light': item <= value }]"
      @click="handlerClick(item)"
    >
    </i>
  </span>
</template>

<script>
export default {
	name: 'app-score', 
  props: {
    row: Object,
    col: Object,
    readonly: Boolean,
    index: [String, Number],
    field: [String, Number],
    value: [String, Number]
  },
  data() {
    return {
      score: this.value || 0
    }
  },
  watch: {
    value: function (newval) {
      this.score = newval
    }
  },
  methods: {
    handlerClick(item) {
      if(this.readonly) return
      this.score = item
      this.$emit('change', {
        value: item,
        row: this.row,
        col: this.col,
        field: this.field,
        index: this.index
      })
    }
  }
}
</script>
<style lang="less">
.app-score {
	.iconfont {
		font-size: 20px;
		color: #ccc;
		&.light {
			color: #e6a23c;
		}
		& + .iconfont {
			margin-left: 5px;
		}
	}
}
</style>

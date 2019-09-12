<template>
	<div class="app-lazy-load">
		<slot v-if="show"></slot>
		<slot name="tip" v-if="!show">
			<div :class="[maskClass || 'lazy-load-mask']" v-html="tips"></div>
		</slot>
	</div>
</template>

<script type="text/babel">
  export default {
    name: 'app-lazy-load',
    data() {
      return {
        count: 0,
        // 是否渲染组件
        show: true
      };
    },

    props: {
      // 需要在组件内渲染的数据
      data: Array,
      // 遮罩层样式
      maskClass: String,
      // 等待渲染提示语
      tips: {
        type: String,
        default: '正在渲染，请稍候'
      },
      // 延迟渲染的时间
      time: {
        type: Number,
        default: 30
      },
      // 超过多少条数据开启延迟渲染
      limit: {
        type: Number,
        default: 15
      },
      // 是否跟踪data的变化来渲染列表
      trackByData: {
        type: Boolean,
        default: true
      },
      once: {
        type: Boolean,
        default: true
      },
      immediately: Boolean // 是否立即重新渲染
    },

    created() {
      this.showLazy()
    },

    watch: {
      data() {
        // 数据变化时重新渲染
        if (this.trackByData) {
          this.showLazy();
        }
      },
      // 路由变化,重新渲染
      $route() {
        if (!this.trackByData) {
          this.showLazy()
        }
      },
      // 立即重新变为true时,重新渲染
      immediately() {
        if (this.immediately) {
          this.showLazy()
        }
      }
    },

    methods: {
      // 延迟渲染数据,在数据渲染完成后触发loaded事件
      showLazy() {
        if (this.once && this.count > 0) return
        if ((this.data && this.data.length > this.limit) || !this.data) {
          // 如果数据存在并且数据的数量比限定的数量大,则开启延迟渲染 如果不是列表调用组件,也开启延迟渲染
          this.syncLoader()
        } else {
          // 其他情况,不开启延迟渲染
          this.show = true
          this.$emit("loaded")
        }
      },
      // 延迟渲染
      syncLoader() {
        this.show = false
        this.count ++ 
        setTimeout(() => {
          this.show = true
          this.$emit("loaded")
        }, this.time)
      }
    }
  }
</script>

<style scoped>
  .app-lazy-load {
    position: relative;
    width: 100%;
  }
  .lazy-load-mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    text-align: center;
    color: #2c5089;
    font-size: 14px;
    line-height: 24px;
  }
</style>
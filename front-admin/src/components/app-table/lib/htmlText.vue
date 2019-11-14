<template>
  <div v-html="htmlContent()" @click="$emit('click', { row, col })"></div>
</template>

<script>
export default {
  name: 'app-html-text',
  inheritAttrs: false,
  props: ['row', 'col', 'html'],
  methods: {
    htmlContent() {
      let str = this.html
      if (typeof this.html === 'function') {
        str = this.html(this.row, this.col)
      }
      return str
    }
  }
}
</script>
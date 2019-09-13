<template>
  <div v-html="html" @click="$emit('click', { row, col })"></div>
</template>

<script>
export default {
  name: 'app-html-text',
  inheritAttrs: false,
  props: ['row', 'col', 'html']
}
</script>
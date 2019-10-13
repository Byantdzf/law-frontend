<template>
	<div v-html="value"></div>
</template>

<script>
	export default {
    name: 'form-text',
		props: {
      value: [String, Number]
		}
	}
</script>
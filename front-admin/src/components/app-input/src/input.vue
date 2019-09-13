
<template>
  <el-input
    :id="elnid"
    v-model="defaultValue" 
    v-bind="bindProps"
    :disabled="disabled"
    @blur="handleBlur"
    @focus="handleFocus"
    @input="handleInput"
    ref="appInput"
  >
    <template slot="prepend" v-if="prepend">
      <app-select 
        v-if="isSelectSlot(prepend)"
        v-model="prependValue"
        v-bind="getSlotBindProps(prepend)"
        @change="handlePrependSelect"/>
      <span v-else>{{ prependValue }}</span>
    </template>
    <template slot="append" v-if="append">
      <app-select 
        v-if="isSelectSlot(append)"
        v-model="appendValue"
        v-bind="getSlotBindProps(append)"
        @change="handleAppendSelect"/>
      <span v-else>{{ appendValue }}</span>
    </template>
  </el-input>
</template>

<script>
  import Base from './base.js'
	export default {
    mixins: [Base],
    computed: {
      blurPayload() {
        return {
          value: this.defaultValue,
          field: this.field,
          row: this.row,
          col: this.col
        }
      },
      changePayload() {
        return {
          row: this.row,
          col: this.col
        }
      }
    },
	}
</script>

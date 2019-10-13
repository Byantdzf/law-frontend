
<template>
  <el-row class="dest-transfer-box">
    <el-transfer
      filterable
      :titles="titles"
      :filter-method="filterMethod"
      filter-placeholder="请输入目的地"
      v-model="checkeds"
      :data="dests"
    >
    </el-transfer>
    <el-row class="btn-box pt-30 ta-c">
      <el-button type="primary" @click="formSubmit">确定</el-button>
    </el-row>
  </el-row>
</template>

<script>
import { mapActions } from 'vuex'
import { Transfer } from 'element-ui'
export default {
  components: {
    [Transfer.name]: Transfer
  },
  mixins: [],
  props: {
    value: [Array, String, Number],
    items: Array
  },
  data() {
    return {
      titles: ['目的地', '已选'],
      dests: [],
      checkeds: []
    }
  },
  watch: {
    value(nval) {
      this.initForm(nval || [])
    }
  },
  methods: {
    initForm(checkeds) {
      this.checkeds = checkeds
      if (this.items.length) {
        this.dests = this.items
      } else {
        this.destKV().then(res => {
          this.dests = (res.data || []).map(v => {
            v.label = v.name
            v.key = v.id
            return v
          })
        })
      }
    },
    filterMethod(query, item) {
      return ~item.label.indexOf(query)
    },
    // 表单提交
    formSubmit() {
      let params = this.dests.filter(v => this.checkeds.includes(v.key))

      this.$emit("submit", params)
    },
    ...mapActions('data', [
      'destKV'
    ])
  },
  mounted() {
    this.initForm(this.value || [])
  }
}

</script>

<style lang="less">
  .dest-transfer-box {
    .el-transfer-panel__body {
      height: 340px;
    }
    .el-transfer-panel__list.is-filterable {
      height: 290px;
    }
  }
</style>

<template>
  <el-row class="dialog-detail">
    <el-form label-width="100px">
      <el-form-item label="派单方式">
        <el-radio-group v-model="rule" size="small">
          <el-radio
            v-for="(item, index) in rules"
            :key="index"
            :label="item.id"
            border>
            {{ item.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="说明" v-if="showTips">
        <span v-if="rule == 2">您选择了手动派单模式，需要您到订单列表中进行手动派单。</span>
        <span v-else>您选择了自动派单模式，系统会按照规则自动派单。</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="formSubmit">确认</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>
export default {
  props: {
    row: Object,
    showTips: Boolean
  },
  data() {
    let rules = []
    for(let k in this.$t('rs.orderRule')) {
      rules.push({
        id: +k,
        name: this.$t('rs.orderRule')[k]
      })
    }
    return {
      rule: +this.$val(this.row, 'rule', 1),
      rules
    }
  },
  methods: {
    // 表单提交
    formSubmit() {
      let params = {
        rule: this.rule,
        orderType: this.$val(this.row, 'orderType'),
        orderCategory: this.$val(this.row, 'orderCategory'),
        id: this.$val(this.row, 'id'),
      }
      this.$emit('submit', params)
    }
  }
}

</script>

<style lang="less">
  .dialog-detail {
    .title {
      font-size: 14px;
      margin-bottom: 10px;
    }
  }
</style>

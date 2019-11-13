
<template>
  <el-row class="dialog-content">
    <Detail :row="row" v-show="tab == 'detail'"/>
  </el-row>
</template>

<script>
import { mapActions } from 'vuex'
import AppForm from '@/mixins/form'
import AppDialog from '@/mixins/dialog'
import AppUpload from '@/components/app-upload'
export default {
  components: {
    Detail: () => import('./detail')
  },
  mixins: [AppForm, AppDialog],
  props: {
    row: Object,
    tab: {
      type: [String, Number],
      default: 1
    }
  },
  data() {
    return {
      list: [],
    }
  },
  computed: {
    id() {
      return this.row ? this.row.id : ''
    },
    info() {
      let o = {}

      if (this.row) {
        o = this.row.info || {}
      }

      return o
    }
  },
 watch: {
    row: {
      handler: function(newval) {
        this.initForm(newval)
      },
      deep: true
    }
  },
  methods: {
    initForm(form) {
      const row = Object.assign({}, form)

      
    },
    // 表单提交
    formSubmit(form) {
      let params = { ...form }

      this.id && (params.id = this.id)
      
      this.$emit('submit', params)
    },
    ...mapActions('member', [
      'memberView'
    ])
  },
  mounted() {
    const self = this
    this.initForm(this.row)
  }
}

</script>

<style lang="less">
.dialog-content {
  width: 800px;
  margin: 0 auto;
}
.form-item--dest {
  .el-select .el-input.is-disabled .el-input__inner {
    cursor: pointer;
  }
}
</style>

import AppForm from '@/components/app-form'
export default {
  components: {
    AppForm
  },
  data() {
    return {
      searchFormInit: {
        align: 'left',
        labelWidth: 'auto'
      },
      searchItems: [],
      searchBtns: [{
        label: '确认',
        code: 'confirm'
      }, {
        label: '重置',
        code: 'reset'
      }],
      // 列表查询参数
      tableParams: {}
    }
  },
  methods: {
    // 确认搜索
    confirmSearch(form) {
      this.tableParams = {
        ...this.tableParams,
        ...form
      }
    }
  }
}

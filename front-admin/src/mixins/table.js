import AppTable from '@/components/app-table'
import { getOffsetTopByBody } from '@/utils/tools'
export default {
  components: {
    AppTable
  },
  data() {
    return {
      tableMaxHieght: 600,
      // 列表选中
      tableSelected: []
    }
  },
  methods: {
    // 刷新列表
    refreshTable() {
      this.$refs.appTable && this.$refs.appTable.getList()
    },
    // 列表选择
    tableSelect(values) {
      this.tableSelected = values
    },
    // 无选中项
    noCheckItem(list = this.tableSelected) {
      return list.length == 0 ? true : false
    },
    // 只能选中一项
    onlyCheckOneItem(list = this.tableSelected) {
      return list.length == 1 ? false : true
    },
    getTableMaxHieght() {
      const table = document.querySelector('.app-table')
      const wh = window.innerHeight
      const ot = getOffsetTopByBody(table)

      this.tableMaxHieght = wh - ot - 70

      return this.tableMaxHieght
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.getTableMaxHieght()
      }, 300)
    })
  }
}

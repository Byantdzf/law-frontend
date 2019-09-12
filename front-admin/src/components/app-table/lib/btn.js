export default {
  name: 'app-table-btn',
  inheritAttrs: false,
  props: ['row', 'col', 'value', 'items'],
  render() {
    const isStrNum = v => typeof v === 'string' || typeof v === 'number'
    const isArray = o => Object.prototype.toString.call(o) === '[object Array]'
    const { formater, default: defaultVal } = this.col
    const formaterRes = typeof formater === 'function' ? formater(this.row, this.col) : ''
    const text = formaterRes || (this.value || this.value === 0 ? this.value : defaultVal) || ''
    const params = {
      row: this.row,
      col: this.col
    }
    let items = isArray(formaterRes) ? formaterRes : this.items || []

    items = items.map(v => {
      let item = {}
      if (isStrNum(v)) {
        item = {
          label: v
        }
      } else {
        item = v
      }
      return item
    })

    if (items.length) {
      return (
        <div class="app-table-btns">
          {
            items.map((item, index) =>
              <el-button
                type={ item.type || 'text' }
                nativeOn-click={ ($event) => this.$emit('click', { ...params, index }, $event) }
              >
                { item.label }
              </el-button>
            )
          }
        </div>
      )
    } else {
      return (
        <el-button
          type="text"
          nativeOn-click={ ($event) => this.$emit('click', params, $event) }
        >
          { text }
        </el-button>
      )
    }
  }
}
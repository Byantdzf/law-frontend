
export default {
  functional: true,
  props: ['row', 'col', 'column', 'type'],
  render(h, { props: { row, col }, _v: text }) {
    const { formater, default: defaultVal } = col
    const v = formater && formater(row, col) || (row[col.prop] || row[col.prop] === 0 ? row[col.prop] : defaultVal)
    // 解决 umd 打包 text 渲染不出来的问题，需要转成 Vnode
    return (text && (text(v).text == "undefined" || text(v).text == "null") ? "" : text(v)) || v
  }
}

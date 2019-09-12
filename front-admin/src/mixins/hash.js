import { isArray, isString, isPlainObject } from 'lodash-es'

export default {
  methods: {
    // 当前页面添加queryString ex: this.setLocationQuery({ k1: v1, k2: v2 }) or this.setLocationQuery(k1, v1)
    setLocationQuery() {
      let { query = {}, path } = this.$route
      try {
        if (isPlainObject(arguments[0])) {
          query = Object.assign({}, query, arguments[0])
        } else if (isString(arguments[0])) {
          query = Object.assign({}, query, {
            [arguments[0]]: arguments[1]
          })
        }
        this.$router.push({ path, query })
      } catch (e) {
        throw new Error(e)
      }
    },
    // 当前页面获取queryString ex: this.getLocationQuery('key') or this.getLocationQuery(['key1', 'key2'])
    getLocationQuery(opt) {
      let { query = {} } = this.$route
      try {
        if (isArray(opt) && opt.every(v => isString(v))) {
          return opt.map(v => {
            return query[v]
          })
        } else if (isString(opt)) {
          return query[opt]
        }
      } catch (e) {
        throw new Error(e)
      }
    },
    // 当前页面删除queryString  ex: this.removeLocationQuery('key') or this.removeLocationQuery(['key1', 'key2'])
    removeLocationQuery(opt) {
      let { query = {}, path } = this.$route
      try {
        if (isArray(opt) && opt.every(v => isString(v))) {
          opt.forEach(v => {
            delete query[v]
          })
        } else if (isString(opt)) {
          delete query[opt]
        }
      } catch (e) {
        throw new Error(e)
      }
      // replace: true 不加入历史记录
      // this.$router.push({ path, replace: true })
      // this.$router.push({ path, query, replace: true })
      this.$router.replace({ path, query })
    }
  }
}
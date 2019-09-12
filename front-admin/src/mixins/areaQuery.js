import { mapActions } from 'vuex'
export default {
  data() {
    return {
      nameKeys: ['countryName', 'provinceName', 'cityName'],
      keywords: {},
      fetchForm: {}
    }
  },
  methods: {
    buildBaseFetchItem(opt = {}) {
      let row = opt.row || {}
      return {
        label: opt.label,
        field: opt.field,
        placeholder: opt.placeholder || '模糊搜索',
        type: 1,
        value: row[opt.nameKey] ? {
          id: row[opt.idKey],
          name: row[opt.nameKey]
        } : '',
        autofill: true,
        nameFormater: ({ countryName, provinceName, cityName, regionName, streetName }) => {
          const keyword = this.keywords[opt.nameKey] || ''
          let names = [countryName, provinceName, cityName, regionName, streetName].filter(v => !!v).join(',')
          return names.replaceAll(keyword, `<span style="color: #f40;">${ keyword }</span>`)
        },
        fetchSuggestions: (value, cb) => {
          let name = value.trim()
          let params = {
            level: opt.level
          }

          this.keywords[opt.nameKey] = name

          if (!name) {
            cb([])
            return false
          } else {
            params.name = name
          }

          this.queryAreaBlurry(params).then(res => {
            cb(res.data || [])
          }).catch(() => {
            cb([])
          })
        }
      }
    },
    buildCountryItem(o, formName = 'appForm') {
      let opt = Object.assign({
        label: '国家：',
        field: 'countryId|id',
        idKey: 'countryId',
        nameKey: 'countryName',
        level: 0
      }, o)
      return {
        ...this.buildBaseFetchItem(opt),
        on: {
          change: () => {
            if (formName && this.$refs[formName]) {
              this.$refs[formName].updateFormItem('cityId|id', 'value', '')
            }
          }
        }
      }
    },
    buildCityItem(o, formName = 'appForm') {
      let opt = Object.assign({
        label: '城市：',
        field: 'cityId|id',
        idKey: 'cityId',
        nameKey: 'cityName',
        level: 2
      }, o)

      return {
        ...this.buildBaseFetchItem(opt),
        on: {
          change: ({ value }) => {
            if (formName && this.$refs[formName]) {
              this.$refs[formName].updateFormItem('countryId|id', 'value', {
                id: value.countryId,
                name: value.countryName,
              })
            }
          }
        }
      }
    },
    ...mapActions('data', [
      'queryAreaBlurry'
    ])
  }
}

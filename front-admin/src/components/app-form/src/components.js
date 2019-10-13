export default {
  components: {
    AppText: () => import('../lib/text'),
    AppButtons: () => import('../lib/btns'),
    AppInput: () => import('@/components/app-input'),
    AppSelect: () => import('@/components/app-select'),
    AppRadio: () => import('@/components/app-radio'),
    AppCheckbox: () => import('@/components/app-checkbox'),
    AppDate: () => import('@/components/app-date-picker'),
    AppTime: () => import('@/components/app-time')
  },
  data() {
    return {
      formComponentMaps: {
        AppText: ['txt'],
        AppButtons: ['buttons'],
        AppInput: ['text', 'password', 'textarea'],
        AppSelect: ['select'],
        AppRadio: ['radio'],
        AppCheckbox: ['checkbox'],
        AppDate: ['date', 'datetime', 'daterange', 'datetimerange'],
        AppTime: ['time']
      },
      // form表单类型映射
      formTypeMaps: {
        1: 'text',   // 普通输入框
        2: 'select', // 下拉选择
        3: 'radio',  // 单选
        4: 'checkbox', // 多选
        5: 'textarea',  // 文本域
        6: 'password',  // 密码输入框
        7: 'date',      // 日期  
        8: 'time',     //  时间
        9: 'datetime',  // 日期时间
        10: 'daterange', // 日期范围
        11: 'datetimerange', // 日期范围
      },
    }
  },
  methods: {
    // 表单item组件名
    getFormItemComponent({ type, component }) {
      let name = 'AppText'

      for (const key in this.formComponentMaps) {
        this.formComponentMaps[key].includes(type) && (name = key)
      }

      if (!component) {
        return name
      } else {
        return component
      }
    },
  }
}

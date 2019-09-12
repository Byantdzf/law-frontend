import Vue from 'vue'
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Input,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  Button,
  ButtonGroup,
  DatePicker,
  TimeSelect,
  TimePicker,
  Popover,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tag,
  Alert,
  Row,
  Col,
  Card,
  Link,
  Image,
  Backtop,
  Loading,
  MessageBox,
  Message
} from 'element-ui'

Vue.prototype.$ELEMENT = { size: 'small', zIndex: 900 }

Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Input)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Checkbox)
Vue.use(CheckboxButton)
Vue.use(CheckboxGroup)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(DatePicker)
Vue.use(TimeSelect)
Vue.use(TimePicker)
Vue.use(Popover)
Vue.use(Tooltip)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tag)
Vue.use(Alert)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Link)
Vue.use(Image)
Vue.use(Backtop)

Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message

Vue.prototype.$msgSuccess = function(message, duration = 1500) {
  Message({
    type: 'success',
    message,
    duration
  })
}

Vue.prototype.$msgError = function(message, duration = 1500) {
  Message({
    type: 'error',
    message,
    duration
  })
}
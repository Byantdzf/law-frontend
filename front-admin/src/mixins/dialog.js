import { isFunction } from 'lodash-es'
import AppDialog from '@/components/app-dialog'

export default {
  components: {
    AppDialog
  },
  data() {
    return {
      dialogTitle: '',
      dialogVisible: false,
      dialogIsFull: false,
      dialogComponent: '',
      dialogForm: null,
      dialogWidth: '800px',
      dialogHeight: 'auto'
    }
  },
  methods: {
    openDialog() {
      this.dialogVisible = true;
    },
    closeDialog(cb = this.dialogCloseCallback) {
      let dialogComponent = this.$refs.dialogComponent

      this.dialogVisible = false

      dialogComponent &&
      isFunction(dialogComponent.resetForm) && 
      dialogComponent.resetForm()

      isFunction(cb) && cb()
    }
  }
}


<template>
  <el-row class="dialog-content">
    <Detail :row="row" v-show="tab == 'detail'"/>
    <app-form
      v-show="tab == 'edit'"
      class="app-dialog-form"
      :init="formInit"
      :items="formItems"
      :btns="formBtns"
      :resave="formResave"
      @confirm="formSubmit"
      ref="appForm"
    />
    <app-dialog
      :width="dialogWidth"
      :height="dialogHeight"
      :title="dialogTitle"
      :visible="dialogVisible"
      @close="closeDialog"
    >
      <component
        v-if="dialogVisible"
        ref="dialogComponent"
        :is="dialogComponent"
        :value="destCheckeds"
        :items="dests"
        @submit="destinationSelect"
        @cancel="closeDialog"
      />
    </app-dialog>
  </el-row>
</template>

<script>
import { mapActions } from 'vuex'
import AppForm from '@/mixins/form'
import AppDialog from '@/mixins/dialog'
import AreaQuery from '@/mixins/areaQuery'
import AppUpload from '@/components/app-upload'
export default {
  components: {
    Detail: () => import('./detail'),
    Dest: () => import('@/pages/common/dest')
  },
  mixins: [AppForm, AppDialog, AreaQuery],
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
      dests: [],
      destCheckeds: []
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
    },
    identification() {
      let o = {}

      if (this.row) {
        o = this.row.identification || {}
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
      const tenantTypeMap = this.$t('rs.tenantType')
      let tenantTypeOptions = []

      this.$set(this.formInit, 'labelWidth', '125px')

      for (let k in tenantTypeMap) {
        if ([1, 2, 5].includes(+k)) {
          tenantTypeOptions.push({
            id: +k,
            name: tenantTypeMap[k]
          })
        }
      }
      
      this.formItems = [
        {
          label: '商户类别',
          field: 'tenantType',
          type: 2,
          value: row.tenantType || 1,
          options: tenantTypeOptions,
          required: true,
          show: !this.id
        },
        {
          label: '商户帐号',
          field: 'tenantAccount',
          type: 1,
          value: row.tenantAccount,
          required: true,
          disabled: !!this.id
        },
        {
          label: '商户名称',
          field: 'tenantName',
          type: 1,
          value: row.tenantName,
          required: true
        },
        {
          label: '目的地',
          field: 'destinations',
          class: 'form-item--dest',
          type: 2,
          value: row.destinations || [],
          options: [],
          required: true,
          disabled: true,
          multiple: true,
          on: {
            click: this.handleDestClick
          }
        },
        Object.assign({
          label: '所在国家',
          itemWidth: '50%',
          required: true
        }, this.buildCountryItem({ row: row.info })),
        Object.assign({
          label: '所在城市',
          itemWidth: '50%',
          required: true
        }, this.buildCityItem({ row: row.info })),
        {
          label: '详细地址',
          field: 'info.address',
          type: 1,
          value: this.info.address,
          required: true
        },
        {
          label: '联系人',
          field: 'info.contactName',
          type: 1,
          value: this.info.contactName,
          required: true
        },
        {
          label: '联系电话',
          field: 'info.contactPhone',
          type: 1,
          value: this.info.contactPhone,
          required: true
        },
        {
          label: '联系邮箱',
          field: 'info.contactEmail',
          type: 1,
          value: this.info.contactEmail,
          required: true
        },
        {
          label: '商户等级',
          field: 'info.tenantLevel',
          type: 2,
          value: row.tenantLevel,
          required: true
        },
        {
          label: '银行账户名',
          field: 'identification.bankAccountName',
          type: 1,
          value: this.identification.bankAccountName,
          required: true
        },
        {
          label: '开户银行',
          field: 'identification.bankOpenBranch',
          type: 1,
          value: this.identification.bankOpenBranch,
          required: true
        },
        {
          label: '银行账号',
          field: 'identification.bankAccountNo',
          type: 1,
          value: this.identification.bankAccountNo,
          required: true
        },
        {
          label: '统一社会信用代码',
          field: 'identification.societyCode',
          type: 1,
          value: this.identification.societyCode,
          required: true
        },
        {
          label: '资质文件',
          field: 'identification.qualificationFile',
          value: this.identification.qualificationFile,
          config: {
            // max: 1,
            preview: true,
            dataType: 'string',
            fileType: 'jpg,jpeg,png',
            btnIcon: 'el-icon-plus'
          },
          component: AppUpload
        },
        {
          label: '备注信息',
          field: 'info.remark',
          type: 5,
          value: this.info.remark
        },
        {
          label: '账户启用状态',
          field: 'status',
          type: 3,
          value: row.status || 1,
          options: this.$t('rs.status')
        }
      ]

      this.formResave = true

      this.formBtns = [{
        label: '保存',
        code: 'confirm'
      }]

      this.formResaveDone()

      this.destCheckeds = row.destinations
      
      this.tenantLevelGetKV().then(res => {
        let levels = res.data || []
        if (levels.length) {
          let val = levels[0].id
          if (row.tenantLevel) {
            levels.forEach(v => {
              if (v.name == row.tenantLevel) {
                val = v.id
              }
            })
          }
          this.updateFormItem('info.tenantLevel', 'options', levels)
          this.updateFormItem('info.tenantLevel', 'value', val)
        }
      })

      this.destKV().then(res => {
        this.dests = (res.data || []).map(v => {
          v.label = v.name
          v.key = v.id
          return v
        })
        this.updateFormItem('destinations', 'options', this.dests)
        this.updateFormItem('destinations', 'value', row.destinations)
      })
      
    },
    handleDestClick() {
      this.dialogWidth = '540px'
      this.dialogHeight = '500px'
      this.dialogTitle = `选择目的地`
      this.dialogForm = null
      this.dialogComponent = 'Dest'
      this.dialogVisible = true
    },
    destinationSelect(checkeds) {
      let ids = checkeds.map(v => v.id)
      this.destCheckeds = ids
      this.updateFormItem('destinations', 'value', ids)
      this.dialogVisible = false
    },
    // 表单提交
    formSubmit(form) {
      let params = { ...form }

      this.id && (params.id = this.id)
      
      params.info.cityId = params.cityId
      params.info.countryId = params.countryId
      
      this.$emit('submit', params)
    },
    ...mapActions('tenant', [
      'tenantLevelGetKV'
    ]),
    ...mapActions('data', [
      'destKV'
    ])
  },
  mounted() {
    const self = this
    this.initForm(this.row)
    this.$nextTick(() => {
      const el = document.querySelector('.el-dialog__body')
      el.onscroll = function() {
        const vm = self.getFormItemVm('tenantType')
        if(vm && typeof vm.handleClose == 'function') {
          vm.handleClose()
        }
      }
    })
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

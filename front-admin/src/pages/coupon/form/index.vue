<template>
  <app-form
    class="app-dialog-form"
    ref="appForm"
    :init="formInit"
    :items="formItems"
    :btns="formBtns"
    :resave="formResave"
    @confirm="formSubmit"
  />
</template>

<script>
import AppForm from '@/mixins/form'
export default {
  mixins: [AppForm],
  props: {
    row: Object
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
      let row = { ...form }

      this.formResave = true

      this.$set(this.formInit, 'labelWidth', '120px')
      
      this.formItems = [
        {
          label: '是否启用',
          field: 'dataStatus',
          type: 3,
          value: row.dataStatus || 1,
          options: this.$t('rs.status')
        },
        {
          label: '优惠券名称',
          field: 'couponName	',
          type: 1,
          value: row.couponName	,
          required: true
        },
        {
          label: '优惠券类型',
          field: 'type',
          type: 2,
          value: row.type,
          options: this.$t('rs.couponType')
        },
        {
          label: '优惠券种类',
          field: 'scene',
          type: 2,
          value: row.scene,
          options: this.$t('rs.couponScene')
        },
        {
          label: '优惠券备注',
          field: 'remark',
          type: 5,
          value: row.remark
        },
        {
          label: '起止时间',
          field: ['rangeStartTime', 'rangeEndTime'],
          type: 10,
          value: row.rangeStartTime ? [row.rangeStartTime, row.rangeEndTime] : [],
        },
        {
          label: '优惠券发放数量',
          field: 'sendCount',
          type: 1,
          number: true
        }
      ]

      this.formResaveDone()
    },
    // 表单提交
    formSubmit(form) {
      // console.log(form)
      let params = { ...form }
      if(this.row && this.row.hasOwnProperty('id')) {
        params.id = this.row.id
      }
      this.$emit('submit', params)
    }
  },
  mounted() {
    this.initForm(this.row)
  }
}

</script>

<template>
  <el-row class="order-lawyers">
    <app-form
      class="app-search"
      :init="searchFormInit"
      :items="searchItems"
      :btns="searchBtns"
      @confirm="confirmSearch"
      @reset="confirmSearch"
      ref="searchForm"
    />
    <app-table 
      ref="appTable"
      url="/mng/order/queryManualDispatchLawyer"
      columnType="selection"
      :radio="true"
      :params="tableParams"
      :columns="columns"
      @selection-change="tableSelect"
      max-height="500px"
      :pagination="{ layout: 'prev, pager, next', background: false }"
    />
    <el-row class="btn-group ta-c mt-20">
      <el-button @click="$emit('cancel')">取消</el-button>
      <el-button type="primary" @click="onSubmit">确认</el-button>
    </el-row>
  </el-row>
</template>

<script>
  import { mapActions } from 'vuex'
  import AppTable from '@/mixins/table'
  import AppSearch from '@/mixins/search'
  export default {
    inheritAttrs: false,
    mixins: [AppTable, AppSearch],
    props: {
      row: Object
    },
    data() {
      return {
        columns: [
          {
            label: '律师名称',
            field: 'name',
          },{
            label: '律师ID',
            field: 'id',
          },{
            label: '律师评分',
            field: 'score',
          },{
            label: '擅长领域',
            field: 'goodAt',
          },
        ],
      }
    },
    methods: {
      // 初始化页面
      initPage() {
        this.$set(this.searchFormInit, 'align', 'left')

        this.searchItems = [
          {
            labelWidth: '70px',
            label: '关键词：',
            field: 'name',
            type: 1,
            placeholder: '律师名称'
          },
        ]

        this.searchBtns = [
          {
            label: '搜索',
            code: 'confirm'
          }
        ]
      },
      async onSubmit() {
        try {
          if (this.tableSelected.length) {
            const lawyerId = this.tableSelected[0].id
            this.$emit('submit', { lawyerId, id: this.$val(this.row, 'id') })
          } else {
            this.$msgError('请选律师')
          }
        } catch (e) {
          // error
        }
      }
    },
    created() {
      this.initPage()
    }
  }
</script>

<template>
  <el-row>
    <el-row class="mb-10">
      <el-row class="fl">
        <app-form
          class="app-search"
          :init="searchFormInit"
          :items="searchItems"
          :btns="searchBtns"
          @confirm="confirmSearch"
          ref="searchForm"
        />
      </el-row>
      <el-row class="fr">
        <el-button type="primary" size="small" @click="submitSelect">确认</el-button>
      </el-row>
    </el-row>
    <app-table
      url="ptTenant/queryPage"
      :params="tableParams"
      :columns="columns"
      :column-type="['selection']"
      :columns-props="columnsProps"
      @selection-change="tableSelect"
      max-height="400"
      tooltip-effect="light"
      radio
      ref="appTable"
    />
  </el-row>
</template>

<script>
  import AppTable from '@/mixins/table'
  import AppSearch from '@/mixins/search'
  export default {
    mixins: [AppTable, AppSearch],
    data() {
      return {
        columns: [
          {
            label: '总部名称',
            field: 'tenantName',
          },{
            label: '联系人',
            field: 'contactName',
            formater: (row) => this.$val(row, 'info.contactName', '')
          },{
            label: '联系电话',
            field: 'contactPhone',
            formater: (row) => this.$val(row, 'info.contactPhone', '')
          },{
            label: 'E-mail',
            field: 'contactEmail',
            formater: (row) => this.$val(row, 'info.contactEmail', '')
          },{
            label: '联系地址',
            field: 'address',
            formater: (row) => this.$val(row, 'info.address', '')
          }
        ],
        columnsProps: {
          minWidth: 100,
        },
        tableParams: {
          tenantType: 5
        }
      }
    },
    methods: {
      // 初始化页面
      initPage() {

        this.searchItems = [
          {
            label: '总部名称：',
            field: 'tenantId|id',
            placeholder: '模糊搜索',
            type: 1,
            fetchSuggestions: (value, cb) => {
              const name = value.trim()
              const tenantType = this.tenantType
              let params = {}

              if (!name) {
                cb([])
                return false
              } else {
                params.name = name
                if (tenantType) {
                  params.tenantType = tenantType
                }
              }

              this.tenantGetKV(params).then(res => {
                cb(res.data || [])
              }).catch(() => {
                cb([])
              })
            }
          }
        ]

        this.searchBtns = [
          {
            label: '查询',
            code: 'confirm'
          }
        ]
      },
      // 表单提交
      async submitSelect() {
        let id = this.tableSelected.length ? this.tableSelected[0].id : ''
        this.$emit('submit', id)
      }
    },
    mounted() {
      this.initPage()
    }
  }
</script>

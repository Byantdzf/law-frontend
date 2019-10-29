<template>
  <el-row class="page-sales-count">
    <el-card class="search-card">
      <app-form
        class="app-search"
        :init="searchFormInit"
        :items="searchItems"
        :btns="searchBtns"
        @confirm="confirmSearch"
        @reset="confirmSearch"
        ref="searchForm"
      />
    </el-card>
    <el-card class="table-card mt-20">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">商户成交数据</span>
        </el-row>
        <el-radio-group class="table-card-tabs fl ml-20" v-model="activeTab">
          <el-radio-button
            v-for="(item, index) in tabs"
            :key="index"
            :label="item.id"
          >
            {{ item.name }}
          </el-radio-button>
        </el-radio-group>
        <el-row class="fr">
          <el-button
            type="primary"
            size="small"
            @click="handleSyncData"
          >
            同步数据
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="handleBtnAction('export')"
          >
            导出数据
          </el-button>
        </el-row>
      </el-row>
      <CountPage ref="CountPage" :params="tableParams" v-if="activeTab == 0"/>
      <DetailPage ref="DetailPage" :params="tableParams" v-else/>
    </el-card>
  </el-row>
</template>

<script>
  import { mapActions } from 'vuex'
  import AppSearch from '@/mixins/search'
  import { getTimestamp } from '@/utils/tools'
  export default {
    components: {
      CountPage: () => import('./countPage'),
      DetailPage: () => import('./detailPage')
    },
    mixins: [AppSearch],
    data() {
      return {
        activeTab: 0,
        tabs: [
          {
            id: 0,
            name: '统计'
          },{
            id: 1,
            name: '列表'
          }
        ],
        tableParams: {
          tenantType: 4
        }
      }
    },
    watch: {
      activeTab() {
        this.initSearch()
      }
    },
    methods: {
      // 初始化页面
      initSearch() {
        const tenantTypeMap = this.$t('rs.tenantType')
        let tenantTypeOptions = []

        for (let k in tenantTypeMap) {
          tenantTypeOptions.push({
            id: +k,
            name: tenantTypeMap[k]
          })
        }
        
        tenantTypeOptions = tenantTypeOptions.filter(v => v.id == 4 || v.id == 6)
        
        this.$set(this.searchFormInit, 'align', 'left')

        this.searchItems = [
          {
            label: '商户类别：',
            field: 'tenantType',
            type: 2,
            options: tenantTypeOptions,
            value: 4,
            clearable: true
          },
          {
            class: 'item-tenant-name',
            labelWidth: '0px',
            field: 'tenantId|id',
            placeholder: '商户名称',
            type: 1,
            autofill: true,
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
          },
          {
            class: 'item-sales-name',
            labelWidth: '0px',
            field: 'belongSaleId|id',
            placeholder: '销售名称',
            type: 1,
            autofill: true,
            fetchSuggestions: (value, cb) => {
              const name = value.trim()

              if (!name) {
                cb([])
                return false
              }

              this.userGetKV({ name }).then(res => {
                cb(res.data || [])
              }).catch(() => {
                cb([])
              })
            }
          },
          {
            labelWidth: '0px',
            field: ['startDate', 'endDate'],
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间',
            type: 10,
            pickerOptions: {
              disabledDate(time) {
                return time.getTime() > Date.now()
              }
            }
          }
        ]

        this.searchBtns = [
          {
            label: '确认',
            code: 'confirm'
          }, {
            label: '重置',
            code: 'reset',
            type: 'default'
          }
        ]
      },
      confirmSearch(form) {
        this.tableParams = {
          ...this.tableParams,
          ...form
        }
      },
      async handleSyncData() {
        await this.syncOrdeData()
        const refName = ['CountPage', 'DetailPage'][this.activeTab]
        const ref = this.$refs[refName]
        if (ref && typeof ref.refreshTable === 'function') {
          ref.refreshTable()
        }
      },
      async handleBtnAction() {
        const url = `/salesCount/${ this.activeTab == 0 ? 'exportCount' : 'exportDetail' }`
        const searchData = this.$refs.searchForm.getData()
        const { startDate: sd, endDate: ed } = searchData
        let params = []
        
        for(let k in searchData) {
          if (searchData[k] || searchData[k] === 0) {
            params.push(`${ k }=${ searchData[k] }`)
          }
        }

        if (!sd || !ed) {
          this.$msgError('请选择起始时间，且不超过30天')
          return false
        }

        if (sd && ed && (getTimestamp(ed) - getTimestamp(sd)) > 30*24*3600*1000) {
          this.$msgError('起始时间不能超过30天')
          return false
        }

        const origin = window.location.origin

        window.open(`${ origin + url }?${ params.join('&') }`)
      },
      ...mapActions('tenant', [
        'tenantGetKV'
      ]),
      ...mapActions('user', [
        'userGetKV'
      ]),
      ...mapActions('count', [
        'salesExportCount',
        'salesExportDetail',
        'syncOrdeData'
      ])
    },
    created() {
      this.initSearch()
    }
  }
</script>

<style lang="less">
  .page-sales-count {
    .app-search {
      .el-form-item__label {
        padding-right: 0;
      }
      .item-sales-name,
      .app-form-item__select {
        .el-form-item__content {
          width: 150px;
        }
      }
      .item-tenant-name {
        .el-form-item__content {
          width: 300px;
        }
      }
      .app-form-item__daterange {
        .el-range-editor.el-input__inner {
          width: 300px;
        }
      }
    }
  }
</style>

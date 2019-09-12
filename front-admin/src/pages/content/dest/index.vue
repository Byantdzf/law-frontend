<template>
  <el-row>
    <el-card class="search-card">
      <app-form
        class="app-search"
        ref="searchForm"
        :init="searchFormInit"
        :items="searchItems"
        :btns="searchBtns"
        @confirm="confirmSearch"
        @reset="confirmSearch"
      />
    </el-card>
    <el-card class="table-card mt-10">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">目的地列表</span>
        </el-row>
        <el-row class="fr">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="handleBtnAction({}, 'add')"
          >
            添加
          </el-button>
        </el-row>
      </el-row>
      <app-table 
        url="ptDataDestination/queryPage"
        ref="appTable"
        :params="tableParams"
        :columns="columns"
        :columns-props="columnsProps"
        max-height="600"
        tooltip-effect="light"
        @selection-change="tableSelect"
      />
    </el-card>
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
        :row="dialogForm"
        @submit="formSubmit"
        @cancel="closeDialog"
      />
    </app-dialog>
  </el-row>
</template>

<script>
  import { mapActions } from 'vuex'
  import AppTable from '@/mixins/table'
  import AppDialog from '@/mixins/dialog'
  import AppSearch from '@/mixins/search'
  import AreaQuery from '@/mixins/areaQuery'
  import AppTableImgs from '@/components/app-table/lib/imgs'
  export default {
    components: {
      Edit: () => import('./edit')
    },
    mixins: [AppTable, AppDialog, AppSearch, AreaQuery],
    data() {
      return {
        columns: [
          {
            label: '国家',
            field: 'countryName',
          },{
            label: '城市',
            field: 'name',
          },{
            label: '介绍',
            field: 'checkView',
            type: 'button',
            default: '查看详情',
            on: {
              click: ({ row }) => {
                this.checkView(row)
              }
            }
          },{
            label: '图片',
            field: 'picture',
            component: AppTableImgs
          },{
            label: '操作',
            field: 'operate',
            align: 'center',
            width: 120,
            type: 'button',
            default: '编辑',
            on: {
              click: ({ row }) => {
                this.handleBtnAction(row, 'edit')
              }
            }
          }
        ],
        columnsProps: {
          minWidth: 100
        }
      }
    },
    methods: {
      // 初始化页面
      initPage() {
        this.searchItems = [
          this.buildCountryItem({}, 'searchForm'),
          this.buildCityItem({}, 'searchForm')
        ]
      },
      // 表单提交
      async formSubmit(form) {
        try {
          if(form.id) {
            await this.destUpdate(form)
            this.$msgSuccess(this.$t("message.updateSuccess"))
          } else {
            await this.destAdd(form)
            this.$msgSuccess(this.$t("message.addSuccess"))
          }
          this.closeDialog()
          this.refreshTable()
        } catch(e) {
          // error
        }
      },
      handleBtnAction(row, type) {
        const isEdit = type === 'edit' ? true : false
        this.dialogWidth = '800px'
        this.dialogHeight = '550px'
        this.dialogTitle = `${ isEdit ? '编辑' : '新增' }目的地`
        this.dialogForm = isEdit ? row : null
        this.dialogComponent = 'Edit'
        this.dialogVisible = true
      },
      checkView() {
        
      },
      ...mapActions('data', [
        'destAdd',
        'destUpdate',
        'queryAreaBlurry'
      ])
    },
    mounted() {
      this.initPage()
    },
    destroyed() {}
  }
</script>

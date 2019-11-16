<template>
  <el-row>
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
    <el-card class="table-card mt-10">
      <el-row slot="header" class="clearfix">
        <!-- <el-row class="fl">
          <span class="title">文章列表</span>
        </el-row> -->
        <el-radio-group class="table-card-tabs fl" v-model="articleType">
          <el-radio-button
            v-for="(item, index) in articleTypeItems"
            :key="index"
            :label="item.id"
          >
            {{ item.name }}
          </el-radio-button>
        </el-radio-group>
        <el-row class="fr">
          <el-button type="primary" @click="handleBtnAction({}, 'add')">新增</el-button>
          <el-button type="danger" @click="handleMultiDel">删除</el-button>
        </el-row>
      </el-row>
      <app-table 
        ref="appTable"
        url="/pc/mgr/article"
        columnType="selection"
        :params="tableParams"
        :columns="columns"
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
        :is="dialogComponent"
        :row="dialogForm"
        @submit="formSubmit"
        @cancel="closeDialog"
        ref="dialogComponent"
      />
    </app-dialog>
  </el-row>
</template>

<script>
  import { mapActions } from 'vuex'
  import AppTable from '@/mixins/table'
  import AppDialog from '@/mixins/dialog'
  import AppSearch from '@/mixins/search'
  import AppTableImgs from '@/components/app-table/lib/imgs'
  import AppRsText from '@/components/app-table/lib/rsText'
  export default {
    components: {
      Edit: () => import("./edit")
    },
    mixins: [AppTable, AppDialog, AppSearch],
    data() {
      return {
        columns: [
          {
            label: '序号',
            field: 'index',
            width: 70
          },{
            label: '端口',
            field: 'terminal',
            formater: ({ terminal }) => this.$t('rs.articleTerminal')[terminal]
          },{
            label: '文章标题',
            field: 'title'
          },{
            label: '类型',
            field: 'type',
            formater: ({ type }) => this.$t('rs.adType')[type]
          },{
            label: '状态',
            field: 'status',
            width: 110,
            align: 'center',
            rs: 'articleStatus',
            component: AppRsText,
            propsHandler ({ col, row }) {
              return {
                col,
                row,
                type: row[col.prop] == 1 ? 'success' : 'danger'
              } 
            }
          },{
            label: '更新时间',
            field: 'publishTime'
          },{
            label: '操作',
            field: 'operate',
            align: 'center',
            width: 120,
            type: 'button',
            items: ['修改', '删除'],
            on: {
              click: ({ row, index }) => {
                this.handleBtnAction(row, index == 0 ? 'edit' : 'del')
              }
            }
          }
        ],
        articleType: 1,
        articleTypeItems: [],
        tableParams: {
          type: 1
        }
      }
    },
    watch: {
      articleType(type) {
        this.tableParams = {
          ...this.tableParams,
          type
        }
      }
    },
    methods: {
      // 初始化页面
      initPage() {
        this.$set(this.searchFormInit, 'align', 'left')

        this.searchItems = [
          {
            label: '状态：',
            field: 'status',
            type: 2,
            options: this.$t('rs.articleStatus')
          },
          {
            label: '关键词：',
            field: 'keyword',
            type: 1
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

        for(let k in this.$t('rs.articleType')) {
          this.articleTypeItems.push({
            id: +k,
            name: this.$t('rs.articleType')[k]
          })
        }
      },
      // 表单提交
      async formSubmit(form) {
        try {
          if ('id' in form) {
            await this.articleUpdate(form)
            this.closeDialog()
            this.refreshTable()
            this.$msgSuccess('修改成功')
          } else {
            await this.articleAdd(form)
            this.closeDialog()
            this.refreshTable()
            this.$msgSuccess('添加成功')
          }
        } catch (e) {
          // error
        }
      },
      async handleBtnAction(row, type) {
        try {
          switch (type) {
            case 'add':
              this.dialogWidth = '600px'
              this.dialogTitle = '新增文章'
              this.dialogForm = null
              this.dialogComponent = 'Edit'
              this.dialogVisible = true
              break;
            case 'edit':
              this.dialogWidth = '600px'
              this.dialogTitle = '编辑文章'
              this.dialogForm = row
              this.dialogComponent = 'Edit'
              this.dialogVisible = true
              break;
            case 'del':
              await this.$confirm('确认删除此文章吗?', '温馨提示', { type: 'warning' })
              await this.articleDel(row.id)
              this.$msgSuccess('操作成功！')
              this.refreshTable()
              break;
          }
        } catch (error) {
          
        }
      },
      async handleMultiDel() {
        if (this.tableSelected.length) {
          try {
            let ids = this.tableSelected.map(v => v.id).join(',')
            await this.$confirm('确认删除选中的文章吗?', '温馨提示', { type: 'warning' })
            await this.articleDel(ids)
            this.$msgSuccess('操作成功！')
            this.refreshTable()
          } catch (error) {
            
          }
        } else {
          this.$msgError('请选择需要删除的数据')
        }
      },
      ...mapActions('content', [
        'articleAdd',
        'articleUpdate',
        'articleDel'
      ])
    },
    created() {
      this.initPage()
    }
  }
</script>
